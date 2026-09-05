import React, { useState } from 'react';
import { Edit2, Check, Sparkles, Volume2 } from 'lucide-react';
import RegenerateButton from './RegenerateButton';

// Color map for rhyme badges
const RHYME_COLORS = [
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'bg-pink-500/20 text-pink-300 border-pink-500/40',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
];

export default function LyricSection({
  section,
  analysis,
  onUpdateSection,
  onRegenerateSection,
  isRegenerating,
  onWordClick
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(section.lines.join('\n'));

  const handleSaveEdit = () => {
    const updatedLines = editText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    onUpdateSection({
      ...section,
      lines: updatedLines.length > 0 ? updatedLines : ['(Empty Section)']
    });
    setIsEditing(false);
  };

  // Tag styling based on section type
  const getSectionBadgeStyle = (type) => {
    const t = type.toLowerCase();
    if (t.includes('chorus')) return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    if (t.includes('verse')) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    if (t.includes('bridge')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (t.includes('intro') || t.includes('outro')) return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    return 'bg-white/10 text-white border-white/20';
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-all shadow-lg print-break-inside-avoid">
      
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border shadow-sm ${getSectionBadgeStyle(section.type)}`}>
            {section.type}
          </span>
          {analysis?.rhyme_scheme && (
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              Rhyme: <strong className="text-slate-200">{analysis.rhyme_scheme}</strong>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 no-print">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditText(section.lines.join('\n'));
                setIsEditing(true);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit</span>
            </button>
          )}

          <RegenerateButton
            sectionType={section.type}
            onRegenerate={() => onRegenerateSection(section.type)}
            isRegenerating={isRegenerating}
          />
        </div>
      </div>

      {/* Section Content */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={section.lines.length + 1}
            className="w-full p-3.5 rounded-xl bg-studio-900/90 border border-indigo-500/40 text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
            placeholder="Enter section lines (one per row)..."
          />
          <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
            <span>Edit lines directly. Syllables and rhymes will recalculate automatically on save.</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-white underline"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {section.lines.map((line, idx) => {
            const lineAnalysis = analysis?.lines?.[idx];
            const syllables = lineAnalysis?.syllables ?? 0;
            const rhymeLabel = lineAnalysis?.rhyme_label;
            const rhymeGroup = lineAnalysis?.rhyme_group ?? 0;
            const badgeColorClass = RHYME_COLORS[rhymeGroup % RHYME_COLORS.length];

            // Separate end word to make it interactive for Rhyme Assistant
            const words = line.trim().split(/\s+/);
            const endWord = words.length > 0 ? words[words.length - 1] : '';
            const precedingText = words.slice(0, words.length - 1).join(' ');

            return (
              <div 
                key={idx}
                className="group flex items-center justify-between gap-4 py-1 px-2 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                {/* Lyric Line Text with Clickable End Word */}
                <div className="text-sm sm:text-base font-medium text-slate-100 flex-1 leading-relaxed">
                  <span>{precedingText ? `${precedingText} ` : ''}</span>
                  <span
                    onClick={() => onWordClick(endWord.replace(/[^\w']/g, ''))}
                    className="end-word-clickable font-semibold text-white group-hover:text-indigo-200"
                    title={`Click "${endWord}" for rhyme suggestions`}
                  >
                    {endWord}
                  </span>
                </div>

                {/* Lyric Metrics Tags (Syllables & Rhyme) */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Syllable Count */}
                  <span 
                    className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold"
                    title={`${syllables} estimated syllables`}
                  >
                    {syllables}
                  </span>

                  {/* Rhyme Group Tag */}
                  {rhymeLabel && (
                    <span 
                      className={`text-xs font-mono font-bold w-6 h-6 rounded-md border flex items-center justify-center ${badgeColorClass}`}
                      title={`Rhyme group: ${rhymeLabel}`}
                    >
                      {rhymeLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
