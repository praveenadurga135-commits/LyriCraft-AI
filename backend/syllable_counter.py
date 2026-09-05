import re
from typing import List, Tuple

# Try to import pronouncing library for CMU Pronouncing Dictionary support
try:
    import pronouncing
    PRONOUNCING_AVAILABLE = True
except ImportError:
    pronouncing = None
    PRONOUNCING_AVAILABLE = False

# Common words with non-standard syllable counts in songwriting
CUSTOM_WORD_EXCEPTIONS = {
    "every": 2,
    "different": 2,
    "evening": 2,
    "camera": 2,
    "chocolate": 2,
    "family": 2,
    "favorite": 2,
    "memories": 3,
    "history": 2,
    "mystery": 2,
    "natural": 2,
    "several": 2,
    "rhythm": 2,
    "fire": 1,
    "wire": 1,
    "desire": 2,
    "higher": 2,
    "hour": 1,
    "our": 1,
    "yeah": 1,
    "whoa": 1,
    "ooh": 1,
    "ahh": 1,
    "na": 1,
    "la": 1
}

def clean_word(word: str) -> str:
    """Strip punctuation and whitespace while preserving internal apostrophes."""
    return re.sub(r"[^\w']", "", word.strip()).lower().strip("'")

def estimate_word_syllables_fallback(word: str) -> int:
    """
    Robust heuristic syllable counter for English words when CMU pronunciation
    is unavailable. Handles silent 'e', diphthongs, common suffixes, and contractions.
    """
    word = clean_word(word)
    if not word:
        return 0

    if word in CUSTOM_WORD_EXCEPTIONS:
        return CUSTOM_WORD_EXCEPTIONS[word]

    # Handle short common words directly
    if len(word) <= 3:
        return 1

    # Remove non-syllabic trailing 'e' (e.g. 'fade', 'stone', 'dance')
    # but keep for words like 'the', 'me', 'be', 'tree', or consonant + 'le' ('candle', 'table')
    processed = word
    if processed.endswith('e') and not processed.endswith('ee'):
        if processed.endswith('le') and len(processed) > 2 and processed[-3] not in 'aeiouy':
            pass  # 'table', 'circle', 'apple' keep the syllable
        else:
            processed = processed[:-1]

    # Handle past tense '-ed' (e.g., 'walked' is 1 syllable, but 'faded' is 2)
    if processed.endswith('ed'):
        if not (len(processed) > 3 and processed[-3] in 'td'):
            processed = processed[:-2]

    # Count vowel groups
    vowel_runs = re.findall(r'[aeiouy]+', processed)
    count = len(vowel_runs)

    # Adjust for vowel combinations that often create two syllables (hiatus)
    hiatus_patterns = [r'[aeiou]ing$', r'ia', r'io', r'eo', r'ua', r'ui(?=[a-z])']
    for pattern in hiatus_patterns:
        if re.search(pattern, word):
            count += 1

    return max(1, count)

def count_word_syllables(word: str) -> int:
    """
    Counts syllables for a single word.
    Uses CMU Pronouncing Dictionary if available; otherwise uses phonetic fallback.
    """
    cleaned = clean_word(word)
    if not cleaned:
        return 0

    if cleaned in CUSTOM_WORD_EXCEPTIONS:
        return CUSTOM_WORD_EXCEPTIONS[cleaned]

    # Attempt CMU dictionary lookup via pronouncing
    if PRONOUNCING_AVAILABLE and pronouncing is not None:
        try:
            phones = pronouncing.phones_for_word(cleaned)
            if phones:
                # CMU dictionary phonetic syllable count
                return pronouncing.syllable_count(phones[0])
        except Exception:
            pass

    # Fallback heuristic
    return estimate_word_syllables_fallback(cleaned)

def count_line_syllables(line: str) -> int:
    """
    Calculates estimated syllable count for a line of song lyrics.
    Splits into individual words and sums their counts.
    """
    if not line or not line.strip():
        return 0

    # Tokenize line into words
    words = re.findall(r"[a-zA-Z0-9']+", line)
    if not words:
        return 0

    return sum(count_word_syllables(w) for w in words)

def analyze_line_syllables(line: str) -> dict:
    """
    Returns detailed syllable breakdown for a lyric line.
    """
    words = re.findall(r"[a-zA-Z0-9']+", line)
    breakdown = [{"word": w, "syllables": count_word_syllables(w)} for w in words]
    total = sum(item["syllables"] for item in breakdown)
    return {
        "line": line,
        "syllables": total,
        "words": breakdown
    }
