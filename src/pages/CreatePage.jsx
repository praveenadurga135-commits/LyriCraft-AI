import React from 'react';
import SongInputForm from '../components/SongInputForm';
import SongDisplay from '../components/SongDisplay';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import { Sparkles, Music } from 'lucide-react';

export default function CreatePage({
  onGenerateSong,
  isLoading,
  loadingMessage,
  errorMessage,
  onDismissError,
  songResponse,
  currentMood,
  currentGenre,
  currentTheme,
  versionNumber = 1,
  onUpdateSection,
  onRegenerateSection,
  regeneratingSectionType,
  onWordClick
}) {
  return (
    <div className="space-y-12 py-4">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Song Creation Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Compose Your Original Song
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Set your emotional mood, musical genre, narrative theme, and song structure.
        </p>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onDismiss={onDismissError}
          onRetry={() => {
            const el = document.getElementById('create-form-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Generation Form */}
      <div id="create-form-anchor" className="scroll-mt-24">
        <SongInputForm
          onGenerate={onGenerateSong}
          isLoading={isLoading}
          initialValues={{ mood: currentMood, genre: currentGenre, theme: currentTheme }}
        />
      </div>

      {/* Loading animation */}
      {isLoading && (
        <LoadingState customMessage={loadingMessage} />
      )}

      {/* Results Display */}
      {songResponse && !isLoading && (
        <div id="generated-song-container" className="scroll-mt-24 pt-4 border-t border-white/10">
          <SongDisplay
            song={songResponse.song}
            analysis={songResponse.analysis}
            moodBoard={songResponse.mood_board}
            mood={currentMood}
            genre={currentGenre}
            theme={currentTheme}
            versionNumber={versionNumber}
            onUpdateSection={onUpdateSection}
            onRegenerateSection={onRegenerateSection}
            regeneratingSectionType={regeneratingSectionType}
            onWordClick={onWordClick}
          />
        </div>
      )}

    </div>
  );
}
