const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Custom wrapper for standard fetch API requests with detailed error handling.
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Unable to reach LyriCraft server. Please verify the service is running at ' + API_BASE_URL
      );
    }
    throw error;
  }
}

/**
 * Health check endpoint.
 */
export async function checkHealth() {
  return await apiRequest('/api/health', { method: 'GET' });
}

/**
 * Generates full structured song lyrics with analytics and mood board.
 */
export async function generateSong({ mood, genre, theme, structure }) {
  return await apiRequest('/api/generate-song', {
    method: 'POST',
    body: JSON.stringify({ mood, genre, theme, structure }),
  });
}

/**
 * Regenerates an individual song section while preserving surrounding song context.
 */
export async function regenerateSection({ song_context, section_type, mood, genre, theme, structure }) {
  return await apiRequest('/api/regenerate-section', {
    method: 'POST',
    body: JSON.stringify({
      song_context,
      section_type,
      mood,
      genre,
      theme,
      structure,
    }),
  });
}

/**
 * Re-analyzes arbitrary or edited lyrics for rhyme schemes and syllable counts.
 */
export async function analyzeLyrics({ sections }) {
  return await apiRequest('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ sections }),
  });
}

/**
 * Fetches singable rhyme suggestions for a specific word.
 */
export async function fetchRhymeSuggestions(word, maxResults = 16) {
  return await apiRequest('/api/rhyme-suggestions', {
    method: 'POST',
    body: JSON.stringify({ word, max_results: maxResults }),
  });
}
