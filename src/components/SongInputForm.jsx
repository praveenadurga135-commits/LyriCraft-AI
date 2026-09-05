import React, { useState } from 'react';
import { Sparkles, Wand2, Compass, Music2, Heart, Edit3 } from 'lucide-react';
import SongStructureSelector, { PRESET_STRUCTURES } from './SongStructureSelector';

const MOODS = [
  'Hopeful', 'Happy', 'Sad', 'Melancholic', 'Romantic', 'Energetic',
  'Nostalgic', 'Peaceful', 'Dark', 'Dreamy', 'Angry', 'Mysterious', 'Custom Mood'
];

const GENRES = [
  'Pop', 'Indie Pop', 'Indie Folk', 'Rock', 'Hip-Hop', 'R&B',
  'Country', 'Lo-fi', 'EDM', 'Alternative', 'Acoustic', 'Soul', 'Custom Genre'
];

export default function SongInputForm({ 
  onGenerate, 
  isLoading,
  initialValues = {}
}) {
  const [mood, setMood] = useState(initialValues.mood || 'Hopeful');
  const [customMood, setCustomMood] = useState('');
  const [genre, setGenre] = useState(initialValues.genre || 'Indie Folk');
  const [customGenre, setCustomGenre] = useState('');
  const [theme, setTheme] = useState(initialValues.theme || '');
  const [selectedPreset, setSelectedPreset] = useState('full-ballad');
  const [structure, setStructure] = useState(
    PRESET_STRUCTURES[1].sections
  );

  // Quick Demo Populator
  const handleTryExample = () => {
    setMood('Hopeful');
    setCustomMood('');
    setGenre('Indie Folk');
    setCustomGenre('');
    setTheme('Moving to a new city alone, packing old polaroids into cardboard boxes, and finding courage under unfamiliar streetlights');
    setSelectedPreset('full-ballad');
    setStructure(PRESET_STRUCTURES[1].sections);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const resolvedMood = mood === 'Custom Mood' ? customMood.trim() : mood;
    const resolvedGenre = genre === 'Custom Genre' ? customGenre.trim() : genre;

    if (!resolvedMood) {
      alert('Please select or specify a mood.');
      return;
    }
    if (!resolvedGenre) {
      alert('Please select or specify a genre.');
      return;
    }
    if (!theme.trim()) {
      alert('Please enter a theme or story concept for your song.');
      return;
    }
    if (!structure || structure.length === 0) {
      alert('Please specify at least one section in the song structure.');
      return;
    }

    onGenerate({
      mood: resolvedMood,
      genre: resolvedGenre,
      theme: theme.trim(),
      structure
    });
  };

  const isFormValid = 
    (mood !== 'Custom Mood' || customMood.trim().length > 0) &&
    (genre !== 'Custom Genre' || customGenre.trim().length > 0) &&
    theme.trim().length > 0 &&
    structure.length > 0;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Panel Header & Try Example Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Wand2 className="w-6 h-6 text-indigo-400" />
            <span>Songwriting Studio</span>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Define your sonic blueprint and let AI compose structured lyrics with rhyme analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTryExample}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all flex items-center gap-2 hover:shadow-glow-indigo active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>✨ Try Example Demo</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        
        {/* Mood & Genre Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Mood Selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Mood & Emotion</span>
            </label>
            <div className="relative">
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-sm appearance-none cursor-pointer"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m} className="bg-studio-900 text-white">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                ▼
              </div>
            </div>

            {mood === 'Custom Mood' && (
              <input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder="Enter custom mood (e.g. Bittersweet, Euphoric)..."
                className="w-full px-4 py-2.5 mt-2 rounded-xl bg-studio-900/90 border border-indigo-500/40 text-white placeholder-slate-500 text-sm focus:border-indigo-400 focus:outline-none"
                autoFocus
              />
            )}
          </div>

          {/* Genre Selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Music2 className="w-4 h-4 text-indigo-400" />
              <span>Musical Genre</span>
            </label>
            <div className="relative">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-sm appearance-none cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-studio-900 text-white">
                    {g}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                ▼
              </div>
            </div>

            {genre === 'Custom Genre' && (
              <input
                type="text"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="Enter custom genre (e.g. Synthwave, Hyperpop)..."
                className="w-full px-4 py-2.5 mt-2 rounded-xl bg-studio-900/90 border border-indigo-500/40 text-white placeholder-slate-500 text-sm focus:border-indigo-400 focus:outline-none"
                autoFocus
              />
            )}
          </div>

        </div>

        {/* Theme Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-purple-400" />
              <span>Song Theme or Narrative</span>
            </label>
            <span className="text-xs text-slate-400">
              {theme.length} characters
            </span>
          </div>
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            rows={3}
            placeholder="e.g. moving to a new city, first love, overcoming failure, chasing midnight dreams..."
            className="w-full px-4 py-3 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-sm resize-none"
          />
        </div>

        {/* Song Structure Selector */}
        <SongStructureSelector
          structure={structure}
          setStructure={setStructure}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
        />

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              !isFormValid || isLoading
                ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.99] border border-white/20'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isLoading ? 'Composing Your Masterpiece...' : '✨ Generate My Song'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
