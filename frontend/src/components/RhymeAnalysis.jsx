import React from 'react';
import { AlignLeft, Hash, Sparkles, HelpCircle } from 'lucide-react';

export default function RhymeAnalysis({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Rhyme Scheme Analysis</h3>
            <p className="text-xs text-slate-400">Phonetic end-rhyme structure and cadence grouping</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30">
          {analysis.rhyme_scheme || 'Dynamic Flow'}
        </span>
      </div>

      {/* Section-by-Section Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {analysis.sections?.map((sec, idx) => (
          <div 
            key={idx}
            className="p-3.5 rounded-xl bg-studio-900/60 border border-white/5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">{sec.type}</span>
              <span className="text-xs font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">
                {sec.rhyme_scheme || 'Free Verse'}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              End-words: {sec.lines?.map(l => l.end_word).filter(Boolean).slice(0, 4).join(', ') || 'N/A'}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-studio-950/50 border border-white/5 flex items-start gap-2.5 text-xs text-slate-400">
        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-slate-300">Songwriter Tip:</span> Perfect end-rhymes (AABB) reinforce hooks and anthems, while cross-rhymes (ABAB) and slant rhymes keep verses narrative and conversational.
        </div>
      </div>
    </div>
  );
}
