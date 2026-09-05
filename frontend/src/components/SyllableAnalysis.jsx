import React from 'react';
import { Activity, BarChart2, Info, Compass } from 'lucide-react';

export default function SyllableAnalysis({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Syllable & Meter Flow</h3>
            <p className="text-xs text-slate-400">Pacing, cadence balance, and singability analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            Avg {analysis.avg_syllables_per_line || 0} syl / line
          </span>
        </div>
      </div>

      {/* Syllable Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-studio-900/60 border border-white/5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Total Syllables</div>
          <div className="text-xl font-black text-white mt-1 font-mono">{analysis.total_syllables || 0}</div>
        </div>

        <div className="p-3 rounded-xl bg-studio-900/60 border border-white/5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Avg / Line</div>
          <div className="text-xl font-black text-indigo-300 mt-1 font-mono">{analysis.avg_syllables_per_line || 0}</div>
        </div>

        <div className="p-3 rounded-xl bg-studio-900/60 border border-white/5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Sections</div>
          <div className="text-xl font-black text-purple-300 mt-1 font-mono">{analysis.sections?.length || 0}</div>
        </div>

        <div className="p-3 rounded-xl bg-studio-900/60 border border-white/5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Meter Consistency</div>
          <div className="text-xl font-black text-emerald-400 mt-1 font-mono">Balanced</div>
        </div>
      </div>

      {/* Section Syllable Meters */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400">Average Syllables Per Section:</div>
        <div className="space-y-1.5">
          {analysis.sections?.map((sec, idx) => {
            const avg = sec.avg_syllables || 0;
            // Scale bar up to 14 syllables
            const pct = Math.min(100, Math.round((avg / 14) * 100));
            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="w-24 text-slate-300 font-medium truncate">{sec.type}</span>
                <div className="flex-1 h-2 rounded-full bg-studio-900 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-slate-400">{avg} syl</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparency Note per Requirement 10 */}
      <div className="p-3 rounded-xl bg-studio-950/60 border border-white/5 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>{analysis.explanation}</span>
      </div>

    </div>
  );
}
