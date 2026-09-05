import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import HowItWorksPage from './pages/HowItWorksPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RhymeAssistantModal from './components/RhymeAssistantModal';
import { useToast } from './context/ToastContext';

import { 
  generateSong, 
  regenerateSection, 
  analyzeLyrics 
} from './services/api';

const DEFAULT_PROFILE = {
  name: 'Independent Artist',
  email: 'artist@lyricraft.app',
  favoriteGenre: 'Indie Folk',
  favoriteMood: 'Hopeful',
  profilePicture: ''
};

export default function App() {
  const navigate = useNavigate();
  const toast = useToast();

  // Authentication State (Persists across page refresh via Local Storage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const auth = localStorage.getItem('lyricraft_auth');
      if (!auth) return false;
      const parsed = JSON.parse(auth);
      return Boolean(parsed && parsed.loggedIn);
    } catch {
      return false;
    }
  });

  // Profile State (Local Storage)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('lyricraft_profile') || localStorage.getItem('lyricraft_user');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Version History State (Local Storage - only loaded for authenticated users per Requirement 4)
  const [history, setHistory] = useState(() => {
    try {
      const auth = localStorage.getItem('lyricraft_auth');
      if (!auth) return [];
      const parsed = JSON.parse(auth);
      if (!parsed || !parsed.loggedIn) return [];
      const saved = localStorage.getItem('lyricraft_version_history') || localStorage.getItem('lyricraft_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currently Active Song & Track ID for Versioning
  const [currentSongId, setCurrentSongId] = useState(null);
  const [currentMood, setCurrentMood] = useState('Hopeful');
  const [currentGenre, setCurrentGenre] = useState('Indie Folk');
  const [currentTheme, setCurrentTheme] = useState('');

  const [songResponse, setSongResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Section Regeneration State
  const [regeneratingSectionType, setRegeneratingSectionType] = useState(null);

  // Rhyme Assistant Modal State
  const [rhymeModalWord, setRhymeModalWord] = useState('');
  const [isRhymeModalOpen, setIsRhymeModalOpen] = useState(false);

  // Confetti helper
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
    } catch {
      // Ignore if unsupported
    }
  };

  // Helper to get next version number for a song thread
  const getNextVersionNumber = (songId) => {
    if (!songId) return 1;
    const existingVersions = history.filter((item) => item.songId === songId);
    if (!existingVersions.length) return 1;
    const maxVer = Math.max(...existingVersions.map((v) => v.versionNumber || 1));
    return maxVer + 1;
  };

  // Helper to get current active version number
  const currentVersionNumber = (() => {
    if (!currentSongId) return 1;
    const activeVersions = history.filter((item) => item.songId === currentSongId);
    if (!activeVersions.length) return 1;
    return Math.max(...activeVersions.map((v) => v.versionNumber || 1));
  })();

  // Save a new version automatically (Only for logged-in users per Requirement 4 & 12)
  const recordNewVersion = (songId, verNum, songResp, mood, genre, theme, actionLabel) => {
    if (!isAuthenticated) return null; // Guests cannot save (Requirement 12)

    const newVersion = {
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      songId: songId,
      versionNumber: verNum,
      timestamp: new Date().toISOString(),
      title: songResp.song?.title || 'Untitled Song',
      mood: mood,
      genre: genre,
      theme: theme,
      concept: songResp.song?.concept || theme,
      lyrics: songResp.song?.sections || [],
      analysis: songResp.analysis,
      moodBoard: songResp.mood_board,
      songResponse: songResp,
      action: actionLabel
    };

    const updatedHistory = [newVersion, ...history];
    setHistory(updatedHistory);
    try {
      localStorage.setItem('lyricraft_version_history', JSON.stringify(updatedHistory));
      localStorage.setItem('lyricraft_history', JSON.stringify(updatedHistory));
    } catch (storageErr) {
      console.warn('Could not write version to Local Storage:', storageErr);
    }
    return newVersion;
  };

  // 1. Generate Song Handler -> Creates Version 1
  const handleGenerateSong = async ({ mood, genre, theme, structure }) => {
    setIsLoading(true);
    setLoadingMessage('Composing your original lyrics...');
    setErrorMessage('');
    setCurrentMood(mood);
    setCurrentGenre(genre);
    setCurrentTheme(theme);

    const newSongId = 'song_' + Date.now();
    setCurrentSongId(newSongId);

    try {
      const response = await generateSong({ mood, genre, theme, structure });
      setSongResponse(response);
      triggerCelebration();

      // Automatically save as Version 1
      recordNewVersion(newSongId, 1, response, mood, genre, theme, 'Initial Generation');
      toast.success(`"${response.song?.title || 'Song'}" generated as Version 1!`);

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById('generated-song-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred while generating the song.');
      toast.error('Failed to generate song. Please verify server connection.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 2. Regenerate Section Handler -> Creates a new Version
  const handleRegenerateSection = async (sectionType) => {
    if (!songResponse || !songResponse.song) return;

    setRegeneratingSectionType(sectionType);
    setErrorMessage('');

    try {
      const contextLines = songResponse.song.sections
        .map((s) => `[${s.type}]\n${s.lines.join('\n')}`)
        .join('\n\n');

      const regenData = await regenerateSection({
        song_context: contextLines,
        section_type: sectionType,
        mood: currentMood,
        genre: currentGenre,
        theme: currentTheme,
      });

      const updatedSections = songResponse.song.sections.map((sec) => {
        if (sec.type === sectionType) {
          return regenData.section;
        }
        return sec;
      });

      // Re-run full analysis across the whole song
      const updatedAnalysis = await analyzeLyrics({ sections: updatedSections });

      const updatedResponse = {
        ...songResponse,
        song: {
          ...songResponse.song,
          sections: updatedSections,
        },
        analysis: updatedAnalysis,
      };

      setSongResponse(updatedResponse);

      // Automatically save as a new Version
      const activeSongId = currentSongId || ('song_' + Date.now());
      if (!currentSongId) setCurrentSongId(activeSongId);
      const nextVer = getNextVersionNumber(activeSongId);
      recordNewVersion(
        activeSongId,
        nextVer,
        updatedResponse,
        currentMood,
        currentGenre,
        currentTheme,
        `Regenerated [${sectionType}]`
      );

      toast.success(`Rewrote ${sectionType} section as Version ${nextVer}!`);
    } catch (err) {
      setErrorMessage(`Failed to rewrite ${sectionType}: ${err.message}`);
      toast.error(`Error rewriting ${sectionType}`);
    } finally {
      setRegeneratingSectionType(null);
    }
  };

  // 3. Inline Section Edit Handler -> Creates a new Version
  const handleUpdateSection = async (index, updatedSection) => {
    if (!songResponse || !songResponse.song) return;

    const updatedSections = [...songResponse.song.sections];
    updatedSections[index] = updatedSection;

    try {
      const updatedAnalysis = await analyzeLyrics({ sections: updatedSections });
      const updatedResponse = {
        ...songResponse,
        song: {
          ...songResponse.song,
          sections: updatedSections,
        },
        analysis: updatedAnalysis,
      };

      setSongResponse(updatedResponse);

      // Automatically save as a new Version
      const activeSongId = currentSongId || ('song_' + Date.now());
      if (!currentSongId) setCurrentSongId(activeSongId);
      const nextVer = getNextVersionNumber(activeSongId);
      recordNewVersion(
        activeSongId,
        nextVer,
        updatedResponse,
        currentMood,
        currentGenre,
        currentTheme,
        `Edited [${updatedSection.type}]`
      );

      toast.info(`Section edited. Saved as Version ${nextVer}.`);
    } catch (err) {
      console.error('Failed to re-analyze edited lyrics:', err);
    }
  };

  // Version History Actions
  const handleOpenVersion = (version) => {
    if (version.songResponse) {
      setSongResponse(version.songResponse);
      setCurrentSongId(version.songId || ('song_' + Date.now()));
      setCurrentMood(version.mood || 'Hopeful');
      setCurrentGenre(version.genre || 'Indie Folk');
      setCurrentTheme(version.theme || version.concept || '');
    }
    setTimeout(() => {
      const el = document.getElementById('generated-song-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const handleRestoreVersion = (version) => {
    handleOpenVersion(version);
  };

  const handleDuplicateVersion = (version) => {
    const nextVer = getNextVersionNumber(version.songId);
    const duplicated = {
      ...version,
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: `${version.title} (Copy)`,
      versionNumber: nextVer,
      timestamp: new Date().toISOString(),
      action: 'Duplicated Version'
    };

    const updated = [duplicated, ...history];
    setHistory(updated);
    localStorage.setItem('lyricraft_version_history', JSON.stringify(updated));
    localStorage.setItem('lyricraft_history', JSON.stringify(updated));
  };

  const handleRenameVersion = (versionId, newTitle) => {
    const updated = history.map((item) => {
      if (item.id === versionId) {
        return {
          ...item,
          title: newTitle,
          songResponse: item.songResponse ? {
            ...item.songResponse,
            song: {
              ...item.songResponse.song,
              title: newTitle
            }
          } : item.songResponse
        };
      }
      return item;
    });

    setHistory(updated);
    localStorage.setItem('lyricraft_version_history', JSON.stringify(updated));
    localStorage.setItem('lyricraft_history', JSON.stringify(updated));

    // Update active song title if current
    if (songResponse && songResponse.song) {
      setSongResponse((prev) => ({
        ...prev,
        song: { ...prev.song, title: newTitle }
      }));
    }
  };

  const handleDeleteVersion = (versionId) => {
    const updated = history.filter((item) => item.id !== versionId);
    setHistory(updated);
    localStorage.setItem('lyricraft_version_history', JSON.stringify(updated));
    localStorage.setItem('lyricraft_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('lyricraft_version_history');
    localStorage.removeItem('lyricraft_history');
  };

  // Profile and Auth Handlers
  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('lyricraft_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('lyricraft_user', JSON.stringify(updatedProfile));
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    const username = user?.username || user?.name || 'Artist';
    localStorage.setItem('lyricraft_auth', JSON.stringify({ 
      username, 
      loggedIn: true, 
      status: 'loggedIn' 
    }));
    setProfile((prev) => ({ ...prev, ...user, username }));
    try {
      const saved = localStorage.getItem('lyricraft_version_history') || localStorage.getItem('lyricraft_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load history on login:', e);
    }
  };

  const handleRegisterSuccess = (user) => {
    setIsAuthenticated(true);
    const username = user?.username || user?.name || 'Artist';
    localStorage.setItem('lyricraft_auth', JSON.stringify({ 
      username, 
      loggedIn: true, 
      status: 'loggedIn' 
    }));
    setProfile((prev) => ({ ...prev, ...user, username }));
  };

  const handleLogout = () => {
    localStorage.removeItem('lyricraft_auth');
    localStorage.removeItem('lyricraft_user');
    sessionStorage.clear();
    setIsAuthenticated(false);
    setHistory([]);
    setSongResponse(null);
    setCurrentSongId(null);
    toast.success('Logged out successfully.');
    navigate('/');
  };

  // Word click for Rhyme suggestions modal
  const handleWordClick = (word) => {
    if (!word) return;
    setRhymeModalWord(word);
    setIsRhymeModalOpen(true);
  };

  // Route Guard strictly protecting Create, History, and Profile routes (Requirements 3, 4, 8, 9)
  function ProtectedRoute({ isAuthenticated, children }) {
    const hasNotified = React.useRef(false);

    useEffect(() => {
      if (!isAuthenticated && !hasNotified.current) {
        hasNotified.current = true;
        toast.info('Please login to continue.');
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Sticky Navigation Bar */}
      <Header 
        historyCount={history.length} 
        isAuthenticated={isAuthenticated} 
      />

      {/* Main Routes */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route 
            path="/create" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreatePage
                  onGenerateSong={handleGenerateSong}
                  isLoading={isLoading}
                  loadingMessage={loadingMessage}
                  errorMessage={errorMessage}
                  onDismissError={() => setErrorMessage('')}
                  songResponse={songResponse}
                  currentMood={currentMood}
                  currentGenre={currentGenre}
                  currentTheme={currentTheme}
                  versionNumber={currentVersionNumber}
                  onUpdateSection={handleUpdateSection}
                  onRegenerateSection={handleRegenerateSection}
                  regeneratingSectionType={regeneratingSectionType}
                  onWordClick={handleWordClick}
                />
              </ProtectedRoute>
            } 
          />

          <Route path="/how-it-works" element={<HowItWorksPage />} />

          <Route 
            path="/history" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HistoryPage
                  history={history}
                  onOpenVersion={handleOpenVersion}
                  onRestoreVersion={handleRestoreVersion}
                  onDuplicateVersion={handleDuplicateVersion}
                  onRenameVersion={handleRenameVersion}
                  onDeleteVersion={handleDeleteVersion}
                  onClearHistory={handleClearHistory}
                />
              </ProtectedRoute>
            } 
          />

          <Route path="/about" element={<AboutPage />} />

          {/* Profile Route: Only accessible when authenticated or redirects to login */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage
                  profile={profile}
                  onSaveProfile={handleSaveProfile}
                  onLogout={handleLogout}
                  history={history}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/login" 
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
          />

          <Route 
            path="/register" 
            element={<RegisterPage onRegisterSuccess={handleRegisterSuccess} />} 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Rhyme Assistant Modal */}
      <RhymeAssistantModal
        word={rhymeModalWord}
        isOpen={isRhymeModalOpen}
        onClose={() => setIsRhymeModalOpen(false)}
        onSelectRhyme={(rhymeWord) => {
          navigator.clipboard.writeText(rhymeWord);
          toast.success(`Copied "${rhymeWord}" to clipboard!`);
        }}
      />

    </div>
  );
}
