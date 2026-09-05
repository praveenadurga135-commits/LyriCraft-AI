import React from 'react';
import { Disc, Radio, Sliders, Waves, Sparkles, Music } from 'lucide-react';

export default function MoodBoard({ moodBoard, mood, genre }) {
  if (!moodBoard) return null;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      
      {/* Background radial studio lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-studio-900 rounded-[14px] flex items-center justify-center">
              <Disc className="w-6 h-6 text-pink-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-pink-400">Sonic Palette</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              <span className="text-xs text-slate-400">Studio Vibe</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              🎵 MUSIC MOOD BOARD
            </h3>
          </div>
        </div>

        {/* BPM Pill */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-studio-900/90 border border-white/10 shadow-inner">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Recommended Tempo</div>
            <div className="text-base font-black text-emerald-400 font-mono tracking-tight">{moodBoard.bpm}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 relative z-10">
        
        {/* Core Identity */}
        <div className="p-4 rounded-2xl bg-studio-900/50 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Tone & Aesthetics</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5 text-sm">
              <span className="text-slate-400">Mood:</span>
              <span className="font-bold text-pink-300">{mood}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-white/5 text-sm">
              <span className="text-slate-400">Genre:</span>
              <span className="font-bold text-indigo-300">{genre}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 text-sm">
              <span className="text-slate-400">Tempo Range:</span>
              <span className="font-mono font-bold text-slate-200">{moodBoard.bpm}</span>
            </div>
          </div>

          {moodBoard.description && (
            <p className="text-xs text-slate-400 italic pt-2 border-t border-white/5 leading-relaxed">
              "{moodBoard.description}"
            </p>
          )}
        </div>

        {/* Instrumentation */}
        <div className="p-4 rounded-2xl bg-studio-900/50 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Music className="w-4 h-4 text-purple-400" />
            <span>Instrumentation</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {moodBoard.instruments?.map((inst, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {inst}
              </span>
            ))}
          </div>
        </div>

        {/* Vibe Tags */}
        <div className="p-4 rounded-2xl bg-studio-900/50 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Vibe Descriptors</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {moodBoard.vibes?.map((vibe, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"
              >
                <span>•</span>
                <span>{vibe}</span>
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
