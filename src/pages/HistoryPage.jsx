import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  Eye, 
  Copy, 
  RotateCcw, 
  Calendar, 
  Wand2, 
  Disc, 
  Edit2, 
  Layers, 
  X, 
  Check, 
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { generateSongPDF } from '../utils/pdfExport';

export default function HistoryPage({ 
  history = [], 
  onOpenVersion, 
  onRestoreVersion, 
  onDuplicateVersion, 
  onRenameVersion, 
  onDeleteVersion, 
  onClearHistory 
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  // Ensure versions are always sorted newest first
  const sortedVersions = [...history].sort((a, b) => {
    const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
    const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr || 'Recently generated';
    }
  };

  const handleOpen = (version) => {
    onOpenVersion(version);
    navigate('/create');
  };

  const handleRestore = (version) => {
    onRestoreVersion(version);
    toast.success(`Restored Version ${version.versionNumber || 1} of "${version.title}"!`);
    navigate('/create');
  };

  const handleDuplicate = (version) => {
    onDuplicateVersion(version);
    toast.success(`Duplicated "${version.title}"!`);
  };

  const handleDownloadPDF = (version) => {
    try {
      const songData = version.songResponse?.song || {
        title: version.title || 'Untitled Song',
        concept: version.concept || version.theme || '',
        sections: version.lyrics || []
      };

      generateSongPDF({
        song: songData,
        analysis: version.analysis || version.songResponse?.analysis,
        moodBoard: version.moodBoard || version.songResponse?.mood_board,
        mood: version.mood,
        genre: version.genre,
        theme: version.theme || version.concept,
        versionNumber: version.versionNumber || 1,
        exportDate: new Date().toISOString(),
        dateGenerated: version.timestamp
      });
      toast.success(`Downloaded "${version.title}" (Version ${version.versionNumber || 1}) PDF!`);
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to export PDF for this version.');
    }
  };

  const startRename = (version) => {
    setRenamingId(version.id);
    setNewTitle(version.title || '');
  };

  const saveRename = (versionId) => {
    if (!newTitle.trim()) {
      toast.error('Title cannot be empty.');
      return;
    }
    onRenameVersion(versionId, newTitle.trim());
    setRenamingId(null);
    toast.success('Version renamed successfully.');
  };

  const handleDelete = (versionId, title) => {
    onDeleteVersion(versionId);
    toast.info(`Deleted version "${title}".`);
  };

  const handleClearAll = () => {
    onClearHistory();
    setShowClearConfirm(false);
    toast.info('Cleared all version history.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Version History</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Song Version History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, preview, restore, duplicate, and manage all saved song versions.
          </p>
        </div>

        {/* Delete All History Action */}
        {sortedVersions.length > 0 && (
          <div className="flex items-center gap-3">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-xs text-rose-300 font-medium px-2">Delete all version history?</span>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {sortedVersions.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-5 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <History className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Song Versions Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every time you generate a song, regenerate a section, or edit lyrics, a new version is automatically preserved here.
            </p>
          </div>
          <Link
            to="/create"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate a Song</span>
          </Link>
        </div>
      ) : (
        /* Version Cards Grid (Sorted Newest First) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVersions.map((version) => {
            const isRenaming = renamingId === version.id;
            const sections = version.lyrics || version.songResponse?.song?.sections || [];

            return (
              <div
                key={version.id}
                className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-indigo-500/10 group"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Bar: Version Number & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                      Version {version.versionNumber || 1}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {version.genre}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        {version.mood}
                      </span>
                    </div>
                  </div>

                  {/* Title (or Rename input) */}
                  {isRenaming ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-studio-900 border border-indigo-500/50 text-white text-sm focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(version.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                        title="Save Title"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRenamingId(null)}
                        className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:bg-white/15"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition-colors line-clamp-1">
                        🎵 {version.title || 'Untitled Song'}
                      </h3>
                      <button
                        onClick={() => startRename(version)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                        title="Rename Version"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Theme & Concept */}
                  <div className="p-3 rounded-xl bg-studio-900/90 border border-white/5 space-y-1.5">
                    {version.theme && (
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Theme</span>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {version.theme}
                        </p>
                      </div>
                    )}
                    {version.concept && version.concept !== version.theme && (
                      <div className="pt-1 border-t border-white/5">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Concept</span>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {version.concept}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Metadata: Structure count & Timestamp */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {sections.length} sections
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(version.timestamp || version.createdAt)}
                    </span>
                  </div>

                </div>

                {/* Actions Bar */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  
                  {/* Primary Row: Open Version & Download PDF */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpen(version)}
                      className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                      title="Open Version in Studio"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Open Version</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(version)}
                      className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600/40 to-pink-600/40 hover:from-purple-600/60 hover:to-pink-600/60 border border-purple-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                      title="Download PDF Lead Sheet"
                    >
                      <Download className="w-3.5 h-3.5 text-pink-300" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  {/* Secondary Row: Restore, Preview Lyrics, Duplicate, Delete */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleRestore(version)}
                      className="px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1"
                      title="Restore as active song in studio"
                    >
                      <RotateCcw className="w-3 h-3 text-purple-400" />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewVersion(version)}
                      className="flex-1 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(version)}
                      className="px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1"
                      title="Duplicate Version"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(version.id, version.title)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 transition-all"
                      title="Delete Version"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* LYRICS PREVIEW MODAL */}
      {previewVersion && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white">
                    Version {previewVersion.versionNumber || 1}
                  </span>
                  <span className="text-xs text-slate-400">
                    {previewVersion.genre} • {previewVersion.mood}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  🎵 {previewVersion.title}
                </h3>
              </div>

              <button
                onClick={() => setPreviewVersion(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Song Lyrics */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {previewVersion.concept && (
                <div className="p-3.5 rounded-2xl bg-studio-900/90 border border-white/5 text-xs text-slate-300">
                  <strong className="text-indigo-400">Concept: </strong>
                  {previewVersion.concept}
                </div>
              )}

              {(previewVersion.lyrics || previewVersion.songResponse?.song?.sections || []).map((sec, sIdx) => (
                <div key={sIdx} className="space-y-2 p-4 rounded-2xl bg-studio-900/50 border border-white/5">
                  <span className="text-xs font-black text-indigo-400 tracking-wider uppercase">
                    [{sec.type}]
                  </span>
                  <div className="space-y-1 font-serif text-slate-200">
                    {sec.lines.map((line, lIdx) => (
                      <p key={lIdx} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer: Action to Open, Restore, or Download PDF */}
            <div className="p-4 border-t border-white/10 bg-[#0c0f17]/90 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPreviewVersion(null);
                    handleRestore(previewVersion);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>

                <button
                  onClick={() => handleDownloadPDF(previewVersion)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-pink-300" />
                  <span>Download PDF</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setPreviewVersion(null);
                  handleOpen(previewVersion);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open in Studio</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
