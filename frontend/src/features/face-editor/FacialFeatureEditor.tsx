'use client';

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Dice5, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Link2, 
  Unlink, 
  Plus, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  FaceState, 
  FeatureSectionId, 
  FeaturePreset 
} from './types';
import { 
  HEAD_JAW_PRESETS,
  HAIR_PRESETS,
  EYEBROW_PRESETS,
  EYE_PRESETS,
  NOSE_PRESETS,
  MOUTH_PRESETS,
  EAR_PRESETS,
  FACIAL_HAIR_PRESETS,
  GLASSES_PRESETS,
  HEADWEAR_PRESETS,
  MARKS_SCARS_PRESETS,
  SKIN_AGE_PRESETS,
  INITIAL_FACE_STATE
} from './defaultFaceState';

interface FacialFeatureEditorProps {
  state: FaceState;
  onChange: (newState: FaceState) => void;
  activeSection: FeatureSectionId;
  onSelectSection: (section: FeatureSectionId) => void;
  onHoverPreset?: (previewState: FaceState | null) => void;
}

export function FacialFeatureEditor({
  state: rawState,
  onChange,
  activeSection,
  onSelectSection,
  onHoverPreset
}: FacialFeatureEditorProps) {
  const state = {
    ...INITIAL_FACE_STATE,
    ...(rawState || {}),
    head_jaw: { ...INITIAL_FACE_STATE.head_jaw, ...(rawState?.head_jaw || {}) },
    hair: { ...INITIAL_FACE_STATE.hair, ...(rawState?.hair || {}) },
    eyebrows: { ...INITIAL_FACE_STATE.eyebrows, ...(rawState?.eyebrows || {}) },
    eyes: { ...INITIAL_FACE_STATE.eyes, ...(rawState?.eyes || {}) },
    nose: { ...INITIAL_FACE_STATE.nose, ...(rawState?.nose || {}) },
    mouth: { ...INITIAL_FACE_STATE.mouth, ...(rawState?.mouth || {}) },
    ears: { ...INITIAL_FACE_STATE.ears, ...(rawState?.ears || {}) },
    facial_hair: { ...INITIAL_FACE_STATE.facial_hair, ...(rawState?.facial_hair || {}) },
    glasses: { ...INITIAL_FACE_STATE.glasses, ...(rawState?.glasses || {}) },
    headwear: { ...INITIAL_FACE_STATE.headwear, ...(rawState?.headwear || {}) },
    marks_scars: rawState?.marks_scars || INITIAL_FACE_STATE.marks_scars,
    skin_age: { ...INITIAL_FACE_STATE.skin_age, ...(rawState?.skin_age || {}) },
    locked_features: { ...INITIAL_FACE_STATE.locked_features, ...(rawState?.locked_features || {}) },
    hidden_features: { ...INITIAL_FACE_STATE.hidden_features, ...(rawState?.hidden_features || {}) },
    confidence_ratings: { ...INITIAL_FACE_STATE.confidence_ratings, ...(rawState?.confidence_ratings || {}) }
  };

  // Mobile drawer collapsed state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Helper to update specific sub-state
  const updateSection = <K extends keyof FaceState>(key: K, data: Partial<FaceState[K]>) => {
    const updated = {
      ...state,
      [key]: {
        ...(typeof state[key] === 'object' && state[key] !== null ? state[key] : {}),
        ...data
      }
    };
    onChange(updated);
  };

  // Helper for resetting a section to baseline
  const handleResetSection = (section: FeatureSectionId) => {
    const next = JSON.parse(JSON.stringify(state));
    if (section === 'head_jaw') next.head_jaw = { ...INITIAL_FACE_STATE.head_jaw };
    if (section === 'hair') next.hair = { ...INITIAL_FACE_STATE.hair };
    if (section === 'eyebrows') next.eyebrows = { ...INITIAL_FACE_STATE.eyebrows };
    if (section === 'eyes') next.eyes = { ...INITIAL_FACE_STATE.eyes };
    if (section === 'nose') next.nose = { ...INITIAL_FACE_STATE.nose };
    if (section === 'mouth') next.mouth = { ...INITIAL_FACE_STATE.mouth };
    if (section === 'ears') next.ears = { ...INITIAL_FACE_STATE.ears };
    if (section === 'facial_hair') next.facial_hair = { ...INITIAL_FACE_STATE.facial_hair };
    if (section === 'glasses_headwear') {
      next.glasses = { ...INITIAL_FACE_STATE.glasses };
      next.headwear = { ...INITIAL_FACE_STATE.headwear };
    }
    if (section === 'marks_scars') next.marks_scars = [...INITIAL_FACE_STATE.marks_scars];
    if (section === 'skin_age') next.skin_age = { ...INITIAL_FACE_STATE.skin_age };
    onChange(next);
  };

  // Helper for randomizing only this section
  const handleRandomizeSection = (section: FeatureSectionId) => {
    const next = JSON.parse(JSON.stringify(state));
    function pick<T>(arr: FeaturePreset<T>[]): Partial<T> {
      return arr[Math.floor(Math.random() * arr.length)].data;
    }

    if (section === 'head_jaw') next.head_jaw = { ...next.head_jaw, ...pick(HEAD_JAW_PRESETS) };
    if (section === 'hair') next.hair = { ...next.hair, ...pick(HAIR_PRESETS) };
    if (section === 'eyebrows') next.eyebrows = { ...next.eyebrows, ...pick(EYEBROW_PRESETS) };
    if (section === 'eyes') next.eyes = { ...next.eyes, ...pick(EYE_PRESETS) };
    if (section === 'nose') next.nose = { ...next.nose, ...pick(NOSE_PRESETS) };
    if (section === 'mouth') next.mouth = { ...next.mouth, ...pick(MOUTH_PRESETS) };
    if (section === 'ears') next.ears = { ...next.ears, ...pick(EAR_PRESETS) };
    if (section === 'facial_hair') next.facial_hair = { ...next.facial_hair, ...pick(FACIAL_HAIR_PRESETS) };
    if (section === 'glasses_headwear') next.glasses = { ...next.glasses, ...pick(GLASSES_PRESETS) };
    if (section === 'skin_age') next.skin_age = { ...next.skin_age, ...pick(SKIN_AGE_PRESETS) };
    onChange(next);
  };

  // Toggle lock for randomization protection
  const handleToggleLock = (section: FeatureSectionId) => {
    const locked = !state.locked_features[section];
    onChange({
      ...state,
      locked_features: {
        ...state.locked_features,
        [section]: locked
      }
    });
  };

  // Toggle feature visibility
  const handleToggleHide = (key: 'hair' | 'facial_hair' | 'glasses' | 'headwear' | 'marks_scars') => {
    onChange({
      ...state,
      hidden_features: {
        ...state.hidden_features,
        [key]: !state.hidden_features[key]
      }
    });
  };

  // Update confidence rating
  const handleConfidenceChange = (key: string, value: number) => {
    onChange({
      ...state,
      confidence_ratings: {
        ...state.confidence_ratings,
        [key]: value
      }
    });
  };

  // Section Tabs Definition
  const SECTIONS: { id: FeatureSectionId; label: string; confidenceKey: string }[] = [
    { id: 'head_jaw', label: 'HEAD & JAW', confidenceKey: 'jawline' },
    { id: 'hair', label: 'HAIR', confidenceKey: 'hair_style' },
    { id: 'eyebrows', label: 'EYEBROWS', confidenceKey: 'eyebrows' },
    { id: 'eyes', label: 'EYES', confidenceKey: 'eyes' },
    { id: 'nose', label: 'NOSE', confidenceKey: 'nose' },
    { id: 'mouth', label: 'LIPS & MOUTH', confidenceKey: 'mouth' },
    { id: 'ears', label: 'EARS', confidenceKey: 'ears' },
    { id: 'facial_hair', label: 'FACIAL HAIR', confidenceKey: 'facial_hair' },
    { id: 'glasses_headwear', label: 'GLASSES & HEADWEAR', confidenceKey: 'glasses' },
    { id: 'marks_scars', label: 'MARKS & SCARS', confidenceKey: 'scars_marks' },
    { id: 'skin_age', label: 'SKIN & AGE', confidenceKey: 'age' },
  ];

  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];
  const isLocked = !!state.locked_features[activeSection];
  const confidenceVal = state.confidence_ratings[currentSectionMeta.confidenceKey] || 85;

  return (
    <div className="rounded-2xl bg-[#0C0E14] border border-white/[0.08] shadow-xl overflow-hidden flex flex-col">
      {/* Mobile Accordion Toggle Header (Visible on Mobile) */}
      <div className="lg:hidden p-3 bg-[#12151D] border-b border-white/[0.08] flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-police-blue flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FACIAL FEATURE EDITOR: {currentSectionMeta.label}</span>
        </span>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-1 text-slate-400 hover:text-white"
        >
          {mobileDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Feature Section Tab Bar */}
      <div className={`p-2 bg-[#07080B] border-b border-white/[0.08] overflow-x-auto scrollbar-thin ${!mobileDrawerOpen ? 'hidden lg:block' : 'block'}`}>
        <div className="flex space-x-1 min-w-max">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                activeSection === sec.id
                  ? 'bg-blue-600 text-white shadow-md shadow-sm ring-1 ring-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#12151D]'
              }`}
            >
              <span>{sec.label}</span>
              {state.locked_features[sec.id] && <Lock className="w-2.5 h-2.5 text-blue-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Section Content Area */}
      <div className={`p-4 space-y-4 font-mono text-xs ${!mobileDrawerOpen ? 'hidden lg:block' : 'block'}`}>
        
        {/* Section Action Bar: Reset, Randomize, Lock, Confidence Slider */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#07080B] border border-white/[0.08]">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleResetSection(activeSection)}
              className="px-2.5 py-1 rounded bg-[#12151D] hover:bg-slate-800 text-slate-300 border border-white/[0.1] flex items-center space-x-1 text-[11px]"
              title="Reset this feature to baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => handleRandomizeSection(activeSection)}
              disabled={isLocked}
              className="px-2.5 py-1 rounded bg-[#12151D] hover:bg-slate-800 text-slate-300 border border-white/[0.1] flex items-center space-x-1 text-[11px] disabled:opacity-40"
              title="Randomize this feature"
            >
              <Dice5 className="w-3 h-3 text-blue-400" />
              <span>Randomize</span>
            </button>

            <button
              onClick={() => handleToggleLock(activeSection)}
              className={`px-2.5 py-1 rounded border flex items-center space-x-1 text-[11px] ${
                isLocked 
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 font-bold' 
                  : 'bg-[#12151D] border-white/[0.1] text-slate-400 hover:text-white'
              }`}
              title={isLocked ? "Feature is locked against random variations" : "Lock this feature"}
            >
              {isLocked ? <Lock className="w-3 h-3 text-blue-400" /> : <Unlock className="w-3 h-3" />}
              <span>{isLocked ? 'LOCKED' : 'Lock'}</span>
            </button>
          </div>

          {/* Attached Witness Confidence Slider */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">WITNESS CONFIDENCE:</span>
            <input
              type="range"
              min="30"
              max="100"
              value={confidenceVal}
              onChange={(e) => handleConfidenceChange(currentSectionMeta.confidenceKey, Number(e.target.value))}
              className="w-24 accent-blue-600"
            />
            <span className="text-[11px] font-bold text-blue-400 w-8 text-right">{confidenceVal}%</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. HEAD & JAW SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'head_jaw' && (
          <div className="space-y-4">
            {/* Presets Grid */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                HEAD & MANDIBLE ARCHETYPES ({HEAD_JAW_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HEAD_JAW_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('head_jaw', p.data)}
                    onMouseEnter={() => {
                      if (onHoverPreset) {
                        onHoverPreset({ ...state, head_jaw: { ...state.head_jaw, ...p.data } });
                      }
                    }}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continuous Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Craniofacial Width</span>
                  <span className="text-blue-400">{Math.round(state.head_jaw.width * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.01"
                  value={state.head_jaw.width}
                  onChange={(e) => updateSection('head_jaw', { width: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Mandibular Jaw Angle</span>
                  <span className="text-blue-400">{Math.round(state.head_jaw.jaw_angle * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.45"
                  step="0.01"
                  value={state.head_jaw.jaw_angle}
                  onChange={(e) => updateSection('head_jaw', { jaw_angle: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Chin Vertical Length</span>
                  <span className="text-blue-400">{Math.round(state.head_jaw.chin_length * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.35"
                  step="0.01"
                  value={state.head_jaw.chin_length}
                  onChange={(e) => updateSection('head_jaw', { chin_length: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Cheekbone Prominence</span>
                  <span className="text-blue-400">{Math.round(state.head_jaw.cheekbone_prominence * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.01"
                  value={state.head_jaw.cheekbone_prominence}
                  onChange={(e) => updateSection('head_jaw', { cheekbone_prominence: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. HAIR SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'hair' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                HAIR STYLES & PATTERNS ({HAIR_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HAIR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('hair', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, hair: { ...state.hair, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">HAIR COLOR</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={state.hair.color}
                    onChange={(e) => updateSection('hair', { color: e.target.value })}
                    className="w-9 h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer"
                  />
                  <div className="flex space-x-1.5">
                    {['#1C1917', '#3B2219', '#78350F', '#D97706', '#E5E7EB', '#9CA3AF'].map((c) => (
                      <button
                        key={c}
                        onClick={() => updateSection('hair', { color: c })}
                        style={{ backgroundColor: c }}
                        className="w-5 h-5 rounded-full border border-white/[0.1]"
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Gray / White Hair %</span>
                  <span className="text-blue-400">{state.hair.gray_percentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.hair.gray_percentage}
                  onChange={(e) => updateSection('hair', { gray_percentage: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. EYEBROWS SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'eyebrows' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                EYEBROW SHAPE ARCHETYPES ({EYEBROW_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EYEBROW_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('eyebrows', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, eyebrows: { ...state.eyebrows, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Brow Thickness</span>
                  <span className="text-blue-400">{Math.round(state.eyebrows.thickness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={state.eyebrows.thickness}
                  onChange={(e) => updateSection('eyebrows', { thickness: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Brow Tilt Angle</span>
                  <span className="text-blue-400">{state.eyebrows.tilt}°</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="15"
                  step="1"
                  value={state.eyebrows.tilt}
                  onChange={(e) => updateSection('eyebrows', { tilt: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Interbrow Spacing (Glabella)</span>
                  <span className="text-blue-400">{Math.round(state.eyebrows.spacing * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.65"
                  max="1.45"
                  step="0.02"
                  value={state.eyebrows.spacing}
                  onChange={(e) => updateSection('eyebrows', { spacing: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Vertical Brow Height</span>
                  <span className="text-blue-400">{Math.round(state.eyebrows.height * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.02"
                  value={state.eyebrows.height}
                  onChange={(e) => updateSection('eyebrows', { height: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. EYES SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'eyes' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                PALPEBRAL FISSURE & ORBITAL ARCHETYPES ({EYE_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EYE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('eyes', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, eyes: { ...state.eyes, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">IRIS COLOR</label>
                <select
                  value={state.eyes.color}
                  onChange={(e) => updateSection('eyes', { color: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#12151D] border border-white/[0.1] text-white text-xs"
                >
                  <option value="dark_brown">Dark Brown / Black</option>
                  <option value="light_brown">Light Brown</option>
                  <option value="hazel">Hazel Green-Brown</option>
                  <option value="blue">Blue</option>
                  <option value="gray">Steel Gray</option>
                  <option value="green">Emerald Green</option>
                  <option value="amber">Amber / Golden</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">SUPERIOR EYELID CREASE</label>
                <select
                  value={state.eyes.eyelids}
                  onChange={(e) => updateSection('eyes', { eyelids: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#12151D] border border-white/[0.1] text-white text-xs"
                >
                  <option value="hooded">Hooded / Redundant Fold</option>
                  <option value="prominent_double">Prominent Double Lid</option>
                  <option value="subtle">Subtle Fine Crease</option>
                  <option value="monolid">Monolid Epicanthic Fold</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Eye Size</span>
                  <span className="text-blue-400">{Math.round(state.eyes.size * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.02"
                  value={state.eyes.size}
                  onChange={(e) => updateSection('eyes', { size: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Interpupillary Spacing</span>
                  <span className="text-blue-400">{Math.round(state.eyes.spacing * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.78"
                  max="1.35"
                  step="0.02"
                  value={state.eyes.spacing}
                  onChange={(e) => updateSection('eyes', { spacing: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Canthal Tilt</span>
                  <span className="text-blue-400">{state.eyes.tilt}°</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="12"
                  step="1"
                  value={state.eyes.tilt}
                  onChange={(e) => updateSection('eyes', { tilt: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Infraorbital Bags</span>
                  <span className="text-blue-400">{Math.round(state.eyes.under_eye_bags * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.eyes.under_eye_bags}
                  onChange={(e) => updateSection('eyes', { under_eye_bags: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 5. NOSE SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'nose' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                NASAL MORPHOLOGY ARCHETYPES ({NOSE_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {NOSE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('nose', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, nose: { ...state.nose, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Nose Length</span>
                  <span className="text-blue-400">{Math.round(state.nose.length * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.02"
                  value={state.nose.length}
                  onChange={(e) => updateSection('nose', { length: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Alar Base Width</span>
                  <span className="text-blue-400">{Math.round(state.nose.width * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.45"
                  step="0.02"
                  value={state.nose.width}
                  onChange={(e) => updateSection('nose', { width: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">NASAL BRIDGE STRUCTURE</label>
                <select
                  value={state.nose.bridge}
                  onChange={(e) => updateSection('nose', { bridge: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#12151D] border border-white/[0.1] text-white text-xs"
                >
                  <option value="straight">Straight Aquiline</option>
                  <option value="aquiline_hook">Roman Convex Hump</option>
                  <option value="concave">Concave / Ski Slope</option>
                  <option value="broad_flat">Broad Low Bridge</option>
                  <option value="narrow_sharp">Narrow Chiseled</option>
                  <option value="broken_deviated">Traumatic Deviated Septum</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">NASAL TIP MORPHOLOGY</label>
                <select
                  value={state.nose.tip}
                  onChange={(e) => updateSection('nose', { tip: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#12151D] border border-white/[0.1] text-white text-xs"
                >
                  <option value="pointed">Pointed Defined</option>
                  <option value="bulbous">Bulbous Fleshy</option>
                  <option value="upturned">Upturned Elevated</option>
                  <option value="downturned">Downturned Drooping</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 6. LIPS & MOUTH SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'mouth' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                VERMILION & ORAL FISSURE ARCHETYPES ({MOUTH_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOUTH_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('mouth', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, mouth: { ...state.mouth, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Mouth Width</span>
                  <span className="text-blue-400">{Math.round(state.mouth.width * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.45"
                  step="0.02"
                  value={state.mouth.width}
                  onChange={(e) => updateSection('mouth', { width: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Upper Lip Thickness</span>
                  <span className="text-blue-400">{Math.round(state.mouth.upper_lip_thickness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={state.mouth.upper_lip_thickness}
                  onChange={(e) => updateSection('mouth', { upper_lip_thickness: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Lower Lip Thickness</span>
                  <span className="text-blue-400">{Math.round(state.mouth.lower_lip_thickness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={state.mouth.lower_lip_thickness}
                  onChange={(e) => updateSection('mouth', { lower_lip_thickness: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Philtrum Column Depth</span>
                  <span className="text-blue-400">{Math.round(state.mouth.philtrum_depth * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.mouth.philtrum_depth}
                  onChange={(e) => updateSection('mouth', { philtrum_depth: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 7. EARS SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'ears' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                AURICULAR ANATOMY ARCHETYPES ({EAR_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EAR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('ears', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, ears: { ...state.ears, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Ear Size</span>
                  <span className="text-blue-400">{Math.round(state.ears.size * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.02"
                  value={state.ears.size}
                  onChange={(e) => updateSection('ears', { size: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Ear Protrusion</span>
                  <span className="text-blue-400">{Math.round(state.ears.protrusion * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={state.ears.protrusion}
                  onChange={(e) => updateSection('ears', { protrusion: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 8. FACIAL HAIR SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'facial_hair' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                BEARD & MOUSTACHE PATTERNS ({FACIAL_HAIR_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FACIAL_HAIR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('facial_hair', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, facial_hair: { ...state.facial_hair, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>5-O’Clock Stubble Density</span>
                  <span className="text-blue-400">{Math.round(state.facial_hair.stubble_density * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.facial_hair.stubble_density}
                  onChange={(e) => updateSection('facial_hair', { stubble_density: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">FACIAL HAIR VISIBILITY</label>
                <button
                  onClick={() => handleToggleHide('facial_hair')}
                  className="w-full py-2 rounded bg-[#12151D] border border-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center space-x-1.5"
                >
                  {state.hidden_features.facial_hair ? <EyeOff className="w-3.5 h-3.5 text-blue-400" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{state.hidden_features.facial_hair ? "HIDDEN (TAP TO SHOW)" : "VISIBLE (TAP TO HIDE)"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 9. GLASSES & HEADWEAR SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'glasses_headwear' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                OPTICAL FRAMES & GLASSES ({GLASSES_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GLASSES_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('glasses', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, glasses: { ...state.glasses, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                HEADWEAR & TACTICAL CAPS ({HEADWEAR_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HEADWEAR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('headwear', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, headwear: { ...state.headwear, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 10. MARKS & SCARS SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'marks_scars' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                QUICK ADD FORENSIC MARKS ({MARKS_SCARS_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MARKS_SCARS_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const newMark = {
                        id: `mark_${Date.now()}`,
                        ...p.data
                      } as any;
                      onChange({ ...state, marks_scars: [...state.marks_scars, newMark] });
                    }}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">+ {p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Marks List with fine-tuning */}
            <div className="space-y-2">
              <label className="block text-[10px] text-slate-400 font-bold uppercase">
                ACTIVE FACIAL MARKS ON SUSPECT ({state.marks_scars.length})
              </label>
              {state.marks_scars.map((m, idx) => (
                <div key={m.id} className="p-3 rounded-xl bg-[#07080B] border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-[11px]">
                      {idx + 1}. {m.label || m.type.toUpperCase()}
                    </span>
                    <button
                      onClick={() => {
                        onChange({
                          ...state,
                          marks_scars: state.marks_scars.filter((item) => item.id !== m.id)
                        });
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Remove mark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-500">Horizontal X%: {Math.round(m.x)}</span>
                      <input
                        type="range"
                        min="15"
                        max="85"
                        value={m.x}
                        onChange={(e) => {
                          const updated = state.marks_scars.map((item) => item.id === m.id ? { ...item, x: Number(e.target.value) } : item);
                          onChange({ ...state, marks_scars: updated });
                        }}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Vertical Y%: {Math.round(m.y)}</span>
                      <input
                        type="range"
                        min="20"
                        max="85"
                        value={m.y}
                        onChange={(e) => {
                          const updated = state.marks_scars.map((item) => item.id === m.id ? { ...item, y: Number(e.target.value) } : item);
                          onChange({ ...state, marks_scars: updated });
                        }}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Scale: {m.size.toFixed(1)}x</span>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={m.size}
                        onChange={(e) => {
                          const updated = state.marks_scars.map((item) => item.id === m.id ? { ...item, size: Number(e.target.value) } : item);
                          onChange({ ...state, marks_scars: updated });
                        }}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Rotation: {m.rotation}°</span>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        step="5"
                        value={m.rotation}
                        onChange={(e) => {
                          const updated = state.marks_scars.map((item) => item.id === m.id ? { ...item, rotation: Number(e.target.value) } : item);
                          onChange({ ...state, marks_scars: updated });
                        }}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 11. SKIN & AGE SECTION */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'skin_age' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                FITZPATRICK DERMATOLOGY & AGE PRESETS ({SKIN_AGE_PRESETS.length} PRESETS)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SKIN_AGE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSection('skin_age', p.data)}
                    onMouseEnter={() => onHoverPreset && onHoverPreset({ ...state, skin_age: { ...state.skin_age, ...p.data } })}
                    onMouseLeave={() => onHoverPreset && onHoverPreset(null)}
                    className="p-2 rounded-lg bg-[#07080B] hover:bg-[#12151D] border border-white/[0.08] hover:border-blue-500 text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200 text-[11px] truncate">{p.label}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#07080B] border border-white/[0.08]">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Apparent Biological Age</span>
                  <span className="text-blue-400 font-bold">{state.skin_age.age_appearance} Years</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="75"
                  value={state.skin_age.age_appearance}
                  onChange={(e) => updateSection('skin_age', { age_appearance: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">SKIN PIGMENT TONE</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={state.skin_age.skin_tone}
                    onChange={(e) => updateSection('skin_age', { skin_tone: e.target.value })}
                    className="w-9 h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer"
                  />
                  <div className="flex space-x-1.5">
                    {['#F9EBEA', '#F5CBA7', '#DCB289', '#B78759', '#875734', '#4B3322'].map((tone) => (
                      <button
                        key={tone}
                        onClick={() => updateSection('skin_age', { skin_tone: tone })}
                        style={{ backgroundColor: tone }}
                        className="w-5 h-5 rounded-full border border-white/[0.1]"
                        title={tone}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Forehead Rhytids (Wrinkles)</span>
                  <span className="text-blue-400">{Math.round(state.skin_age.forehead_wrinkles * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.skin_age.forehead_wrinkles}
                  onChange={(e) => updateSection('skin_age', { forehead_wrinkles: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Nasolabial Creases</span>
                  <span className="text-blue-400">{Math.round(state.skin_age.nasolabial_folds * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.skin_age.nasolabial_folds}
                  onChange={(e) => updateSection('skin_age', { nasolabial_folds: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
