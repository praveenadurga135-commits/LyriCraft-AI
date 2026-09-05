import React, { useState } from 'react';
import { Layers, Plus, X, ArrowRight, Check } from 'lucide-react';

export const PRESET_STRUCTURES = [
  {
    id: 'pop-standard',
    name: 'Verse → Chorus → Verse → Chorus',
    sections: ['Verse 1', 'Chorus', 'Verse 2', 'Chorus'],
    tag: 'Classic Pop'
  },
  {
    id: 'full-ballad',
    name: 'Verse → Chorus → Verse → Chorus → Bridge → Chorus',
    sections: ['Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Chorus'],
    tag: 'Standard Radio / Indie'
  },
  {
    id: 'story-driven',
    name: 'Verse → Verse → Chorus → Bridge → Chorus',
    sections: ['Verse 1', 'Verse 2', 'Chorus', 'Bridge', 'Chorus'],
    tag: 'Storyteller / Folk'
  },
  {
    id: 'anthem-epic',
    name: 'Intro → Verse → Chorus → Verse → Chorus → Bridge → Chorus → Outro',
    sections: ['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    tag: 'Epic / Arena Rock'
  },
  {
    id: 'custom',
    name: 'Custom Structure',
    sections: [],
    tag: 'Songwriter DIY'
  }
];

const AVAILABLE_SECTION_TYPES = [
  'Intro', 'Verse 1', 'Pre-Chorus', 'Chorus', 'Verse 2', 'Bridge', 'Guitar Solo', 'Outro'
];

export default function SongStructureSelector({ 
  structure, 
  setStructure, 
  selectedPreset, 
  setSelectedPreset 
}) {
  const [customSections, setCustomSections] = useState(structure);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    if (preset.id === 'custom') {
      if (customSections.length === 0) {
        const initial = ['Verse 1', 'Chorus', 'Verse 2', 'Chorus'];
        setCustomSections(initial);
        setStructure(initial);
      } else {
        setStructure(customSections);
      }
    } else {
      setStructure(preset.sections);
    }
  };

  const addCustomSection = (type) => {
    const updated = [...structure, type];
    setCustomSections(updated);
    setStructure(updated);
  };

  const removeCustomSection = (index) => {
    const updated = structure.filter((_, i) => i !== index);
    setCustomSections(updated);
    setStructure(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Song Structure</span>
        </label>
        <span className="text-xs text-slate-400">
          {structure.length} sections planned
        </span>
      </div>

      {/* Preset Radio Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PRESET_STRUCTURES.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                  : 'bg-studio-900/60 border-white/5 hover:border-white/20 hover:bg-studio-850'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                  isSelected 
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}>
                  {preset.tag}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
              <p className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {preset.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom Structure Builder (Visible when Custom is active) */}
      {selectedPreset === 'custom' && (
        <div className="p-3.5 rounded-xl bg-studio-900/80 border border-indigo-500/30 space-y-3">
          <div className="text-xs text-slate-300 font-medium">Add Sections to Your Sequence:</div>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_SECTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addCustomSection(type)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 text-slate-300 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Visual Sequence Flow Chips */}
      <div className="p-3 rounded-xl bg-studio-950/60 border border-white/5 overflow-x-auto">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
          Arrangement Flowchart:
        </div>
        <div className="flex items-center gap-1.5 min-w-max">
          {structure.map((sec, idx) => (
            <React.Fragment key={`${sec}-${idx}`}>
              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border shadow-sm ${
                sec.toLowerCase().includes('chorus')
                  ? 'bg-purple-950/60 text-purple-200 border-purple-500/40'
                  : sec.toLowerCase().includes('verse')
                  ? 'bg-indigo-950/60 text-indigo-200 border-indigo-500/40'
                  : sec.toLowerCase().includes('bridge')
                  ? 'bg-amber-950/60 text-amber-200 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700'
              }`}>
                <span>{sec}</span>
                {selectedPreset === 'custom' && (
                  <button
                    type="button"
                    onClick={() => removeCustomSection(idx)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              {idx < structure.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
