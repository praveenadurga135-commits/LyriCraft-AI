import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, Volume2, Search, ArrowRight } from 'lucide-react';
import { fetchRhymeSuggestions } from '../services/api';

export default function RhymeAssistantModal({ 
  word, 
  isOpen, 
  onClose,
  onSelectRhyme 
}) {
  const [rhymes, setRhymes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [copiedWord, setCopiedWord] = useState(null);
  const [pronunciationFound, setPronunciationFound] = useState(true);

  useEffect(() => {
    if (isOpen && word) {
      setSearchWord(word);
      loadRhymes(word);
    }
  }, [isOpen, word]);

  const loadRhymes = async (targetWord) => {
    if (!targetWord.trim()) return;
    setIsLoading(true);
    try {
      const data = await fetchRhymeSuggestions(targetWord.trim());
      setRhymes(data.rhymes || []);
      setPronunciationFound(data.pronunciation_found);
    } catch (err) {
      console.error('Failed to load rhymes:', err);
      setRhymes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRhymes(searchWord);
  };

  const handleCopy = (rWord) => {
    navigator.clipboard.writeText(rWord);
    setCopiedWord(rWord);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-indigo-500/30 shadow-2xl relative overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Rhyme Assistant</h3>
              <p className="text-xs text-slate-400">Phonetic rhyming companion for songwriters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Search rhyming words..."
              className="w-full px-4 py-2.5 rounded-xl bg-studio-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Find
          </button>
        </form>

        {/* Selected Word Info */}
        <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-xl bg-studio-950/60 border border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Target Word:</span>
            <span className="font-bold text-indigo-300 uppercase tracking-wide">
              {searchWord || word}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {pronunciationFound ? 'CMU Phonetics Verified' : 'Suffix Heuristics'}
          </span>
        </div>

        {/* Suggestions Grid */}
        <div className="mt-4 min-h-[160px] max-h-[260px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-36 gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Finding musical rhymes...</span>
            </div>
          ) : rhymes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rhymes.map((rhymeWord) => (
                <div
                  key={rhymeWord}
                  className="p-2.5 rounded-xl bg-studio-900/80 hover:bg-indigo-950/50 border border-white/5 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-200">
                    {rhymeWord}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(rhymeWord)}
                      title="Copy to clipboard"
                      className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {copiedWord === rhymeWord ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {onSelectRhyme && (
                      <button
                        onClick={() => {
                          onSelectRhyme(rhymeWord);
                          onClose();
                        }}
                        title="Use in section"
                        className="p-1 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 text-center text-slate-400 text-xs">
              <p>No exact rhymes found for "{searchWord}".</p>
              <p className="text-slate-500 mt-1">Try entering a simpler root word or slant rhyme variant.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <span>Click any word to copy or use directly in your lyrics.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
