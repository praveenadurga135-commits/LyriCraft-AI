import re
from typing import List, Dict, Optional, Tuple, Set

try:
    import pronouncing
    PRONOUNCING_AVAILABLE = True
except ImportError:
    pronouncing = None
    PRONOUNCING_AVAILABLE = False

from syllable_counter import count_line_syllables, clean_word

# Common phonetic family fallbacks for words when CMU dictionary is unavailable
COMMON_RHYME_FAMILIES = {
    "ight": ["night", "bright", "sight", "light", "flight", "tonight", "fight", "height", "white", "right", "tight"],
    "ite": ["night", "bright", "sight", "light", "flight", "tonight", "fight", "white", "right", "tight"],
    "ay": ["day", "stay", "away", "play", "gray", "say", "way", "may", "pray", "sway", "today"],
    "ey": ["day", "stay", "away", "play", "gray", "say", "way", "today"],
    "eigh": ["day", "stay", "away", "play", "way"],
    "ound": ["sound", "ground", "bound", "round", "found", "around", "profound"],
    "own": ["down", "town", "brown", "crown", "drown"],
    "art": ["heart", "start", "part", "apart", "dart", "smart"],
    "eart": ["heart", "start", "part", "apart", "smart"],
    "eep": ["deep", "keep", "sleep", "weep", "creep", "asleep"],
    "eam": ["dream", "gleam", "beam", "stream", "seem", "scream"],
    "ear": ["near", "dear", "clear", "here", "fear", "tear", "cheer"],
    "ere": ["near", "dear", "clear", "here", "fear", "cheer"],
    "ire": ["fire", "desire", "higher", "wire", "inspire", "tire"],
    "y": ["sky", "high", "fly", "cry", "try", "goodbye", "why", "sigh", "lie", "die"],
    "ie": ["sky", "high", "fly", "cry", "try", "goodbye", "why", "lie", "die"],
    "igh": ["sky", "high", "fly", "cry", "try", "goodbye", "sigh"],
    "ace": ["place", "space", "face", "race", "chase", "grace", "embrace"],
    "ove": ["love", "above", "dove"],
    "ore": ["more", "shore", "door", "floor", "before", "roar", "store"],
    "oar": ["more", "shore", "door", "floor", "before", "roar"],
    "all": ["call", "fall", "wall", "small", "hall", "all"],
    "old": ["cold", "hold", "gold", "told", "bold", "untold"],
    "ine": ["shine", "mine", "line", "fine", "divine", "time", "sign"],
    "ain": ["rain", "pain", "stain", "remain", "again", "drain", "vein"],
    "ane": ["rain", "pain", "stain", "remain", "lane", "plane"]
}

def extract_end_word(line: str) -> str:
    """Extracts the final word of a lyric line, stripped of punctuation."""
    if not line:
        return ""
    # Find all word sequences
    words = re.findall(r"[a-zA-Z0-9']+", line.strip())
    if not words:
        return ""
    return clean_word(words[-1])

def get_word_rhyme_ending(word: str) -> Optional[str]:
    """Returns the rhyming part from CMU phones if available."""
    if not PRONOUNCING_AVAILABLE or pronouncing is None:
        return None
    try:
        phones = pronouncing.phones_for_word(word.lower())
        if phones:
            return pronouncing.rhyming_part(phones[0])
    except Exception:
        pass
    return None

def words_rhyme(word1: str, word2: str) -> bool:
    """
    Determines whether two words form an end-rhyme.
    Uses CMU Pronouncing Dictionary phonetics when available;
    falls back to phonological suffix heuristics.
    """
    w1 = clean_word(word1)
    w2 = clean_word(word2)

    if not w1 or not w2:
        return False

    # Identity / same word
    if w1 == w2:
        return True

    # 1. CMU pronouncing dictionary check
    phones1 = None
    phones2 = None
    if PRONOUNCING_AVAILABLE and pronouncing is not None:
        try:
            p1_list = pronouncing.phones_for_word(w1)
            p2_list = pronouncing.phones_for_word(w2)
            if p1_list and p2_list:
                phones1 = p1_list[0]
                phones2 = p2_list[0]

                # Direct rhyme check via pronouncing
                if w2 in pronouncing.rhymes(w1) or w1 in pronouncing.rhymes(w2):
                    return True

                part1 = pronouncing.rhyming_part(phones1)
                part2 = pronouncing.rhyming_part(phones2)
                if part1 and part2 and part1 == part2:
                    return True

                # If both words exist in CMU dictionary with known phones and their rhyming parts don't match,
                # then they don't form a perfect rhyme.
                return False
        except Exception:
            pass

    # 2. Heuristic fallback when one or both words are not in CMU dictionary
    for suffix, family in COMMON_RHYME_FAMILIES.items():
        w1_match = (w1 in family) or w1.endswith(suffix)
        w2_match = (w2 in family) or w2.endswith(suffix)
        if w1_match and w2_match:
            return True

    # Check 3+ character matching suffix if ends with vowels + consonants
    if len(w1) >= 3 and len(w2) >= 3:
        if w1[-3:] == w2[-3:] and any(c in "aeiouy" for c in w1[-3:]):
            return True
        if len(w1) >= 4 and len(w2) >= 4 and w1[-4:] == w2[-4:]:
            return True

    return False

def analyze_section_rhymes(lines: List[str]) -> Tuple[str, List[Dict]]:
    """
    Analyzes the end-rhymes of a single song section (e.g. a Verse or Chorus).
    Returns:
      - rhyme_scheme string (e.g., 'A A B B' or 'A B A B')
      - line_analyses list containing syllable count, end word, rhyme label, and rhyme group index.
    """
    if not lines:
        return "", []

    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    end_words = [extract_end_word(l) for l in lines]
    n = len(lines)

    # Group index for each line (-1 initially)
    groups = [-1] * n
    next_group = 0

    for i in range(n):
        if groups[i] != -1:
            continue
        w1 = end_words[i]
        if not w1:
            continue

        # Look for rhyming partner among subsequent lines
        has_rhyme_partner = False
        for j in range(i + 1, n):
            w2 = end_words[j]
            if w2 and words_rhyme(w1, w2):
                if not has_rhyme_partner:
                    groups[i] = next_group
                    has_rhyme_partner = True
                groups[j] = next_group

        if has_rhyme_partner:
            next_group += 1

    # For lines without rhymes, assign distinct standalone group
    for i in range(n):
        if groups[i] == -1:
            groups[i] = next_group
            next_group += 1

    # Map groups to labels: A, B, C...
    # Keep the earliest appearing groups labeled in order of appearance
    group_to_label = {}
    label_counter = 0

    labels = []
    for g in groups:
        if g not in group_to_label:
            group_to_label[g] = alphabet[label_counter % len(alphabet)]
            label_counter += 1
        labels.append(group_to_label[g])

    scheme_str = " ".join(labels)

    line_analyses = []
    for i, line in enumerate(lines):
        syllables = count_line_syllables(line)
        line_analyses.append({
            "line": line,
            "syllables": syllables,
            "end_word": end_words[i],
            "rhyme_label": labels[i],
            "rhyme_group": groups[i]
        })

    return scheme_str, line_analyses

def get_rhyme_suggestions(word: str, max_results: int = 16) -> Dict:
    """
    Returns a list of high-quality, singable rhyming suggestions for a given word.
    Uses CMU Pronouncing Dictionary when possible; falls back to curated rhyme families.
    """
    cleaned = clean_word(word)
    if not cleaned:
        return {"word": word, "rhymes": [], "pronunciation_found": False}

    results: List[str] = []
    found_in_cmu = False

    if PRONOUNCING_AVAILABLE and pronouncing is not None:
        try:
            cmu_rhymes = pronouncing.rhymes(cleaned)
            if cmu_rhymes:
                found_in_cmu = True
                # Clean and filter out words containing non-alphabetic characters or identical word
                cleaned_rhymes = [
                    r.lower() for r in cmu_rhymes 
                    if r.lower() != cleaned and re.match(r"^[a-zA-Z]+$", r)
                ]
                # Prioritize shorter, more common lyric words first (length <= 9)
                common_rhymes = [r for r in cleaned_rhymes if len(r) <= 8]
                other_rhymes = [r for r in cleaned_rhymes if len(r) > 8]
                results = (common_rhymes + other_rhymes)[:max_results]
        except Exception:
            pass

    # Fallback to rhyme families if no CMU rhymes found
    if not results:
        # Check against common rhyme families
        for suffix, family in COMMON_RHYME_FAMILIES.items():
            if cleaned in family or cleaned.endswith(suffix):
                matched = [w for w in family if w != cleaned]
                results.extend(matched)
                break

    # If still empty, check standard suffix matches
    if not results and len(cleaned) >= 3:
        ending = cleaned[-3:]
        for family in COMMON_RHYME_FAMILIES.values():
            matched = [w for w in family if w.endswith(ending) and w != cleaned]
            if matched:
                results.extend(matched)
                break

    # Deduplicate while preserving order
    deduped = []
    seen = set()
    for r in results:
        if r not in seen and r != cleaned:
            seen.add(r)
            deduped.append(r)

    return {
        "word": cleaned,
        "rhymes": deduped[:max_results],
        "pronunciation_found": found_in_cmu or len(deduped) > 0
    }
