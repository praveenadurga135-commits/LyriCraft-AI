import os
from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import (
    SongGenerateRequest,
    SongResponse,
    Song,
    SongSection,
    SongAnalysis,
    SectionAnalysis,
    RegenerateSectionRequest,
    RegenerateSectionResponse,
    AnalyzeLyricsRequest,
    RhymeSuggestionsRequest,
    RhymeSuggestionsResponse,
    MoodBoardData
)
from ai_generator import (
    generate_song_lyrics,
    regenerate_single_section,
    is_gemini_configured,
    GEMINI_MODEL
)
from rhyme_analyzer import (
    analyze_section_rhymes,
    get_rhyme_suggestions,
    PRONOUNCING_AVAILABLE
)
from syllable_counter import count_line_syllables
from mood_board import get_mood_board_data

# Initialize environment
load_dotenv()

app = FastAPI(
    title="LyriCraft AI API",
    description="Backend API for AI Music Lyrics & Song Concept Generator",
    version="1.0.0"
)

# Configure CORS for local development and demo environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def perform_full_song_analysis(sections: List[SongSection]) -> SongAnalysis:
    """
    Performs complete end-rhyme and syllable count analysis across all song sections.
    """
    section_analyses: List[SectionAnalysis] = []
    total_syllables = 0
    total_lines = 0
    schemes = []

    for sec in sections:
        scheme_str, line_data = analyze_section_rhymes(sec.lines)
        schemes.append(scheme_str)
        sec_syl = sum(l["syllables"] for l in line_data)
        total_syllables += sec_syl
        total_lines += len(sec.lines)
        avg_sec_syl = round(sec_syl / len(sec.lines), 1) if sec.lines else 0.0

        section_analyses.append(SectionAnalysis(
            type=sec.type,
            rhyme_scheme=scheme_str,
            lines=line_data,
            avg_syllables=avg_sec_syl
        ))

    overall_scheme = " | ".join(s for s in schemes if s)
    avg_per_line = round(total_syllables / total_lines, 1) if total_lines else 0.0

    return SongAnalysis(
        rhyme_scheme=overall_scheme or "Dynamic",
        sections=section_analyses,
        total_syllables=total_syllables,
        avg_syllables_per_line=avg_per_line,
        explanation="Estimated syllable counts and end-rhyme groupings — ideal for evaluating vocal rhythm and lyrical flow."
    )

@app.get("/api/health", tags=["System"])
async def health_check():
    """Returns system status, active Gemini model, and NLP engine capabilities."""
    return {
        "status": "healthy",
        "service": "LyriCraft AI",
        "version": "1.0.0",
        "gemini_configured": is_gemini_configured(),
        "gemini_model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        "cmu_pronouncing_active": PRONOUNCING_AVAILABLE
    }

@app.post("/api/generate-song", response_model=SongResponse, tags=["Songwriting"])
async def generate_song(req: SongGenerateRequest):
    """
    Generates an original song with structured sections, complete lyric analytics,
    and a custom music mood board based on mood, genre, theme, and structure.
    """
    # Validation
    if not req.mood or not req.mood.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mood is required.")
    if not req.genre or not req.genre.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Genre is required.")
    if not req.theme or not req.theme.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song theme is required.")
    if not req.structure or len(req.structure) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song structure must contain at least one section.")

    try:
        # 1. AI Lyric Generation
        raw_song_data = await generate_song_lyrics(
            mood=req.mood,
            genre=req.genre,
            theme=req.theme,
            structure=req.structure
        )

        sections = [SongSection(**s) for s in raw_song_data.get("sections", [])]
        song = Song(
            title=raw_song_data.get("title", "Untitled Song"),
            concept=raw_song_data.get("concept", f"An original song exploring {req.theme}"),
            sections=sections,
            overall_rhyme_style=raw_song_data.get("overall_rhyme_style", "Dynamic lyricism"),
            songwriting_notes=raw_song_data.get("songwriting_notes", "")
        )

        # 2. Syllable & Rhyme Scheme Analysis
        analysis = perform_full_song_analysis(sections)

        # 3. Mood Board Generation
        mood_board = get_mood_board_data(genre=req.genre, mood=req.mood)

        return SongResponse(
            song=song,
            analysis=analysis,
            mood_board=mood_board,
            mode=raw_song_data.get("mode", "gemini")
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Song generation failed: {str(e)}"
        )

@app.post("/api/regenerate-section", response_model=RegenerateSectionResponse, tags=["Songwriting"])
async def regenerate_section(req: RegenerateSectionRequest):
    """
    Rewrites a single designated song section without modifying the surrounding song.
    """
    if not req.section_type or not req.section_type.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Section type is required.")

    try:
        raw_section = await regenerate_single_section(
            song_context=req.song_context,
            section_type=req.section_type,
            mood=req.mood,
            genre=req.genre,
            theme=req.theme
        )

        new_section = SongSection(
            type=raw_section.get("type", req.section_type),
            lines=raw_section.get("lines", ["New lines could not be generated."])
        )

        # Re-analyze just this section
        scheme_str, line_data = analyze_section_rhymes(new_section.lines)
        sec_syl = sum(l["syllables"] for l in line_data)
        avg_sec_syl = round(sec_syl / len(new_section.lines), 1) if new_section.lines else 0.0

        sec_analysis = SectionAnalysis(
            type=new_section.type,
            rhyme_scheme=scheme_str,
            lines=line_data,
            avg_syllables=avg_sec_syl
        )

        return RegenerateSectionResponse(
            section=new_section,
            analysis=sec_analysis,
            message=f"{req.section_type} rewritten successfully."
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Section regeneration failed: {str(e)}"
        )

@app.post("/api/analyze", response_model=SongAnalysis, tags=["Analysis"])
async def analyze_lyrics(req: AnalyzeLyricsRequest):
    """
    Analyzes user-edited or provided lyrics for syllables, end-rhymes, and rhyme schemes.
    """
    if not req.sections:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sections are required for analysis.")

    try:
        return perform_full_song_analysis(req.sections)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lyric analysis failed: {str(e)}"
        )

@app.post("/api/rhyme-suggestions", response_model=RhymeSuggestionsResponse, tags=["Assistant"])
async def rhyme_suggestions(req: RhymeSuggestionsRequest):
    """
    Returns musical rhyme suggestions for a specific word to assist songwriting flow.
    """
    if not req.word or not req.word.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Word parameter is required.")

    data = get_rhyme_suggestions(word=req.word, max_results=req.max_results or 16)
    return RhymeSuggestionsResponse(**data)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
