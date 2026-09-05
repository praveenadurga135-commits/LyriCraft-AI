import React, { useState, useEffect } from 'react';
import { Music, Disc, Sparkles } from 'lucide-react';

const STAGES = [
  "Understanding your mood and genre vibe...",
  "Building the storytelling narrative...",
  "Crafting singable verses, chorus, and bridge...",
  "Calculating phonetic syllables and rhyme schemes...",
  "Arranging your custom music mood board..."
];

export default function LoadingState({ customMessage }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-indigo-500/30 shadow-2xl relative overflow-hidden my-8">
      {/* Background ambient pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        
        {/* Animated Soundwave / Vinyl Icon */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <Music className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
          {customMessage || "🎵 Composing your song..."}
        </h3>

        {/* Dynamic Stage Text */}
        <p className="text-sm text-indigo-300 font-medium h-6 transition-all duration-500 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
          <span>{STAGES[currentStageIndex]}</span>
        </p>

        {/* Audio Spectrum Visualizer Bars */}
        <div className="flex items-end justify-center gap-1.5 h-10 mt-8 mb-4">
          {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 75].map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-400 animate-pulse"
              style={{
                height: `${height}%`,
                animationDelay: `${i * 120}ms`,
                animationDuration: '900ms'
              }}
            />
          ))}
        </div>

        <div className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">
          LyriCraft Creative Engine
        </div>
      </div>
    </div>
  );
}
