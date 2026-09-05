import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#06080d] py-6 mt-16 text-xs text-slate-400 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-extrabold text-sm text-slate-200 tracking-tight">LyriCraft</span>
          <span className="mx-2 text-slate-600">•</span>
          <span className="text-slate-400">Copyright © 2026</span>
        </div>
        <p className="text-xs text-slate-400 max-w-md">
          AI-powered songwriting studio helping musicians generate lyrics, analyze rhyme patterns, and craft song structures.
        </p>
      </div>
    </footer>
  );
}

