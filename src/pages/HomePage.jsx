import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Sparkles, 
  Music, 
  Layers, 
  Hash, 
  Disc, 
  HelpCircle
} from 'lucide-react';

export default function HomePage() {
  const featureCards = [
    {
      icon: Music,
      color: 'from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30',
      title: 'Generate Lyrics',
      description: 'AI creates original song lyrics.'
    },
    {
      icon: Layers,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
      title: 'Song Structure',
      description: 'Automatic Verse Chorus Bridge generation.'
    },
    {
      icon: Hash,
      color: 'from-pink-500/20 to-pink-600/10 text-pink-400 border-pink-500/30',
      title: 'Rhyme Analysis',
      description: 'Shows rhyme scheme and syllable count.'
    },
    {
      icon: Disc,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
      title: 'Mood Board',
      description: 'Suggests tempo, instruments and musical atmosphere.'
    }
  ];

  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 sm:space-y-24 py-4 sm:py-8">
      
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
        
        {/* Modern Gradient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[580px] h-96 bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[420px] h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Studio Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Intelligent Songwriting Companion</span>
        </div>

        {/* Large Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]">
          Turn Your Ideas Into <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Beautiful Song Lyrics
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Describe your mood, genre and theme. LyriCraft instantly generates original lyrics, song structure, rhyme analysis and creative inspiration for musicians and songwriters.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/create"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-base transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 flex items-center gap-2.5 border border-white/20"
          >
            <Wand2 className="w-5 h-5" />
            <span>Generate Song</span>
          </Link>

          <button
            onClick={scrollToFeatures}
            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-base border border-white/10 transition-all hover:border-white/20 flex items-center gap-2.5 backdrop-blur-md hover:scale-105 active:scale-95"
          >
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span>Explore Features</span>
          </button>
        </div>

        {/* MUSIC ILLUSTRATION (Animated SVG) */}
        <div className="pt-8 max-w-2xl mx-auto">
          <div className="relative p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden group">
            
            {/* Ambient inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-70 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col items-center">
              
              <div className="w-full max-w-md h-48 sm:h-60 flex items-center justify-center relative">
                
                <svg viewBox="0 0 500 240" className="w-full h-full drop-shadow-2xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="vinylGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e1b4b" />
                      <stop offset="50%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#311042" />
                    </linearGradient>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Audio Waveform Background Line */}
                  <path 
                    d="M 10,120 Q 70,50 130,120 T 250,120 T 370,120 T 490,120" 
                    stroke="url(#waveGrad)" 
                    strokeWidth="2.5" 
                    strokeOpacity="0.3" 
                    strokeDasharray="4 4"
                  />
                  <path 
                    d="M 10,120 Q 70,180 130,120 T 250,120 T 370,120 T 490,120" 
                    stroke="url(#waveGrad)" 
                    strokeWidth="2.5" 
                    strokeOpacity="0.2" 
                    strokeDasharray="6 6"
                  />

                  {/* Rotating Vinyl Record Disk */}
                  <g className="animate-[spin_16s_linear_infinite]" style={{ transformOrigin: '250px 120px' }}>
                    <circle cx="250" cy="120" r="90" fill="url(#vinylGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <circle cx="250" cy="120" r="76" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <circle cx="250" cy="120" r="64" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <circle cx="250" cy="120" r="52" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <circle cx="250" cy="120" r="40" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
                    <circle cx="250" cy="120" r="28" fill="url(#ringGrad)" />
                    <circle cx="250" cy="120" r="24" fill="#0c0f17" />
                    <circle cx="250" cy="120" r="5" fill="#ffffff" />
                  </g>

                  {/* Floating Musical Notes */}
                  <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                    <circle cx="95" cy="75" r="6" fill="#818cf8" filter="url(#glow)" />
                    <rect x="98" y="45" width="2.5" height="30" rx="1.2" fill="#818cf8" />
                    <path d="M 100 45 C 115 47, 115 58, 115 62" stroke="#818cf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </g>

                  <g className="animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                    <circle cx="405" cy="70" r="6" fill="#f472b6" filter="url(#glow)" />
                    <rect x="408" y="40" width="2.5" height="30" rx="1.2" fill="#f472b6" />
                    <path d="M 410 40 C 425 42, 425 53, 425 57" stroke="#f472b6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </g>

                  {/* Stylized Equalizer Spectrum Bars */}
                  <g>
                    {[
                      { x: 180, h: 18 }, { x: 195, h: 32 }, { x: 210, h: 44 },
                      { x: 225, h: 26 }, { x: 240, h: 50 }, { x: 255, h: 58 },
                      { x: 270, h: 46 }, { x: 285, h: 28 }, { x: 300, h: 40 },
                      { x: 315, h: 22 }
                    ].map((bar, idx) => (
                      <rect
                        key={idx}
                        x={bar.x}
                        y={225 - bar.h}
                        width="5"
                        height={bar.h}
                        rx="2.5"
                        fill="url(#ringGrad)"
                        opacity="0.85"
                      />
                    ))}
                  </g>
                </svg>

              </div>

              {/* Status bar under vinyl */}
              <div className="flex items-center justify-between w-full pt-3 border-t border-white/10 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Sonic Inspiration & Lyrical Architecture
                </span>
                <span className="font-mono text-indigo-300">Tempo • Rhyme • Flow</span>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* FEATURE CARDS SECTION */}
      <section id="features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Songwriting Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Craft Songs With Precision
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From lyrical rhythm to arrangement structure and musical mood.
          </p>
        </div>

        {/* 4 Feature Cards Grid as required */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center border shadow-inner`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-lg text-white">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-pink-900/40 border border-white/15 backdrop-blur-xl shadow-2xl text-center space-y-6">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Turn Your Ideas Into Songs?
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              Start crafting structured lyrics with rhyme scheme detection and customized musical mood boards.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/create"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4 text-indigo-600" />
              <span>Start Writing Now</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
