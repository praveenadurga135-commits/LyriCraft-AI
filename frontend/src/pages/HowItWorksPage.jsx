import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Music2, 
  PenTool, 
  Wand2, 
  Activity, 
  Download, 
  ArrowDown, 
  Sparkles,
  ChevronRight,
  Copy,
  Layers,
  Check
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      stepNumber: 1,
      title: 'Enter Mood',
      subtitle: 'Define the emotional feel of your track',
      description: 'Select from popular emotions like Hopeful, Melancholic, Euphoric, Romantic, or enter your own custom mood.',
      icon: Heart,
      iconColor: 'from-pink-500 to-rose-600 text-pink-300',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      preview: (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 rounded-full text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30">Hopeful</span>
          <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Nostalgic</span>
          <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">Romantic</span>
        </div>
      )
    },
    {
      stepNumber: 2,
      title: 'Choose Genre',
      subtitle: 'Select your musical style and soundscape',
      description: 'Pick from genres such as Indie Folk, Pop, Rock, R&B, Lo-fi, Hip-Hop, or type a custom musical aesthetic.',
      icon: Music2,
      iconColor: 'from-indigo-500 to-purple-600 text-indigo-300',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      preview: (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Indie Folk</span>
          <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">Pop</span>
          <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">Lo-fi</span>
        </div>
      )
    },
    {
      stepNumber: 3,
      title: 'Enter Theme',
      subtitle: 'Provide your story, concepts or inspiration',
      description: 'Describe what your song is about—whether moving to a new city, late night reflections, heartbreak, or triumph.',
      icon: PenTool,
      iconColor: 'from-purple-500 to-pink-600 text-purple-300',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      preview: (
        <div className="p-3 rounded-xl bg-studio-900/80 border border-white/10 text-xs text-slate-300 italic">
          "Packing polaroids into cardboard boxes, leaving home, and chasing neon dreams..."
        </div>
      )
    },
    {
      stepNumber: 4,
      title: 'Generate Song',
      subtitle: 'Receive a full, balanced songwriting draft',
      description: 'The creative engine outputs structured sections including Verse 1, Chorus, Verse 2, Bridge, and Outro.',
      icon: Wand2,
      iconColor: 'from-cyan-500 to-indigo-600 text-cyan-300',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      preview: (
        <div className="space-y-1.5 p-3 rounded-xl bg-studio-900/80 border border-white/10 text-xs">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">[CHORUS]</span>
          <p className="text-slate-200">"And the streetlights whisper where you belong,"</p>
          <p className="text-slate-400">"A fragile spark turning into a song."</p>
        </div>
      )
    },
    {
      stepNumber: 5,
      title: 'Analyze Lyrics',
      subtitle: 'Review vocal flow, rhyme schemes, and meter',
      description: 'View line-by-line syllable counts, detected end-rhyme schemes (AABB, ABAB), and click any end-word for instant rhyme alternatives.',
      icon: Activity,
      iconColor: 'from-emerald-500 to-teal-600 text-emerald-300',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      preview: (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-studio-900/80 border border-white/10 text-xs">
          <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">10 syl</span>
          <span className="text-slate-300">"A fragile spark turning into a song"</span>
          <span className="ml-auto px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold">A</span>
        </div>
      )
    },
    {
      stepNumber: 6,
      title: 'Download or Copy',
      subtitle: 'Export your lyrics for recording or sharing',
      description: 'Easily copy lyrics to clipboard with one click, or download a clean formatted plain-text file to use during recording sessions.',
      icon: Download,
      iconColor: 'from-blue-500 to-indigo-600 text-blue-300',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      preview: (
        <div className="flex items-center gap-2 pt-1">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10">
            <Copy className="w-3.5 h-3.5 text-indigo-400" /> Copy Lyrics
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-indigo-600/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 border border-indigo-500/30">
            <Download className="w-3.5 h-3.5 text-indigo-400" /> Download .TXT
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step-by-Step Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How It Works
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Write and refine songs in 6 simple steps.
        </p>
      </div>

      {/* Timeline Cards */}
      <div className="space-y-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.stepNumber} className="relative flex flex-col items-center">
              
              {/* Timeline Card */}
              <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl hover:border-indigo-500/30 transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center shrink-0">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.iconColor} p-0.5 flex items-center justify-center shadow-lg`}>
                      <div className="w-full h-full bg-[#0c0f17] rounded-[14px] flex items-center justify-center">
                        <Icon className="w-7 h-7" />
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase border ${step.badgeColor}`}>
                      Step {step.stepNumber}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-indigo-300 font-medium mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Preview */}
                    <div className="pt-2">
                      {step.preview}
                    </div>
                  </div>

                </div>
              </div>

              {/* Downward Connector Arrow */}
              {!isLast && (
                <div className="my-3 flex flex-col items-center justify-center text-indigo-400/60 animate-pulse">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500/50 to-purple-500/50" />
                  <ArrowDown className="w-5 h-5 -mt-1 text-indigo-400" />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-6">
        <div className="glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to begin writing?</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Take your ideas into the studio and generate your original song.
          </p>
          <Link
            to="/create"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Song Now</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
