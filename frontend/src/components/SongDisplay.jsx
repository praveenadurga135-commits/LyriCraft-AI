import React, { useState } from 'react';
import { Copy, Download, Printer, Check, Music, Sparkles, BookOpen, FileText } from 'lucide-react';
import LyricSection from './LyricSection';
import RhymeAnalysis from './RhymeAnalysis';
import SyllableAnalysis from './SyllableAnalysis';
import MoodBoard from './MoodBoard';
import { useToast } from '../context/ToastContext';
import { generateSongPDF } from '../utils/pdfExport';

export default function SongDisplay({
  song,
  analysis,
  moodBoard,
  mood,
  genre,
  theme,
  versionNumber = 1,
  onUpdateSection,
  onRegenerateSection,
  regeneratingSectionType,
  onWordClick
}) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  // Formats all lyrics as clean plain text for clipboard copying
  const generateFormattedLyricsText = () => {
    let text = `${song.title.toUpperCase()}\n`;
    text += `Concept: ${song.concept}\n`;
    text += `Mood: ${mood} | Genre: ${genre}\n\n`;

    song.sections.forEach((sec) => {
      text += `[${sec.type.toUpperCase()}]\n`;
      sec.lines.forEach((line) => {
        text += `${line}\n`;
      });
      text += `\n`;
    });

    if (song.songwriting_notes) {
      text += `--- SONGWRITING NOTES ---\n${song.songwriting_notes}\n\n`;
    }

    if (moodBoard) {
      text += `--- MUSIC MOOD BOARD ---\n`;
      text += `Tempo: ${moodBoard.bpm}\n`;
      text += `Instrumentation: ${moodBoard.instruments.join(', ')}\n`;
      text += `Vibe: ${moodBoard.vibes.join(', ')}\n`;
    }

    return text;
  };

  const handleCopyLyrics = () => {
    const text = generateFormattedLyricsText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Lyrics copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = generateFormattedLyricsText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const sanitizedTitle = song.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedTitle || 'lyricraft_song'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded "${song.title}.txt"!`);
  };

  const handleDownloadPDF = () => {
    try {
      generateSongPDF({
        song,
        analysis,
        moodBoard,
        mood,
        genre,
        theme: theme || song.concept || '',
        versionNumber: versionNumber || 1,
        exportDate: new Date().toISOString()
      });
      toast.success(`Generated and downloaded "${song.title}" PDF (Version ${versionNumber || 1})!`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to generate PDF. Opening print dialog as fallback.');
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Song Header & Actions Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {genre} • {mood}
              </span>
              {song.overall_rhyme_style && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {song.overall_rhyme_style}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              🎵 {song.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              <span className="text-indigo-400 font-semibold">Concept: </span>
              {song.concept}
            </p>

            {song.songwriting_notes && (
              <div className="p-3.5 rounded-2xl bg-studio-900/60 border border-white/5 text-xs text-slate-400 flex items-start gap-2.5 leading-relaxed">
                <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300">Performance Notes: </strong>
                  {song.songwriting_notes}
                </div>
              </div>
            )}
          </div>

          {/* Export Action Controls */}
          <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0 no-print">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>📄 Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLyrics}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-400" />
                  <span>📋 Copy Lyrics</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>⬇️ Download TXT</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>🖨️ Print Sheet</span>
            </button>
          </div>

        </div>
      </div>

      {/* Music Mood Board Component */}
      <MoodBoard moodBoard={moodBoard} mood={mood} genre={genre} />

      {/* Song Lyrics Section Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-indigo-400" />
            <span>Song Sections & Lyrics</span>
          </h2>
          <span className="text-xs text-slate-400">
            Click end-words for rhyme suggestions • Edit sections inline
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {song.sections.map((sec, idx) => {
            const secAnalysis = analysis?.sections?.[idx];
            const isRegen = regeneratingSectionType === sec.type;

            return (
              <LyricSection
                key={`${sec.type}-${idx}`}
                section={sec}
                analysis={secAnalysis}
                onUpdateSection={(updatedSec) => onUpdateSection(idx, updatedSec)}
                onRegenerateSection={onRegenerateSection}
                isRegenerating={isRegen}
                onWordClick={onWordClick}
              />
            );
          })}
        </div>
      </div>

      {/* Analytics Panels: Rhyme & Syllables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <RhymeAnalysis analysis={analysis} />
        <SyllableAnalysis analysis={analysis} />
      </div>

    </div>
  );
}
