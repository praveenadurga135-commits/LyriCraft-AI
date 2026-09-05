import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function RegenerateButton({ 
  sectionType, 
  onRegenerate, 
  isRegenerating 
}) {
  const shortType = sectionType.toLowerCase();

  return (
    <button
      type="button"
      onClick={onRegenerate}
      disabled={isRegenerating}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
        isRegenerating
          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-wait animate-pulse'
          : 'bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-white/10 hover:border-purple-500/40 active:scale-95'
      }`}
      title={`Rewrite this ${shortType}`}
    >
      <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-purple-400' : 'text-slate-400'}`} />
      <span>{isRegenerating ? `✨ Rewriting your ${shortType}...` : 'Regenerate'}</span>
    </button>
  );
}
