import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onDismiss, onRetry }) {
  if (!message) return null;

  return (
    <div className="my-6 p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-xl shadow-rose-950/20 backdrop-blur-md flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-200">Song Generation Notice</h4>
          <p className="text-sm text-rose-300/90 mt-0.5">{message}</p>
          <div className="mt-2 text-xs text-rose-400/80">
            Tip: If the server is restarting or the network hiccuped, clicking retry usually resolves the issue.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
