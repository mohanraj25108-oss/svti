'use client';

import React, { useId, memo } from 'react';
import { FaceState, FeatureSectionId } from '../types';
import { INITIAL_FACE_STATE } from '../defaultFaceState';
import { computeHeadContour, computeNeckPath } from './proportions';

interface ParametricFaceSvgProps {
  state: FaceState;
  mode?: 'pencil' | 'realistic';
  showGrid?: boolean;
  selectedSection?: FeatureSectionId | null;
  onSelectSection?: (section: FeatureSectionId) => void;
  className?: string;
  id?: string;
}

export const ParametricFaceSvg = memo(function ParametricFaceSvg({
  state,
  mode = 'pencil',
  showGrid = false,
  selectedSection,
  onSelectSection,
  className = '',
  id
}: ParametricFaceSvgProps) {
  const uid = useId().replace(/:/g, '_');
  const isPencil = mode === 'pencil';

  // Face proportions & anatomical center coordinates
  const cx = 300;
  const cy = 350;

  // Ensure all sections and properties are defined with robust fallback to INITIAL_FACE_STATE
  const safeState = {
    ...INITIAL_FACE_STATE,
    ...(state || {}),
    head_jaw: { ...INITIAL_FACE_STATE.head_jaw, ...(state?.head_jaw || {}) },
    hair: { ...INITIAL_FACE_STATE.hair, ...(state?.hair || {}) },
    eyebrows: { ...INITIAL_FACE_STATE.eyebrows, ...(state?.eyebrows || {}) },
    eyes: { ...INITIAL_FACE_STATE.eyes, ...(state?.eyes || {}) },
    nose: { ...INITIAL_FACE_STATE.nose, ...(state?.nose || {}) },
    mouth: { ...INITIAL_FACE_STATE.mouth, ...(state?.mouth || {}) },
    ears: { ...INITIAL_FACE_STATE.ears, ...(state?.ears || {}) },
    facial_hair: { ...INITIAL_FACE_STATE.facial_hair, ...(state?.facial_hair || {}) },
    glasses: { ...INITIAL_FACE_STATE.glasses, ...(state?.glasses || {}) },
    headwear: { ...INITIAL_FACE_STATE.headwear, ...(state?.headwear || {}) },
    marks_scars: state?.marks_scars || INITIAL_FACE_STATE.marks_scars,
    skin_age: { ...INITIAL_FACE_STATE.skin_age, ...(state?.skin_age || {}) },
    locked_features: { ...INITIAL_FACE_STATE.locked_features, ...(state?.locked_features || {}) },
    hidden_features: { ...INITIAL_FACE_STATE.hidden_features, ...(state?.hidden_features || {}) },
  };

  const {
    head_jaw,
    hair,
    eyebrows,
    eyes,
    nose,
    mouth,
    ears,
    facial_hair,
    glasses,
    headwear,
    marks_scars,
    skin_age
  } = safeState;

  // Geometry calculations
  const eyeLineY = cy - 20 * eyes.vertical_position;
  const browLineY = eyeLineY - (28 * eyebrows.height);
  const eyeDistance = 64 * eyes.spacing;
  const leftEyeX = cx - eyeDistance;
  const rightEyeX = cx + eyeDistance;

  const noseTipY = cy + (65 * nose.length * nose.vertical_position);
  const noseBridgeY = browLineY + 12;
  const noseWidth = 26 * nose.width;

  const mouthY = cy + 124 * mouth.vertical_position;
  const mouthHalfW = 34 * mouth.width;

  const earTopY = browLineY - 4;
  const earBottomY = noseTipY - 8;
  const earHeight = (earBottomY - earTopY) * ears.size;
  const earW = 28 * ears.size * ears.protrusion;
  const headW = 142 * head_jaw.width;

  // Color tokens
  const skinToneHex = isPencil ? '#161B22' : skin_age.skin_tone;
  const skinStroke = isPencil ? '#C9D1D9' : '#8B5A2B88';
  const graphiteColor = isPencil ? '#E6EDF3' : '#2D2D2D';
  const graphiteMuted = isPencil ? '#8B949E' : '#5A5A5A';
  const graphiteDark = isPencil ? '#30363D' : '#1A1A1A';

  // Hair color
  const hairHex = isPencil ? '#21262D' : hair.color;
  const hairStroke = isPencil ? '#E6EDF3' : '#1C1917';

  // Iris color mapping
  const irisColorMap: Record<string, string> = {
    dark_brown: isPencil ? '#21262D' : '#3E2723',
    light_brown: isPencil ? '#30363D' : '#6D4C41',
    hazel: isPencil ? '#484F58' : '#795548',
    blue: isPencil ? '#58A6FF' : '#1E88E5',
    gray: isPencil ? '#8B949E' : '#78909C',
    green: isPencil ? '#3FB950' : '#43A047',
    amber: isPencil ? '#D29922' : '#FFB300'
  };
  const irisHex = irisColorMap[eyes.color] || (isPencil ? '#30363D' : '#3E2723');

  // Eye morph target paths
  const eyeRadius = 16 * eyes.size;
  const leftEyeTilt = eyes.tilt;
  const rightEyeTilt = -eyes.tilt;

  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 750"
      className={`w-full h-full select-none ${className}`}
      style={{
        backgroundColor: isPencil ? '#090D14' : '#0D1117',
        fontFamily: 'monospace'
      }}
    >
      <defs>
        {/* Graphite paper stipple texture */}
        <pattern id={`paper_${uid}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill={isPencil ? '#0B0F17' : '#0D1117'} />
          <circle cx="1" cy="1" r="0.5" fill={isPencil ? '#161B22' : '#161B22'} opacity="0.6" />
          <circle cx="3" cy="3" r="0.5" fill={isPencil ? '#21262D' : '#1F242C'} opacity="0.4" />
        </pattern>

        {/* Diagonal charcoal cross-hatch pattern */}
        <pattern id={`hatch_${uid}`} width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke={isPencil ? '#30363D' : '#3E2723'} strokeWidth="0.8" opacity="0.5" />
        </pattern>

        {/* Dense beard stubble stipple */}
        <pattern id={`stipple_${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.75" fill={isPencil ? '#8B949E' : '#2D2D2D'} opacity={facial_hair.stubble_density} />
          <circle cx="4.5" cy="4" r="0.6" fill={isPencil ? '#C9D1D9' : '#1A1A1A'} opacity={facial_hair.stubble_density * 0.8} />
        </pattern>

        {/* Anatomical grid pattern */}
        <pattern id={`grid_${uid}`} width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1E6BFF" strokeWidth="0.35" strokeDasharray="2,2" opacity="0.4" />
        </pattern>

        {/* Realistic 3D skin gradient */}
        <radialGradient id={`skinGrad_${uid}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={isPencil ? '#1E2530' : skinToneHex} />
          <stop offset="70%" stopColor={isPencil ? '#161B22' : skinToneHex} stopOpacity="0.95" />
          <stop offset="100%" stopColor={isPencil ? '#0F131A' : '#1A120B'} stopOpacity="0.85" />
        </radialGradient>

        {/* Facial contour cheekbone shading */}
        <radialGradient id={`cheekShadow_${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity={isPencil ? 0.35 : 0.25} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Charcoal pencil noise filter */}
        <filter id={`pencilFilter_${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0.12 0" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>

        {/* Selection glow */}
        <filter id={`selectionGlow_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00E5FF" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* 1. Tactical Background */}
      <rect width="600" height="750" fill={`url(#paper_${uid})`} />

      {/* 2. Construction Grid Overlay (Toggleable) */}
      {showGrid && (
        <g opacity="0.65" pointerEvents="none">
          <rect width="600" height="750" fill={`url(#grid_${uid})`} />
          {/* Vertical Craniofacial Axis */}
          <line x1={cx} y1={40} x2={cx} y2={710} stroke="#00E5FF" strokeWidth="1" strokeDasharray="6,4" />
          {/* Eye Line */}
          <line x1={80} y1={eyeLineY} x2={520} y2={eyeLineY} stroke="#00E5FF" strokeWidth="1" strokeDasharray="6,4" />
          {/* Brow Line */}
          <line x1={100} y1={browLineY} x2={500} y2={browLineY} stroke="#FFB020" strokeWidth="0.8" strokeDasharray="3,3" />
          {/* Nose Baseline */}
          <line x1={120} y1={noseTipY} x2={480} y2={noseTipY} stroke="#FFB020" strokeWidth="0.8" strokeDasharray="3,3" />
          {/* Mouth Commissure Line */}
          <line x1={140} y1={mouthY} x2={460} y2={mouthY} stroke="#FFB020" strokeWidth="0.8" strokeDasharray="3,3" />
          {/* 5-Column Eye Width Guides */}
          <line x1={leftEyeX - eyeRadius} y1={eyeLineY - 40} x2={leftEyeX - eyeRadius} y2={eyeLineY + 40} stroke="#1E6BFF" strokeWidth="0.6" strokeDasharray="2,2" />
          <line x1={leftEyeX + eyeRadius} y1={eyeLineY - 40} x2={leftEyeX + eyeRadius} y2={eyeLineY + 40} stroke="#1E6BFF" strokeWidth="0.6" strokeDasharray="2,2" />
          <line x1={rightEyeX - eyeRadius} y1={eyeLineY - 40} x2={rightEyeX - eyeRadius} y2={eyeLineY + 40} stroke="#1E6BFF" strokeWidth="0.6" strokeDasharray="2,2" />
          <line x1={rightEyeX + eyeRadius} y1={eyeLineY - 40} x2={rightEyeX + eyeRadius} y2={eyeLineY + 40} stroke="#1E6BFF" strokeWidth="0.6" strokeDasharray="2,2" />
          {/* Anatomical Labels */}
          <text x={85} y={eyeLineY - 5} fill="#00E5FF" fontSize="9" fontWeight="bold">ORBITAL AXIS</text>
          <text x={105} y={browLineY - 5} fill="#FFB020" fontSize="8">SUPRAORBITAL</text>
          <text x={125} y={noseTipY - 5} fill="#FFB020" fontSize="8">SUBNASALE</text>
          <text x={145} y={mouthY - 5} fill="#FFB020" fontSize="8">STOMION</text>
        </g>
      )}

      {/* 3. Neck & Collar Layer */}
      <g 
        id="layer-neck" 
        onClick={() => onSelectSection?.('head_jaw')}
        className="cursor-pointer"
        filter={isPencil ? `url(#pencilFilter_${uid})` : undefined}
      >
        <path
          d={computeNeckPath(state)}
          fill={isPencil ? '#12161F' : '#1A1D24'}
          stroke={skinStroke}
          strokeWidth={isPencil ? '2' : '1.5'}
        />
        {/* Clavicle & Sternocleidomastoid Muscle Hatching */}
        <path d={`M ${cx - 45} 510 Q ${cx - 55} 610 ${cx - 110} 690`} fill="none" stroke={graphiteMuted} strokeWidth="1.2" strokeDasharray="2,3" />
        <path d={`M ${cx + 45} 510 Q ${cx + 55} 610 ${cx + 110} 690`} fill="none" stroke={graphiteMuted} strokeWidth="1.2" strokeDasharray="2,3" />
        <path d={`M ${cx - 50} 670 Q ${cx} 690 ${cx + 50} 670`} fill="none" stroke={graphiteMuted} strokeWidth="1.5" />
      </g>

      {/* 4. Ears Layer (Behind Head Contour) */}
      <g 
        id="layer-ears" 
        onClick={() => onSelectSection?.('ears')}
        className="cursor-pointer"
        filter={selectedSection === 'ears' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
      >
        {/* Left Ear */}
        <g transform={`translate(${cx - headW - earW * 0.4}, ${earTopY})`}>
          <path
            d={`M ${earW * 0.8} 0 C -${earW * 0.4} 10, -${earW * 0.4} ${earHeight * 0.75}, ${earW * 0.6} ${earHeight} C ${earW * 0.9} ${earHeight * 0.8}, ${earW * 0.95} 20, ${earW * 0.8} 0 Z`}
            fill={`url(#skinGrad_${uid})`}
            stroke={skinStroke}
            strokeWidth={isPencil ? '2.2' : '1.6'}
          />
          {/* Inner Concha & Antihelix Cartilage */}
          <path
            d={`M ${earW * 0.5} 12 C 0 25, 0 ${earHeight * 0.6}, ${earW * 0.55} ${earHeight * 0.75}`}
            fill="none"
            stroke={graphiteMuted}
            strokeWidth={isPencil ? '1.5' : '1.2'}
          />
          <path d={`M ${earW * 0.3} 30 Q ${earW * 0.5} 45 ${earW * 0.35} 60`} fill="none" stroke={graphiteDark} strokeWidth="1" />
        </g>

        {/* Right Ear */}
        <g transform={`translate(${cx + headW - earW * 0.4}, ${earTopY})`}>
          <path
            d={`M 0 0 C ${earW * 1.2} 10, ${earW * 1.2} ${earHeight * 0.75}, ${earW * 0.2} ${earHeight} C -${earW * 0.1} ${earHeight * 0.8}, -${earW * 0.15} 20, 0 0 Z`}
            fill={`url(#skinGrad_${uid})`}
            stroke={skinStroke}
            strokeWidth={isPencil ? '2.2' : '1.6'}
          />
          {/* Inner Concha & Antihelix Cartilage */}
          <path
            d={`M ${earW * 0.3} 12 C ${earW * 0.8} 25, ${earW * 0.8} ${earHeight * 0.6}, ${earW * 0.25} ${earHeight * 0.75}`}
            fill="none"
            stroke={graphiteMuted}
            strokeWidth={isPencil ? '1.5' : '1.2'}
          />
          <path d={`M ${earW * 0.5} 30 Q ${earW * 0.3} 45 ${earW * 0.45} 60`} fill="none" stroke={graphiteDark} strokeWidth="1" />
        </g>
      </g>

      {/* 5. Head & Skull Outline / Jaw Contour Layer */}
      <g
        id="layer-head-jaw"
        onClick={() => onSelectSection?.('head_jaw')}
        className="cursor-pointer"
        filter={selectedSection === 'head_jaw' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
      >
        <path
          d={computeHeadContour(state)}
          fill={`url(#skinGrad_${uid})`}
          stroke={skinStroke}
          strokeWidth={isPencil ? '2.6' : '1.8'}
        />

        {/* Zygomatic Arch (Cheekbone) Soft Shading */}
        <path
          d={`M ${cx - headW * 0.78} ${cy - 10} Q ${cx - headW * 0.5} ${cy + 50} ${cx - 50} ${cy + 75}`}
          fill="none"
          stroke={graphiteMuted}
          strokeWidth="1.2"
          strokeDasharray={isPencil ? '2,3' : 'none'}
          opacity="0.6"
        />
        <path
          d={`M ${cx + headW * 0.78} ${cy - 10} Q ${cx + headW * 0.5} ${cy + 50} ${cx + 50} ${cy + 75}`}
          fill="none"
          stroke={graphiteMuted}
          strokeWidth="1.2"
          strokeDasharray={isPencil ? '2,3' : 'none'}
          opacity="0.6"
        />

        {/* Mandibular Angle Shading */}
        <path
          d={`M ${cx - headW * 0.85} ${cy + 90} Q ${cx - headW * 0.5} ${cy + 140} ${cx - 30} ${cy + 170}`}
          fill="none"
          stroke={graphiteMuted}
          strokeWidth="1.4"
          strokeDasharray={isPencil ? '1,3' : 'none'}
          opacity="0.5"
        />
        <path
          d={`M ${cx + headW * 0.85} ${cy + 90} Q ${cx + headW * 0.5} ${cy + 140} ${cx + 30} ${cy + 170}`}
          fill="none"
          stroke={graphiteMuted}
          strokeWidth="1.4"
          strokeDasharray={isPencil ? '1,3' : 'none'}
          opacity="0.5"
        />

        {/* Chin Cleft Line if specified */}
        {head_jaw.chin_shape === 'cleft' && (
          <path
            d={`M ${cx} ${cy + 172 * head_jaw.chin_length} L ${cx} ${cy + 192 * head_jaw.chin_length}`}
            stroke={graphiteColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* 6. Wrinkles & Age Features Layer */}
      <g 
        id="layer-skin-age" 
        onClick={() => onSelectSection?.('skin_age')}
        className="cursor-pointer"
        opacity={Math.min(1, 0.2 + (skin_age.age_appearance / 60))}
        filter={selectedSection === 'skin_age' ? `url(#selectionGlow_${uid})` : undefined}
      >
        {/* Forehead Wrinkles */}
        {skin_age.forehead_wrinkles > 0.1 && (
          <g stroke={graphiteMuted} strokeWidth="1.2" strokeLinecap="round" fill="none">
            <path d={`M ${cx - 85} ${browLineY - 45} Q ${cx} ${browLineY - 55} ${cx + 85} ${browLineY - 45}`} opacity={skin_age.forehead_wrinkles} />
            <path d={`M ${cx - 100} ${browLineY - 30} Q ${cx} ${browLineY - 40} ${cx + 100} ${browLineY - 30}`} opacity={skin_age.forehead_wrinkles * 0.9} />
            {skin_age.forehead_wrinkles > 0.5 && (
              <path d={`M ${cx - 70} ${browLineY - 60} Q ${cx} ${browLineY - 68} ${cx + 70} ${browLineY - 60}`} opacity={skin_age.forehead_wrinkles * 0.8} />
            )}
          </g>
        )}

        {/* Glabellar Frown Lines (Between Brows) */}
        {skin_age.age_appearance > 28 && (
          <g stroke={graphiteColor} strokeWidth="1.4" strokeLinecap="round">
            <line x1={cx - 10} y1={browLineY - 8} x2={cx - 10} y2={browLineY + 14} opacity={0.6 * (skin_age.age_appearance / 50)} />
            <line x1={cx + 10} y1={browLineY - 8} x2={cx + 10} y2={browLineY + 14} opacity={0.6 * (skin_age.age_appearance / 50)} />
          </g>
        )}

        {/* Nasolabial Folds (Laugh / Marionette Lines) */}
        {skin_age.nasolabial_folds > 0.15 && (
          <g stroke={graphiteColor} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={skin_age.nasolabial_folds}>
            <path d={`M ${cx - noseWidth * 0.85} ${noseTipY - 5} Q ${cx - mouthHalfW - 8} ${mouthY - 10} ${cx - mouthHalfW - 4} ${mouthY + 22}`} />
            <path d={`M ${cx + noseWidth * 0.85} ${noseTipY - 5} Q ${cx + mouthHalfW + 8} ${mouthY - 10} ${cx + mouthHalfW + 4} ${mouthY + 22}`} />
          </g>
        )}

        {/* Crow's Feet (Lateral Orbital Lines) */}
        {skin_age.crows_feet > 0.2 && (
          <g stroke={graphiteMuted} strokeWidth="1" strokeLinecap="round" opacity={skin_age.crows_feet}>
            <line x1={leftEyeX - eyeRadius - 6} y1={eyeLineY - 4} x2={leftEyeX - eyeRadius - 20} y2={eyeLineY - 12} />
            <line x1={leftEyeX - eyeRadius - 8} y1={eyeLineY} x2={leftEyeX - eyeRadius - 24} y2={eyeLineY} />
            <line x1={leftEyeX - eyeRadius - 6} y1={eyeLineY + 4} x2={leftEyeX - eyeRadius - 18} y2={eyeLineY + 10} />
            <line x1={rightEyeX + eyeRadius + 6} y1={eyeLineY - 4} x2={rightEyeX + eyeRadius + 20} y2={eyeLineY - 12} />
            <line x1={rightEyeX + eyeRadius + 8} y1={eyeLineY} x2={rightEyeX + eyeRadius + 24} y2={eyeLineY} />
            <line x1={rightEyeX + eyeRadius + 6} y1={eyeLineY + 4} x2={rightEyeX + eyeRadius + 18} y2={eyeLineY + 10} />
          </g>
        )}
      </g>

      {/* 7. Eyes Layer */}
      <g
        id="layer-eyes"
        onClick={() => onSelectSection?.('eyes')}
        className="cursor-pointer"
        filter={selectedSection === 'eyes' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
      >
        {/* Under-Eye Bags / Dark Circles */}
        {eyes.under_eye_bags > 0.1 && (
          <g stroke={graphiteMuted} strokeWidth="1" fill="none" opacity={eyes.under_eye_bags}>
            <path d={`M ${leftEyeX - eyeRadius} ${eyeLineY + 12} Q ${leftEyeX} ${eyeLineY + 24} ${leftEyeX + eyeRadius} ${eyeLineY + 14}`} />
            <path d={`M ${rightEyeX - eyeRadius} ${eyeLineY + 14} Q ${rightEyeX} ${eyeLineY + 24} ${rightEyeX + eyeRadius} ${eyeLineY + 12}`} />
          </g>
        )}

        {/* Left Eye */}
        <g transform={`rotate(${leftEyeTilt}, ${leftEyeX}, ${eyeLineY})`}>
          {/* Sclera (Eyeball base) */}
          <path
            d={`M ${leftEyeX - eyeRadius * 1.3} ${eyeLineY} C ${leftEyeX - eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.9}, ${leftEyeX + eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.9}, ${leftEyeX + eyeRadius * 1.3} ${eyeLineY} C ${leftEyeX + eyeRadius * 0.6} ${eyeLineY + eyeRadius * 0.9}, ${leftEyeX - eyeRadius * 0.6} ${eyeLineY + eyeRadius * 0.9}, ${leftEyeX - eyeRadius * 1.3} ${eyeLineY} Z`}
            fill={isPencil ? '#0F141C' : '#E8ECEF'}
            stroke={graphiteColor}
            strokeWidth={isPencil ? '2.4' : '1.8'}
          />
          {/* Iris */}
          <circle
            cx={leftEyeX}
            cy={eyeLineY}
            r={eyeRadius * 0.58}
            fill={irisHex}
            stroke={graphiteColor}
            strokeWidth="1.2"
          />
          {/* Pupil */}
          <circle
            cx={leftEyeX}
            cy={eyeLineY}
            r={eyeRadius * 0.28}
            fill={isPencil ? '#07090D' : '#000000'}
          />
          {/* Corneal Specular Light Highlight */}
          <circle
            cx={leftEyeX - eyeRadius * 0.18}
            cy={eyeLineY - eyeRadius * 0.18}
            r={eyeRadius * 0.1}
            fill="#FFFFFF"
            opacity="0.9"
          />
          {/* Upper Eyelid / Lash Line (Heavy forensic definition) */}
          <path
            d={`M ${leftEyeX - eyeRadius * 1.35} ${eyeLineY} C ${leftEyeX - eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.98}, ${leftEyeX + eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.98}, ${leftEyeX + eyeRadius * 1.35} ${eyeLineY}`}
            fill="none"
            stroke={graphiteColor}
            strokeWidth={isPencil ? '3.2' : '2.4'}
            strokeLinecap="round"
          />
          {/* Eyelid Superior Crease (Morph: hooded vs double vs monolid) */}
          {eyes.eyelids !== 'monolid' && (
            <path
              d={`M ${leftEyeX - eyeRadius * 1.25} ${eyeLineY - eyeRadius * 0.5} Q ${leftEyeX} ${eyeLineY - eyeRadius * (eyes.eyelids === 'hooded' ? 1.05 : 1.3)} ${leftEyeX + eyeRadius * 1.2} ${eyeLineY - eyeRadius * 0.4}`}
              fill="none"
              stroke={graphiteMuted}
              strokeWidth="1.4"
            />
          )}
        </g>

        {/* Right Eye */}
        <g transform={`rotate(${rightEyeTilt}, ${rightEyeX}, ${eyeLineY})`}>
          {/* Sclera */}
          <path
            d={`M ${rightEyeX - eyeRadius * 1.3} ${eyeLineY} C ${rightEyeX - eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.9}, ${rightEyeX + eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.9}, ${rightEyeX + eyeRadius * 1.3} ${eyeLineY} C ${rightEyeX + eyeRadius * 0.6} ${eyeLineY + eyeRadius * 0.9}, ${rightEyeX - eyeRadius * 0.6} ${eyeLineY + eyeRadius * 0.9}, ${rightEyeX - eyeRadius * 1.3} ${eyeLineY} Z`}
            fill={isPencil ? '#0F141C' : '#E8ECEF'}
            stroke={graphiteColor}
            strokeWidth={isPencil ? '2.4' : '1.8'}
          />
          {/* Iris */}
          <circle
            cx={rightEyeX}
            cy={eyeLineY}
            r={eyeRadius * 0.58}
            fill={irisHex}
            stroke={graphiteColor}
            strokeWidth="1.2"
          />
          {/* Pupil */}
          <circle
            cx={rightEyeX}
            cy={eyeLineY}
            r={eyeRadius * 0.28}
            fill={isPencil ? '#07090D' : '#000000'}
          />
          {/* Corneal Specular Light Highlight */}
          <circle
            cx={rightEyeX - eyeRadius * 0.18}
            cy={eyeLineY - eyeRadius * 0.18}
            r={eyeRadius * 0.1}
            fill="#FFFFFF"
            opacity="0.9"
          />
          {/* Upper Eyelid / Lash Line */}
          <path
            d={`M ${rightEyeX - eyeRadius * 1.35} ${eyeLineY} C ${rightEyeX - eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.98}, ${rightEyeX + eyeRadius * 0.6} ${eyeLineY - eyeRadius * 0.98}, ${rightEyeX + eyeRadius * 1.35} ${eyeLineY}`}
            fill="none"
            stroke={graphiteColor}
            strokeWidth={isPencil ? '3.2' : '2.4'}
            strokeLinecap="round"
          />
          {/* Eyelid Superior Crease */}
          {eyes.eyelids !== 'monolid' && (
            <path
              d={`M ${rightEyeX - eyeRadius * 1.2} ${eyeLineY - eyeRadius * 0.4} Q ${rightEyeX} ${eyeLineY - eyeRadius * (eyes.eyelids === 'hooded' ? 1.05 : 1.3)} ${rightEyeX + eyeRadius * 1.25} ${eyeLineY - eyeRadius * 0.5}`}
              fill="none"
              stroke={graphiteMuted}
              strokeWidth="1.4"
            />
          )}
        </g>
      </g>

      {/* 8. Eyebrows Layer */}
      <g
        id="layer-eyebrows"
        onClick={() => onSelectSection?.('eyebrows')}
        className="cursor-pointer"
        filter={selectedSection === 'eyebrows' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
      >
        {/* Left Eyebrow */}
        <g transform={`rotate(${eyebrows.tilt}, ${leftEyeX}, ${browLineY})`}>
          <path
            d={`M ${leftEyeX - eyeRadius * 1.2} ${browLineY} Q ${leftEyeX} ${browLineY - (12 * (eyebrows.shape.includes('arch') ? 1.4 : 0.8))} ${leftEyeX + eyeRadius * 1.1} ${browLineY + (eyebrows.shape === 'tapered' ? 4 : 0)}`}
            fill="none"
            stroke={hairStroke}
            strokeWidth={4.5 * eyebrows.thickness}
            strokeLinecap="round"
          />
          {/* Individual graphite strand highlights */}
          <path
            d={`M ${leftEyeX - eyeRadius * 1.1} ${browLineY - 1} Q ${leftEyeX} ${browLineY - (11 * (eyebrows.shape.includes('arch') ? 1.4 : 0.8))} ${leftEyeX + eyeRadius * 0.9} ${browLineY}`}
            fill="none"
            stroke={graphiteMuted}
            strokeWidth={1.5 * eyebrows.thickness}
          />
        </g>

        {/* Right Eyebrow */}
        <g transform={`rotate(${-eyebrows.tilt}, ${rightEyeX}, ${browLineY})`}>
          <path
            d={`M ${rightEyeX + eyeRadius * 1.2} ${browLineY} Q ${rightEyeX} ${browLineY - (12 * (eyebrows.shape.includes('arch') ? 1.4 : 0.8))} ${rightEyeX - eyeRadius * 1.1} ${browLineY + (eyebrows.shape === 'tapered' ? 4 : 0)}`}
            fill="none"
            stroke={hairStroke}
            strokeWidth={4.5 * eyebrows.thickness}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightEyeX + eyeRadius * 1.1} ${browLineY - 1} Q ${rightEyeX} ${browLineY - (11 * (eyebrows.shape.includes('arch') ? 1.4 : 0.8))} ${rightEyeX - eyeRadius * 0.9} ${browLineY}`}
            fill="none"
            stroke={graphiteMuted}
            strokeWidth={1.5 * eyebrows.thickness}
          />
        </g>
      </g>

      {/* 9. Nose Layer */}
      <g
        id="layer-nose"
        onClick={() => onSelectSection?.('nose')}
        className="cursor-pointer"
        filter={selectedSection === 'nose' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
      >
        {/* Nasal Dorsum Bridge Line */}
        <path
          d={`M ${cx - 5} ${noseBridgeY} L ${cx - 6} ${noseTipY - 24} Q ${cx - 7} ${noseTipY - 12} ${cx} ${noseTipY}`}
          fill="none"
          stroke={graphiteColor}
          strokeWidth={isPencil ? '2.4' : '1.8'}
          strokeLinecap="round"
        />

        {/* Dorsal Lateral Shading Line */}
        <path
          d={`M ${cx + 7} ${noseBridgeY + 15} L ${cx + 8} ${noseTipY - 15}`}
          fill="none"
          stroke={graphiteMuted}
          strokeWidth="1.2"
          strokeDasharray="2,3"
        />

        {/* Nasal Ball / Tip Morph Target */}
        <path
          d={`M ${cx - 14} ${noseTipY - 4} Q ${cx} ${noseTipY + (nose.tip === 'upturned' ? -4 : (nose.tip === 'downturned' ? 8 : 4))} ${cx + 14} ${noseTipY - 4}`}
          fill="none"
          stroke={graphiteColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Left Alar Wing / Nostril */}
        <path
          d={`M ${cx - noseWidth} ${noseTipY - 3} C ${cx - noseWidth - 4} ${noseTipY + 4}, ${cx - 14} ${noseTipY + 8}, ${cx - 10} ${noseTipY + 4}`}
          fill="none"
          stroke={graphiteColor}
          strokeWidth="2.2"
        />
        <ellipse
          cx={cx - 12}
          cy={noseTipY + 3}
          rx={4 * nose.nostril_width}
          ry="2"
          fill={graphiteDark}
        />

        {/* Right Alar Wing / Nostril */}
        <path
          d={`M ${cx + noseWidth} ${noseTipY - 3} C ${cx + noseWidth + 4} ${noseTipY + 4}, ${cx + 14} ${noseTipY + 8}, ${cx + 10} ${noseTipY + 4}`}
          fill="none"
          stroke={graphiteColor}
          strokeWidth="2.2"
        />
        <ellipse
          cx={cx + 12}
          cy={noseTipY + 3}
          rx={4 * nose.nostril_width}
          ry="2"
          fill={graphiteDark}
        />

        {/* Subnasal Cast Shadow */}
        <path
          d={`M ${cx - 12} ${noseTipY + 6} Q ${cx} ${noseTipY + 12} ${cx + 12} ${noseTipY + 6}`}
          fill="none"
          stroke={graphiteMuted}
          strokeWidth="1.5"
        />
      </g>

      {/* 10. Lips & Mouth Layer */}
      <g
        id="layer-mouth"
        onClick={() => onSelectSection?.('mouth')}
        className="cursor-pointer"
        filter={selectedSection === 'mouth' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
      >
        {/* Philtrum Ridge Columns */}
        {mouth.philtrum_depth > 0.1 && (
          <g stroke={graphiteMuted} strokeWidth="1" opacity={mouth.philtrum_depth}>
            <line x1={cx - 5 * mouth.philtrum_width} y1={noseTipY + 10} x2={cx - 6 * mouth.philtrum_width} y2={mouthY - 14 * mouth.upper_lip_thickness} />
            <line x1={cx + 5 * mouth.philtrum_width} y1={noseTipY + 10} x2={cx + 6 * mouth.philtrum_width} y2={mouthY - 14 * mouth.upper_lip_thickness} />
          </g>
        )}

        {/* Upper Lip Vermilion (with Cupid's Bow) */}
        <path
          d={`M ${cx - mouthHalfW} ${mouthY} Q ${cx - mouthHalfW * 0.5} ${mouthY - 12 * mouth.upper_lip_thickness} ${cx - 7} ${mouthY - 10 * mouth.upper_lip_thickness} Q ${cx} ${mouthY - 6 * mouth.upper_lip_thickness} ${cx + 7} ${mouthY - 10 * mouth.upper_lip_thickness} Q ${cx + mouthHalfW * 0.5} ${mouthY - 12 * mouth.upper_lip_thickness} ${cx + mouthHalfW} ${mouthY} Z`}
          fill={isPencil ? '#161B22' : '#8A4A4A'}
          fillOpacity={isPencil ? '0.7' : '0.55'}
          stroke={graphiteColor}
          strokeWidth={isPencil ? '2.2' : '1.6'}
        />

        {/* Central Mouth Separation Fissure Line (Stomion) */}
        <path
          d={`M ${cx - mouthHalfW} ${mouthY} Q ${cx - mouthHalfW * 0.4} ${mouthY + 2} ${cx} ${mouthY + 1} Q ${cx + mouthHalfW * 0.4} ${mouthY + 2} ${cx + mouthHalfW} ${mouthY}`}
          fill="none"
          stroke={graphiteColor}
          strokeWidth={isPencil ? '2.8' : '2.2'}
          strokeLinecap="round"
        />

        {/* Lower Lip Vermilion Contour */}
        <path
          d={`M ${cx - mouthHalfW * 0.85} ${mouthY + 1} Q ${cx} ${mouthY + 18 * mouth.lower_lip_thickness} ${cx + mouthHalfW * 0.85} ${mouthY + 1}`}
          fill={isPencil ? '#161B22' : '#8A4A4A'}
          fillOpacity={isPencil ? '0.5' : '0.45'}
          stroke={graphiteColor}
          strokeWidth={isPencil ? '2.2' : '1.6'}
        />

        {/* Mental Crease (Under-Lip Depression Shadow) */}
        <path
          d={`M ${cx - 24} ${mouthY + 26 * mouth.lower_lip_thickness} Q ${cx} ${mouthY + 30 * mouth.lower_lip_thickness} ${cx + 24} ${mouthY + 26 * mouth.lower_lip_thickness}`}
          fill="none"
          stroke={graphiteMuted}
          strokeWidth="1.5"
        />
      </g>

      {/* 11. Facial Hair (Beard & Stubble) Layer */}
      {facial_hair.beard !== 'none' && !safeState.hidden_features?.facial_hair && (
        <g 
          id="layer-facial-hair" 
          onClick={() => onSelectSection?.('facial_hair')}
          className="cursor-pointer"
          filter={selectedSection === 'facial_hair' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
        >
          {/* Stubble Stipple Field */}
          {facial_hair.stubble_density > 0 && (
            <path
              d={`M ${cx - headW * 0.8} ${cy + 60} Q ${cx - headW * 0.6} ${cy + 180} ${cx} ${cy + 200 * head_jaw.chin_length} Q ${cx + headW * 0.6} ${cy + 180} ${cx + headW * 0.8} ${cy + 60} Z`}
              fill={`url(#stipple_${uid})`}
              opacity="0.85"
            />
          )}

          {/* Heavy Beard / Boxed Beard Geometry */}
          {(facial_hair.beard === 'full_heavy' || facial_hair.beard === 'short_boxed') && (
            <path
              d={`M ${cx - headW * 0.88} ${cy + 40} Q ${cx - headW * 0.5} ${cy + 200} ${cx} ${cy + 215 * head_jaw.chin_length} Q ${cx + headW * 0.5} ${cy + 200} ${cx + headW * 0.88} ${cy + 40} C ${cx + headW * 0.7} ${cy + 140}, ${cx + mouthHalfW + 15} ${mouthY - 10}, ${cx + mouthHalfW} ${mouthY + 15} Q ${cx} ${mouthY + 35} ${cx - mouthHalfW} ${mouthY + 15} C ${cx - mouthHalfW - 15} ${mouthY - 10}, ${cx - headW * 0.7} ${cy + 140}, ${cx - headW * 0.88} ${cy + 40} Z`}
              fill={isPencil ? '#161B22' : hairHex}
              fillOpacity={facial_hair.beard === 'full_heavy' ? 0.95 : 0.8}
              stroke={hairStroke}
              strokeWidth="2.2"
            />
          )}

          {/* Goatee Shape */}
          {facial_hair.beard === 'goatee' && (
            <path
              d={`M ${cx - mouthHalfW - 10} ${mouthY - 10} Q ${cx} ${mouthY - 18} ${cx + mouthHalfW + 10} ${mouthY - 10} Q ${cx + 38} ${cy + 195} ${cx} ${cy + 205} Q ${cx - 38} ${cy + 195} ${cx - mouthHalfW - 10} ${mouthY - 10} Z`}
              fill={isPencil ? '#1A1F29' : hairHex}
              stroke={hairStroke}
              strokeWidth="1.8"
            />
          )}

          {/* Moustache */}
          {facial_hair.moustache === 'chevron' && (
            <path
              d={`M ${cx - mouthHalfW - 4} ${mouthY - 2} Q ${cx} ${noseTipY + 4} ${cx + mouthHalfW + 4} ${mouthY - 2} Q ${cx} ${mouthY - 8} ${cx - mouthHalfW - 4} ${mouthY - 2} Z`}
              fill={isPencil ? '#161B22' : hairHex}
              stroke={hairStroke}
              strokeWidth="1.8"
            />
          )}
        </g>
      )}

      {/* 12. Marks & Scars Interactive Layer */}
      <g 
        id="layer-marks-scars" 
        onClick={() => onSelectSection?.('marks_scars')}
        className="cursor-pointer"
        filter={selectedSection === 'marks_scars' ? `url(#selectionGlow_${uid})` : undefined}
      >
        {marks_scars.map((m) => {
          // Normalize coordinates (0-100% mapped onto 600x750)
          const mx = (m.x / 100) * 600;
          const my = (m.y / 100) * 750;

          if (m.type === 'linear_scar') {
            return (
              <g key={m.id} transform={`translate(${mx}, ${my}) rotate(${m.rotation}) scale(${m.size})`} opacity={m.opacity}>
                {/* Scar furrow */}
                <line x1="-22" y1="0" x2="22" y2="0" stroke="#FF7B72" strokeWidth="2.4" strokeLinecap="round" />
                {/* Healing fibrous white core */}
                <line x1="-20" y1="0" x2="20" y2="0" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
              </g>
            );
          }

          if (m.type === 'surgical_scar' || m.type === 'stitch_mark') {
            return (
              <g key={m.id} transform={`translate(${mx}, ${my}) rotate(${m.rotation}) scale(${m.size})`} opacity={m.opacity}>
                <line x1="-24" y1="0" x2="24" y2="0" stroke="#FF7B72" strokeWidth="2.2" strokeLinecap="round" />
                {/* Suture stitch cross-bars */}
                <line x1="-16" y1="-5" x2="-16" y2="5" stroke="#FFA198" strokeWidth="1.2" />
                <line x1="-8" y1="-5" x2="-8" y2="5" stroke="#FFA198" strokeWidth="1.2" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#FFA198" strokeWidth="1.2" />
                <line x1="8" y1="-5" x2="8" y2="5" stroke="#FFA198" strokeWidth="1.2" />
                <line x1="16" y1="-5" x2="16" y2="5" stroke="#FFA198" strokeWidth="1.2" />
              </g>
            );
          }

          if (m.type === 'mole') {
            return (
              <g key={m.id} transform={`translate(${mx}, ${my}) scale(${m.size})`} opacity={m.opacity}>
                <circle cx="0" cy="0" r="4.5" fill="#2E1B0F" stroke="#1A0F08" strokeWidth="0.8" />
                <circle cx="-1" cy="-1" r="1.2" fill="#4A2E1D" opacity="0.6" />
              </g>
            );
          }

          if (m.type === 'birthmark') {
            return (
              <g key={m.id} transform={`translate(${mx}, ${my}) rotate(${m.rotation}) scale(${m.size})`} opacity={m.opacity}>
                <path d="M -15 -8 Q 0 -18 15 -10 Q 20 5 10 16 Q -5 14 -18 4 Z" fill="#7D2D3B" opacity="0.55" />
              </g>
            );
          }

          return null;
        })}
      </g>

      {/* 13. Hair Layer */}
      {hair.style !== 'shaved_bald' && !safeState.hidden_features?.hair && (
        <g 
          id="layer-hair" 
          onClick={() => onSelectSection?.('hair')}
          className="cursor-pointer"
          filter={selectedSection === 'hair' ? `url(#selectionGlow_${uid})` : (isPencil ? `url(#pencilFilter_${uid})` : undefined)}
        >
          {hair.style === 'short_buzz' && (
            <g>
              <path
                d={`M ${cx - headW} ${browLineY - 15} C ${cx - headW * 1.05} 150, ${cx - 50} 120, ${cx} 120 C ${cx + 50} 120, ${cx + headW * 1.05} 150, ${cx + headW} ${browLineY - 15} C ${cx + headW * 0.8} 180, ${cx + 60} 190, ${cx} 190 C ${cx - 60} 190, ${cx - headW * 0.8} 180, ${cx - headW} ${browLineY - 15} Z`}
                fill={hairHex}
                stroke={hairStroke}
                strokeWidth="2.4"
              />
              {/* Hairline texture */}
              <path
                d={`M ${cx - headW * 0.85} ${browLineY - 20} Q ${cx} 180 ${cx + headW * 0.85} ${browLineY - 20}`}
                fill="none"
                stroke={graphiteMuted}
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
            </g>
          )}

          {hair.style === 'fade_undercut' && (
            <g>
              {/* Tapered sides */}
              <path
                d={`M ${cx - headW * 0.95} 250 L ${cx - headW * 0.92} 180 L ${cx - headW * 0.6} 160 L ${cx - headW * 0.85} 250 Z`}
                fill={hairHex}
                opacity="0.6"
              />
              <path
                d={`M ${cx + headW * 0.95} 250 L ${cx + headW * 0.92} 180 L ${cx + headW * 0.6} 160 L ${cx + headW * 0.85} 250 Z`}
                fill={hairHex}
                opacity="0.6"
              />
              {/* Volumetric Pompadour Top */}
              <path
                d={`M ${cx - headW * 0.85} 190 C ${cx - headW * 0.8} 100, ${cx - 40} 85, ${cx} 85 C ${cx + 40} 85, ${cx + headW * 0.8} 100, ${cx + headW * 0.85} 190 C ${cx + 60} 165, ${cx - 60} 165, ${cx - headW * 0.85} 190 Z`}
                fill={hairHex}
                stroke={hairStroke}
                strokeWidth="2.5"
              />
            </g>
          )}

          {hair.style === 'wavy_parted' && (
            <g>
              <path
                d={`M ${cx - headW * 1.05} 260 C ${cx - headW * 1.1} 140, ${cx - 20} 95, ${cx} 100 C ${cx + 60} 105, ${cx + headW * 1.05} 145, ${cx + headW * 1.05} 260 C ${cx + headW * 0.75} 180, ${cx + 40} 170, ${cx} 175 C ${cx - 40} 180, ${cx - headW * 0.8} 190, ${cx - headW * 1.05} 260 Z`}
                fill={hairHex}
                stroke={hairStroke}
                strokeWidth="2.4"
              />
              {/* Parting stroke line */}
              <path d={`M ${cx - 35} 165 Q ${cx - 20} 125 ${cx - 15} 98`} fill="none" stroke={hairStroke} strokeWidth="2.8" />
            </g>
          )}

          {/* Default / Fallback hair silhouette for other styles */}
          {hair.style !== 'short_buzz' && hair.style !== 'fade_undercut' && hair.style !== 'wavy_parted' && (
            <path
              d={`M ${cx - headW * 1.02} 240 C ${cx - headW * 1.08} 130, ${cx - 50} 110, ${cx} 110 C ${cx + 50} 110, ${cx + headW * 1.08} 130, ${cx + headW * 1.02} 240 C ${cx + headW * 0.8} 180, ${cx + 50} 175, ${cx} 175 C ${cx - 50} 175, ${cx - headW * 0.8} 180, ${cx - headW * 1.02} 240 Z`}
              fill={hairHex}
              stroke={hairStroke}
              strokeWidth="2.4"
            />
          )}
        </g>
      )}

      {/* 14. Glasses Layer */}
      {glasses.style !== 'none' && !safeState.hidden_features?.glasses && (
        <g 
          id="layer-glasses" 
          onClick={() => onSelectSection?.('glasses_headwear')}
          className="cursor-pointer"
          filter={selectedSection === 'glasses_headwear' ? `url(#selectionGlow_${uid})` : undefined}
        >
          {glasses.style === 'wireframe_aviator' && (
            <g stroke="#58A6FF" strokeWidth={2.2 * glasses.frame_thickness} fill="rgba(88, 166, 255, 0.08)">
              {/* Teardrop Left Lens */}
              <path d={`M ${leftEyeX - eyeRadius * 1.4} ${eyeLineY - 14} L ${leftEyeX + eyeRadius * 1.3} ${eyeLineY - 14} C ${leftEyeX + eyeRadius * 1.35} ${eyeLineY + 22}, ${leftEyeX - eyeRadius * 1.2} ${eyeLineY + 30}, ${leftEyeX - eyeRadius * 1.4} ${eyeLineY - 14} Z`} />
              {/* Teardrop Right Lens */}
              <path d={`M ${rightEyeX - eyeRadius * 1.3} ${eyeLineY - 14} L ${rightEyeX + eyeRadius * 1.4} ${eyeLineY - 14} C ${rightEyeX + eyeRadius * 1.2} ${eyeLineY + 30}, ${rightEyeX - eyeRadius * 1.35} ${eyeLineY + 22}, ${rightEyeX - eyeRadius * 1.3} ${eyeLineY - 14} Z`} />
              {/* Double Top Bridge */}
              <line x1={leftEyeX + eyeRadius * 1.3} y1={eyeLineY - 14} x2={rightEyeX - eyeRadius * 1.3} y2={eyeLineY - 14} strokeWidth="2.5" />
              <line x1={leftEyeX + eyeRadius * 1.2} y1={eyeLineY - 6} x2={rightEyeX - eyeRadius * 1.2} y2={eyeLineY - 6} strokeWidth="1.8" />
              {/* Temple pieces to ears */}
              <line x1={leftEyeX - eyeRadius * 1.4} y1={eyeLineY - 14} x2={cx - headW} y2={eyeLineY - 12} />
              <line x1={rightEyeX + eyeRadius * 1.4} y1={eyeLineY - 14} x2={cx + headW} y2={eyeLineY - 12} />
            </g>
          )}

          {glasses.style === 'black_rectangular' && (
            <g stroke="#161B22" strokeWidth={3.8 * glasses.frame_thickness} fill="rgba(0, 0, 0, 0.15)">
              <rect x={leftEyeX - eyeRadius * 1.5} y={eyeLineY - 20} width={eyeRadius * 2.8} height={eyeRadius * 1.9} rx="6" />
              <rect x={rightEyeX - eyeRadius * 1.3} y={eyeLineY - 20} width={eyeRadius * 2.8} height={eyeRadius * 1.9} rx="6" />
              <line x1={leftEyeX + eyeRadius * 1.3} y1={eyeLineY - 10} x2={rightEyeX - eyeRadius * 1.3} y2={eyeLineY - 10} strokeWidth="4" />
              <line x1={leftEyeX - eyeRadius * 1.5} y1={eyeLineY - 10} x2={cx - headW} y2={eyeLineY - 10} strokeWidth="3" />
              <line x1={rightEyeX + eyeRadius * 1.5} y1={eyeLineY - 10} x2={cx + headW} y2={eyeLineY - 10} strokeWidth="3" />
            </g>
          )}
        </g>
      )}

      {/* 15. Headwear Layer */}
      {headwear.style !== 'none' && !safeState.hidden_features?.headwear && (
        <g 
          id="layer-headwear" 
          onClick={() => onSelectSection?.('glasses_headwear')}
          className="cursor-pointer"
          filter={selectedSection === 'glasses_headwear' ? `url(#selectionGlow_${uid})` : undefined}
        >
          {headwear.style === 'baseball_cap_forward' && (
            <g>
              {/* Cap Crown */}
              <path
                d={`M ${cx - headW * 1.05} ${browLineY - 10} C ${cx - headW * 1.15} 90, ${cx - 50} 70, ${cx} 70 C ${cx + 50} 70, ${cx + headW * 1.15} 90, ${cx + headW * 1.05} ${browLineY - 10} Z`}
                fill={headwear.color}
                stroke="#000000"
                strokeWidth="2"
              />
              {/* Cap Visor / Curved Bill */}
              <path
                d={`M ${cx - headW * 1.15} ${browLineY - 12} Q ${cx} ${browLineY + 16} ${cx + headW * 1.15} ${browLineY - 12} Q ${cx} ${browLineY - 4} ${cx - headW * 1.15} ${browLineY - 12} Z`}
                fill="#0F131A"
                stroke="#000000"
                strokeWidth="2.2"
              />
            </g>
          )}

          {headwear.style === 'tactical_beanie' && (
            <g>
              <path
                d={`M ${cx - headW * 1.05} ${browLineY - 5} C ${cx - headW * 1.1} 80, ${cx - 40} 60, ${cx} 60 C ${cx + 40} 60, ${cx + headW * 1.1} 80, ${cx + headW * 1.05} ${browLineY - 5} Z`}
                fill={headwear.color}
                stroke="#000000"
                strokeWidth="2.2"
              />
              {/* Beanie ribbed cuff */}
              <rect x={cx - headW * 1.06} y={browLineY - 18} width={headW * 2.12} height="20" rx="4" fill="#18181B" stroke="#000000" strokeWidth="1.8" />
            </g>
          )}
        </g>
      )}

      {/* Official Forensic Watermark Stamp (Always Present) */}
      <g opacity="0.45" pointerEvents="none">
        <text x="30" y="730" fill="#8B949E" fontSize="9" fontWeight="bold" letterSpacing="1">
          EYEWITNESS CRANIOFACIAL VECTOR v{state.version} // SEED #{state.seed}
        </text>
        <text x="570" y="730" textAnchor="end" fill="#8B949E" fontSize="9" fontWeight="bold">
          {isPencil ? 'GRAPHITE RECONSTRUCTION' : 'PIGMENT REFERENCE'}
        </text>
      </g>
    </svg>
  );
});
