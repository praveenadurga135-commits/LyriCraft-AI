from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SongSection(BaseModel):
    type: str = Field(..., description="Section title, e.g. 'Verse 1', 'Chorus', 'Bridge'")
    lines: List[str] = Field(..., description="The lyrical lines within this section")

class Song(BaseModel):
    title: str = Field(..., description="Song title")
    concept: str = Field(..., description="Short description of the song narrative and concept")
    sections: List[SongSection] = Field(..., description="Sections making up the complete song")
    overall_rhyme_style: Optional[str] = Field(default="AABB / ABAB dynamic", description="Summary of rhyme style used")
    songwriting_notes: Optional[str] = Field(default="", description="Professional tips on delivery, cadence, or dynamics")

class LineAnalysis(BaseModel):
    line: str
    syllables: int
    end_word: str
    rhyme_label: str
    rhyme_group: int

class SectionAnalysis(BaseModel):
    type: str
    rhyme_scheme: str
    lines: List[LineAnalysis]
    avg_syllables: float = 0.0

class SongAnalysis(BaseModel):
    rhyme_scheme: str
    sections: List[SectionAnalysis]
    total_syllables: int
    avg_syllables_per_line: float
    explanation: str = "Estimated syllable counts and end-rhyme groupings — ideal for evaluating vocal rhythm and lyrical flow."

class MoodBoardData(BaseModel):
    bpm: str
    instruments: List[str]
    vibes: List[str]
    description: Optional[str] = ""

class SongGenerateRequest(BaseModel):
    mood: str
    genre: str
    theme: str
    structure: List[str] = Field(default_factory=lambda: ["Verse 1", "Chorus", "Verse 2", "Chorus", "Bridge", "Chorus"])

class RegenerateSectionRequest(BaseModel):
    song_context: str
    section_type: str
    mood: str
    genre: str
    theme: str
    structure: Optional[str] = ""

class RegenerateSectionResponse(BaseModel):
    section: SongSection
    analysis: SectionAnalysis
    message: str = "Section successfully rewritten"

class AnalyzeLyricsRequest(BaseModel):
    sections: List[SongSection]

class RhymeSuggestionsRequest(BaseModel):
    word: str
    max_results: Optional[int] = 16

class RhymeSuggestionsResponse(BaseModel):
    word: str
    rhymes: List[str]
    pronunciation_found: bool

class SongResponse(BaseModel):
    song: Song
    analysis: SongAnalysis
    mood_board: MoodBoardData
    mode: str = "gemini"  # "gemini" or "curated_fallback"
