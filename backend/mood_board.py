import json
import os
from typing import Dict, Any, List
from models import MoodBoardData

# Locate mapping file relative to backend or project root
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
POSSIBLE_PATHS = [
    os.path.join(CURRENT_DIR, "..", "data", "mood_genre_mapping.json"),
    os.path.join(CURRENT_DIR, "data", "mood_genre_mapping.json"),
    os.path.join(CURRENT_DIR, "mood_genre_mapping.json"),
]

MAPPING_CACHE: Dict[str, Any] = {}

def load_mapping_data() -> Dict[str, Any]:
    """Loads and caches the mood/genre mapping JSON file."""
    global MAPPING_CACHE
    if MAPPING_CACHE:
        return MAPPING_CACHE

    for path in POSSIBLE_PATHS:
        normalized = os.path.normpath(path)
        if os.path.exists(normalized):
            try:
                with open(normalized, "r", encoding="utf-8") as f:
                    MAPPING_CACHE = json.load(f)
                    return MAPPING_CACHE
            except Exception as e:
                print(f"Warning: Failed reading {normalized}: {e}")

    # Fallback structure if file is missing
    return {
        "genre_mood_combinations": {},
        "genre_defaults": {},
        "mood_defaults": {},
        "generic_fallback": {
            "bpm": "85–105 BPM",
            "instruments": ["🎸 Acoustic Guitar", "🎹 Studio Grand Piano", "🥁 Dynamic Drum Groove", "🎻 Chamber Strings"],
            "vibes": ["Expressive", "Melodic", "Atmospheric", "Dynamic"],
            "description": "Versatile studio arrangement offering wide expressive dynamics."
        }
    }

def get_mood_board_data(genre: str, mood: str) -> MoodBoardData:
    """
    Resolves BPM, instrumentation, and vibe descriptors using a strict 3-tier fallback strategy:
    1. Exact genre + mood combination
    2. Genre default
    3. Mood default
    4. Universal generic fallback
    """
    data = load_mapping_data()
    g_clean = genre.strip().lower()
    m_clean = mood.strip().lower()
    combo_key = f"{g_clean}_{m_clean}"

    combos = data.get("genre_mood_combinations", {})
    genre_defaults = data.get("genre_defaults", {})
    mood_defaults = data.get("mood_defaults", {})
    generic = data.get("generic_fallback", {
        "bpm": "85–105 BPM",
        "instruments": ["🎸 Acoustic Guitar", "🎹 Studio Grand Piano", "🥁 Dynamic Drum Groove", "🎻 Chamber Strings"],
        "vibes": ["Expressive", "Melodic", "Atmospheric", "Dynamic"],
        "description": "Versatile studio arrangement offering wide dynamic range."
    })

    # 1. Exact match
    if combo_key in combos:
        match = combos[combo_key]
        return MoodBoardData(
            bpm=match.get("bpm", generic["bpm"]),
            instruments=match.get("instruments", generic["instruments"]),
            vibes=match.get("vibes", generic["vibes"]),
            description=match.get("description", "")
        )

    # 2. Genre fallback
    if g_clean in genre_defaults:
        match = genre_defaults[g_clean]
        # Supplement vibes with mood vibes if available
        mood_vibes = mood_defaults.get(m_clean, {}).get("vibes", [])
        combined_vibes = list(dict.fromkeys(match.get("vibes", []) + mood_vibes))
        return MoodBoardData(
            bpm=match.get("bpm", generic["bpm"]),
            instruments=match.get("instruments", generic["instruments"]),
            vibes=combined_vibes or match.get("vibes", generic["vibes"]),
            description=f"Tailored {genre} sonic palette adapted for {mood} songwriting."
        )

    # 3. Mood fallback
    if m_clean in mood_defaults:
        match = mood_defaults[m_clean]
        return MoodBoardData(
            bpm=match.get("bpm", generic["bpm"]),
            instruments=match.get("instruments", generic["instruments"]),
            vibes=match.get("vibes", generic["vibes"]),
            description=f"Atmospheric soundscape curated to evoke {mood} emotional resonance."
        )

    # 4. Universal generic fallback
    return MoodBoardData(
        bpm=generic["bpm"],
        instruments=generic["instruments"],
        vibes=generic["vibes"],
        description=generic.get("description", "Balanced studio acoustic arrangement.")
    )
