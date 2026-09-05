import React from 'react';
import { 
  Sparkles, 
  Music, 
  Layers, 
  Hash, 
  Activity, 
  Disc, 
  HeartHandshake, 
  Target,
  Wand2 
} from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Music,
      title: 'Original Lyric Generation',
      desc: 'Create heartfelt verses, anthemic choruses, and thoughtful bridges tailored to your vibe.'
    },
    {
      icon: Layers,
      title: 'Song Structure Architecture',
      desc: 'Build balanced arrangements with natural progression from introduction to outro.'
    },
    {
      icon: Hash,
      title: 'Rhyme Pattern Analysis',
      desc: 'Detect end-rhymes (AABB, ABAB) and discover singable phonetic alternatives.'
    },
    {
      icon: Activity,
      title: 'Syllable Counting & Flow',
      desc: 'Ensure vocal cadence and meter balance across every lyric line.'
    },
    {
      icon: Disc,
      title: 'Mood Board Inspiration',
      desc: 'Explore curated BPM ranges, instrumentation palettes, and production vibes.'
    },
    {
      icon: Wand2,
      title: 'Section Regeneration',
      desc: 'Iterate and rewrite specific sections seamlessly while preserving full song context.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      
      {/* Title & Core Overview */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About LyriCraft</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About LyriCraft
        </h1>

        <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
          An AI-powered songwriting assistant that helps musicians generate lyrics, analyze rhyme patterns and discover musical inspiration.
        </p>
      </div>

      {/* Mission Section */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
            <Target className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Our Purpose
            </h2>
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              Every songwriter encounters creative roadblocks when translating ideas into singable, structured music. LyriCraft provides an intuitive creative studio to overcome writer's block, experiment with rhyme schemes, and craft better songs faster.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            What You Can Do
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive suite of tools designed specifically for songwriting and lyrical flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start gap-4 hover:border-indigo-500/30 transition-all hover:translate-y-[-2px]"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
