import sys
import os

# Set path to current directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from syllable_counter import count_line_syllables
from rhyme_analyzer import words_rhyme, analyze_section_rhymes, get_rhyme_suggestions
from mood_board import get_mood_board_data

client = TestClient(app)

def run_tests():
    print("========================================")
    print("🎵 RUNNING LYRICRAFT AI AUTOMATED TEST SUITE")
    print("========================================")

    # 1. Test Health Endpoint
    print("\n1. Testing GET /api/health...")
    health_resp = client.get("/api/health")
    assert health_resp.status_code == 200, f"Health check failed: {health_resp.text}"
    health_data = health_resp.json()
    print("   ✓ Health Status:", health_data.get("status"))
    print("   ✓ Service:", health_data.get("service"))
    print("   ✓ Active Model:", health_data.get("gemini_model"))
    print("   ✓ CMU Pronouncing Active:", health_data.get("cmu_pronouncing_active"))

    # 2. Test Syllable Counter
    print("\n2. Testing Syllable Counter...")
    line1 = "I walk beneath the stars"
    syl1 = count_line_syllables(line1)
    print(f"   ✓ '{line1}' -> {syl1} syllables")
    assert syl1 == 6, f"Expected 6 syllables, got {syl1}"

    line2 = "Your memory still remains"
    syl2 = count_line_syllables(line2)
    print(f"   ✓ '{line2}' -> {syl2} syllables")
    assert syl2 == 7, f"Expected 7 syllables, got {syl2}"

    # 3. Test Rhyme Analyzer & Scheme Detection
    print("\n3. Testing Rhyme Analyzer & Scheme Detection...")
    assert words_rhyme("light", "night") is True, "light and night should rhyme"
    assert words_rhyme("away", "stay") is True, "away and stay should rhyme"
    assert words_rhyme("light", "away") is False, "light and away should not rhyme"

    test_lines = [
        "I walk beneath the evening light",
        "I dream about you every night",
        "The city slowly fades away",
        "I still wish that you would stay"
    ]
    scheme, analyzed_lines = analyze_section_rhymes(test_lines)
    print(f"   ✓ Detected Scheme: {scheme}")
    assert scheme == "A A B B", f"Expected 'A A B B', got '{scheme}'"
    print("   ✓ End words & labels:")
    for al in analyzed_lines:
        print(f"     - '{al['line']}' -> {al['end_word']} ({al['rhyme_label']}, group {al['rhyme_group']})")

    # 4. Test Rhyme Suggestions
    print("\n4. Testing Rhyme Suggestions Endpoint...")
    rhyme_resp = client.post("/api/rhyme-suggestions", json={"word": "light", "max_results": 10})
    assert rhyme_resp.status_code == 200, f"Rhyme suggestions failed: {rhyme_resp.text}"
    rhymes = rhyme_resp.json().get("rhymes", [])
    print(f"   ✓ Found {len(rhymes)} rhymes for 'light': {rhymes[:6]}")
    assert len(rhymes) > 0, "Expected at least 1 rhyme suggestion"

    # 5. Test Mood Board Resolver (3-tier fallback)
    print("\n5. Testing Mood Board Engine...")
    mb = get_mood_board_data(genre="Indie Folk", mood="Hopeful")
    print("   ✓ Exact match (Indie Folk + Hopeful):", mb.bpm)
    print("   ✓ Instruments:", mb.instruments[:3])
    print("   ✓ Vibes:", mb.vibes[:3])
    assert mb.bpm is not None and len(mb.instruments) > 0, "Mood board data incomplete"

    # Fallback test
    mb_fallback = get_mood_board_data(genre="UnknownGenre", mood="UnknownMood")
    print("   ✓ Generic fallback tempo:", mb_fallback.bpm)
    assert mb_fallback.bpm is not None

    # 6. Test POST /api/generate-song
    print("\n6. Testing POST /api/generate-song...")
    payload = {
        "mood": "Hopeful",
        "genre": "Indie Folk",
        "theme": "Moving to a new city alone with cardboard boxes",
        "structure": ["Verse 1", "Chorus", "Verse 2", "Chorus", "Bridge", "Chorus"]
    }
    gen_resp = client.post("/api/generate-song", json=payload)
    assert gen_resp.status_code == 200, f"Song generation failed: {gen_resp.text}"
    gen_data = gen_resp.json()
    song = gen_data["song"]
    analysis = gen_data["analysis"]
    mood_board = gen_data["mood_board"]

    print("   ✓ Song Title:", song["title"])
    print("   ✓ Concept:", song["concept"][:60] + "...")
    print(f"   ✓ Generated {len(song['sections'])} sections")
    print("   ✓ Overall Rhyme Scheme:", analysis["rhyme_scheme"])
    print(f"   ✓ Total Syllables: {analysis['total_syllables']} (Avg {analysis['avg_syllables_per_line']} / line)")
    print("   ✓ Mood Board BPM:", mood_board["bpm"])

    # 7. Test POST /api/regenerate-section
    print("\n7. Testing POST /api/regenerate-section...")
    regen_payload = {
        "song_context": f"Song Title: {song['title']}\nConcept: {song['concept']}",
        "section_type": "Chorus",
        "mood": "Hopeful",
        "genre": "Indie Folk",
        "theme": "Moving to a new city alone",
        "structure": "Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus"
    }
    regen_resp = client.post("/api/regenerate-section", json=regen_payload)
    assert regen_resp.status_code == 200, f"Regen failed: {regen_resp.text}"
    regen_data = regen_resp.json()
    print("   ✓ Rewritten Section:", regen_data["section"]["type"])
    print(f"   ✓ New Lines ({len(regen_data['section']['lines'])}):")
    for l in regen_data["section"]["lines"]:
        print(f"     \"{l}\"")
    print("   ✓ Rewritten Section Rhyme Scheme:", regen_data["analysis"]["rhyme_scheme"])

    # 8. Test POST /api/analyze
    print("\n8. Testing POST /api/analyze with custom user edits...")
    custom_sections = [
        {"type": "Verse 1", "lines": ["I packed my bags before the dawn", "And now the quiet fears are gone"]},
        {"type": "Chorus", "lines": ["This is the sound of moving on", "Into the light where I belong"]}
    ]
    analyze_resp = client.post("/api/analyze", json={"sections": custom_sections})
    assert analyze_resp.status_code == 200, f"Analysis failed: {analyze_resp.text}"
    custom_analysis = analyze_resp.json()
    print("   ✓ Re-analyzed total syllables:", custom_analysis["total_syllables"])
    print("   ✓ Re-analyzed rhyme scheme:", custom_analysis["rhyme_scheme"])

    print("\n========================================")
    print("🎉 ALL TESTS PASSED SUCCESSFULLY! (8/8)")
    print("========================================")

if __name__ == "__main__":
    run_tests()
