'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Group, Image as KonvaImage, Shape, Line, Circle, Rect, Text } from 'react-konva';
import { FaceState, FeatureSectionId } from '../types';

interface RealisticKonvaFaceProps {
  state: FaceState;
  mode: 'pencil' | 'realistic';
  showGrid?: boolean;
  selectedSection?: FeatureSectionId | null;
  onSelectSection?: (section: FeatureSectionId) => void;
  width?: number;
  height?: number;
}

// Hook to load canvas image asynchronously
function useCanvasImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  return image;
}

export function RealisticKonvaFace({
  state,
  mode,
  showGrid = false,
  selectedSection = null,
  onSelectSection,
  width = 500,
  height = 625,
}: RealisticKonvaFaceProps) {
  const isPencil = mode === 'pencil';

  // Master sketch image resolution: 427 x 477
  const baseImgW = 427;
  const baseImgH = 477;
  const scale = width / baseImgW;
  const renderedH = baseImgH * scale;
  const offsetY = (height - renderedH) / 2;

  // Coordinate mapping from master sketch space (427x477) to canvas space
  const toX = (x: number) => x * scale;
  const toY = (y: number) => offsetY + y * scale;

  // Load authentic sketch image
  const imageSrc = isPencil ? '/images/forensic_sketch_pencil.png' : '/images/forensic_sketch_realistic.png';
  const sketchImg = useCanvasImage(imageSrc);

  // Key anatomical landmarks in sketch space
  const landmarks = useMemo(() => ({
    leftEye: { x: 180, y: 190 },
    rightEye: { x: 268, y: 190 },
    leftBrow: { x: 185, y: 170 },
    rightBrow: { x: 265, y: 170 },
    noseTip: { x: 213, y: 245 },
    noseBridge: { x: 213, y: 210 },
    mouthCenter: { x: 226, y: 273 },
    chinCenter: { x: 224, y: 345 },
    leftJaw: { x: 152, y: 298 },
    rightJaw: { x: 294, y: 298 },
    leftEar: { x: 122, y: 210 },
    rightEar: { x: 330, y: 210 },
    hairline: { x: 213, y: 125 },
    hairTop: { x: 213, y: 35 },
  }), []);

  // Section click handler
  const handleSectionClick = (sectionId: FeatureSectionId) => (e: any) => {
    e.cancelBubble = true;
    if (onSelectSection) {
      onSelectSection(sectionId);
    }
  };

  // Precomputed stubble pattern
  const stubblePoints = useMemo(() => {
    const pts: { x: number; y: number; len: number; angle: number }[] = [];
    const count = 180;
    for (let i = 0; i < count; i++) {
      // Seeded pseudorandom
      const s1 = Math.sin(i * 12.9898 + 78.233);
      const s2 = Math.cos(i * 43.123 + 19.456);
      const s3 = Math.sin(i * 91.432);
      
      const rx = (s1 * 0.5 + 0.5);
      const ry = (s2 * 0.5 + 0.5);
      
      // Around chin & jaw
      const x = 180 + rx * 90;
      const y = 305 + ry * 50;
      pts.push({
        x,
        y,
        len: 2 + Math.abs(s3) * 2.5,
        angle: (s1 * 30 + 75) * (Math.PI / 180),
      });
    }
    return pts;
  }, []);

  return (
    <Group>
      {/* 1. Base Paper Canvas Background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={isPencil ? '#FFFFFF' : '#F6F3EE'}
      />

      {/* 2. Authentic Hand-Drawn Forensic Portrait Image */}
      {sketchImg ? (
        <KonvaImage
          image={sketchImg}
          x={0}
          y={offsetY}
          width={width}
          height={renderedH}
          listening={false}
        />
      ) : (
        /* Loading skeleton if loading */
        <Group>
          <Rect
            x={20}
            y={20}
            width={width - 40}
            height={height - 40}
            fill="#F8FAFC"
            stroke="#E2E8F0"
            strokeWidth={1}
            cornerRadius={8}
          />
          <Text
            x={width / 2 - 120}
            y={height / 2 - 10}
            text="SYNTHESIZING FORENSIC LEAD..."
            fontSize={12}
            fontFamily="monospace"
            fill="#64748B"
          />
        </Group>
      )}

      {/* 3. Dynamic Facial Hair / Stubble Overlay */}
      {state.facial_hair && (state.facial_hair.stubble_density > 0 || state.facial_hair.beard !== 'none') && !state.hidden_features?.facial_hair && (
        <Shape
          sceneFunc={(context, shape) => {
            const density = Math.min(1, Math.max(0.15, state.facial_hair.stubble_density || 0.6));
            context.strokeStyle = isPencil ? 'rgba(25, 25, 30, 0.75)' : 'rgba(45, 30, 20, 0.85)';
            context.lineWidth = 1.2 * scale;

            // Draw stubble ticks
            const visibleCount = Math.floor(stubblePoints.length * density);
            for (let i = 0; i < visibleCount; i++) {
              const pt = stubblePoints[i];
              const sx = toX(pt.x);
              const sy = toY(pt.y);
              const ex = sx + Math.cos(pt.angle) * pt.len * scale;
              const ey = sy + Math.sin(pt.angle) * pt.len * scale;

              context.beginPath();
              context.moveTo(sx, sy);
              context.lineTo(ex, ey);
              context.stroke();
            }

            // If beard / heavy goatee, add chin wash
            if (state.facial_hair.beard !== 'none') {
              context.beginPath();
              context.moveTo(toX(175), toY(305));
              context.quadraticCurveTo(toX(226), toY(360), toX(277), toY(305));
              context.quadraticCurveTo(toX(226), toY(375), toX(175), toY(305));
              context.fillStyle = isPencil ? 'rgba(15, 20, 25, 0.35)' : 'rgba(50, 32, 22, 0.45)';
              context.fill();
            }

            context.fillStrokeShape(shape);
          }}
        />
      )}

      {/* 4. Dynamic Glasses / Eyewear Overlay */}
      {state.glasses && state.glasses.style !== 'none' && !state.hidden_features?.glasses && (
        <Shape
          sceneFunc={(context, shape) => {
            const style = state.glasses.style;
            const isAviator = style === 'wireframe_aviator';
            const isAcetate = style === 'black_rectangular' || style === 'round_horn_rim' || style === 'tactical_wraparound';
            
            const frameStroke = isPencil 
              ? (isAcetate ? '#0F1216' : '#2D3748')
              : (isAcetate ? '#1A1817' : '#B45309');
            const strokeWidth = (isAcetate ? 4.5 : 2.2) * scale;

            context.strokeStyle = frameStroke;
            context.lineWidth = strokeWidth;
            context.fillStyle = 'rgba(255, 255, 255, 0.12)';

            // Left lens center & dimensions
            const lx = toX(180);
            const ly = toY(190);
            const rx = toX(268);
            const ry = toY(190);
            const lensW = 34 * scale;
            const lensH = (isAviator ? 25 : 20) * scale;

            // Draw Left Lens
            context.beginPath();
            if (isAviator) {
              // Aviator tear-drop
              context.moveTo(lx - lensW, ly - lensH * 0.5);
              context.lineTo(lx + lensW * 0.8, ly - lensH * 0.7);
              context.quadraticCurveTo(lx + lensW, ly + lensH * 0.7, lx, ly + lensH);
              context.quadraticCurveTo(lx - lensW, ly + lensH * 0.7, lx - lensW, ly - lensH * 0.5);
            } else {
              // Classic rounded rectangle / oval
              context.ellipse(lx, ly, lensW, lensH, 0, 0, Math.PI * 2);
            }
            context.stroke();
            context.fill();

            // Draw Right Lens
            context.beginPath();
            if (isAviator) {
              context.moveTo(rx - lensW * 0.8, ry - lensH * 0.7);
              context.lineTo(rx + lensW, ry - lensH * 0.5);
              context.quadraticCurveTo(rx + lensW, ry + lensH * 0.7, rx, ry + lensH);
              context.quadraticCurveTo(rx - lensW, ry + lensH * 0.7, rx - lensW * 0.8, ry - lensH * 0.7);
            } else {
              context.ellipse(rx, ry, lensW, lensH, 0, 0, Math.PI * 2);
            }
            context.stroke();
            context.fill();

            // Bridge connecting lenses
            context.beginPath();
            context.moveTo(lx + lensW * 0.7, ly - 3 * scale);
            context.quadraticCurveTo(toX(224), ly - 7 * scale, rx - lensW * 0.7, ry - 3 * scale);
            context.stroke();

            // Aviator Top Brow Bar
            if (isAviator) {
              context.beginPath();
              context.moveTo(lx - lensW * 0.4, ly - lensH * 0.7);
              context.lineTo(rx + lensW * 0.4, ry - lensH * 0.7);
              context.lineWidth = 1.8 * scale;
              context.stroke();
            }

            // Temples extending outward
            context.beginPath();
            context.moveTo(lx - lensW, ly - 2 * scale);
            context.lineTo(toX(124), toY(198));
            context.moveTo(rx + lensW, ry - 2 * scale);
            context.lineTo(toX(324), toY(198));
            context.lineWidth = 2.2 * scale;
            context.stroke();

            context.fillStrokeShape(shape);
          }}
        />
      )}

      {/* 5. Dynamic Scars & Marks Overlay */}
      {state.marks_scars && state.marks_scars.length > 0 && (
        <Shape
          sceneFunc={(context, shape) => {
            state.marks_scars.forEach((mark) => {
              // Coordinates normalized 0-100% on sketch area
              const mx = toX(mark.x * 4.27);
              const my = toY(mark.y * 4.77);
              const sz = (mark.size || 1) * scale;

              if (mark.type.includes('scar')) {
                context.strokeStyle = isPencil ? 'rgba(25, 25, 30, 0.85)' : 'rgba(150, 60, 50, 0.8)';
                context.lineWidth = 2 * sz;
                context.beginPath();
                context.moveTo(mx - 14 * sz, my - 10 * sz);
                context.lineTo(mx + 14 * sz, my + 10 * sz);
                context.stroke();

                // Cross suture ticks
                context.lineWidth = 1.2 * sz;
                for (let t = -8; t <= 8; t += 5) {
                  context.beginPath();
                  context.moveTo(mx + t * sz - 3 * sz, my + t * sz + 3 * sz);
                  context.lineTo(mx + t * sz + 3 * sz, my + t * sz - 3 * sz);
                  context.stroke();
                }
              } else {
                // Mole / Nevus
                context.fillStyle = isPencil ? '#1A1817' : '#452A1C';
                context.beginPath();
                context.arc(mx, my, 3.5 * sz, 0, Math.PI * 2);
                context.fill();
              }
            });

            context.fillStrokeShape(shape);
          }}
        />
      )}

      {/* 6. Dynamic Age Rhytids (Forehead & Nasolabial Furrows) */}
      {state.skin_age && (state.skin_age.age_appearance > 35 || state.skin_age.forehead_wrinkles > 0) && (
        <Shape
          sceneFunc={(context, shape) => {
            const ageFactor = Math.min(1, Math.max(0, (state.skin_age.age_appearance - 30) / 45));
            const furrowStrength = Math.max(ageFactor, state.skin_age.forehead_wrinkles || 0);

            if (furrowStrength > 0.1) {
              context.strokeStyle = isPencil ? 'rgba(30, 30, 35, 0.6)' : 'rgba(90, 55, 40, 0.55)';
              context.lineWidth = 1.6 * scale;

              // Upper forehead furrow
              context.beginPath();
              context.moveTo(toX(165), toY(105));
              context.quadraticCurveTo(toX(224), toY(98), toX(280), toY(105));
              context.stroke();

              // Mid forehead furrow
              context.beginPath();
              context.moveTo(toX(172), toY(118));
              context.quadraticCurveTo(toX(224), toY(112), toX(275), toY(118));
              context.stroke();

              // Lateral canthal crows feet
              if (furrowStrength > 0.4) {
                context.beginPath();
                context.moveTo(toX(150), toY(188));
                context.lineTo(toX(138), toY(184));
                context.moveTo(toX(150), toY(192));
                context.lineTo(toX(136), toY(194));
                context.moveTo(toX(298), toY(188));
                context.lineTo(toX(310), toY(184));
                context.moveTo(toX(298), toY(192));
                context.lineTo(toX(312), toY(194));
                context.stroke();
              }
            }

            context.fillStrokeShape(shape);
          }}
        />
      )}

      {/* 7. Anatomical Construction Guides (Loomis / Asaro Grid) */}
      {showGrid && (
        <Group listening={false}>
          {/* Vertical Sagittal Symmetry Axis */}
          <Line
            points={[toX(213.5), 0, toX(213.5), height]}
            stroke="#2563EB"
            strokeWidth={1}
            dash={[4, 4]}
            opacity={0.7}
          />
          {/* Hairline Guideline */}
          <Line
            points={[0, toY(125), width, toY(125)]}
            stroke="#2563EB"
            strokeWidth={0.8}
            dash={[3, 3]}
            opacity={0.5}
          />
          {/* Brow Guideline */}
          <Line
            points={[0, toY(170), width, toY(170)]}
            stroke="#2563EB"
            strokeWidth={0.8}
            dash={[3, 3]}
            opacity={0.5}
          />
          {/* Eye Guideline */}
          <Line
            points={[0, toY(190), width, toY(190)]}
            stroke="#2563EB"
            strokeWidth={1}
            dash={[4, 4]}
            opacity={0.7}
          />
          {/* Nose Base Guideline */}
          <Line
            points={[0, toY(245), width, toY(245)]}
            stroke="#2563EB"
            strokeWidth={0.8}
            dash={[3, 3]}
            opacity={0.5}
          />
          {/* Mouth / Stomion Guideline */}
          <Line
            points={[0, toY(273), width, toY(273)]}
            stroke="#2563EB"
            strokeWidth={0.8}
            dash={[3, 3]}
            opacity={0.5}
          />
          {/* Chin / Mentum Guideline */}
          <Line
            points={[0, toY(345), width, toY(345)]}
            stroke="#2563EB"
            strokeWidth={1}
            dash={[4, 4]}
            opacity={0.7}
          />

          {/* Proportional Labels */}
          <Text
            x={10}
            y={toY(125) - 12}
            text="TRICHION (1/3)"
            fontSize={9}
            fontFamily="monospace"
            fill="#2563EB"
          />
          <Text
            x={10}
            y={toY(190) - 12}
            text="INTERPUPILLARY AXIS"
            fontSize={9}
            fontFamily="monospace"
            fill="#2563EB"
          />
          <Text
            x={10}
            y={toY(245) - 12}
            text="SUBNASALE (2/3)"
            fontSize={9}
            fontFamily="monospace"
            fill="#2563EB"
          />
          <Text
            x={10}
            y={toY(345) - 12}
            text="GNATHION (3/3)"
            fontSize={9}
            fontFamily="monospace"
            fill="#2563EB"
          />
        </Group>
      )}

      {/* 8. Interactive Feature Target Hotspots & HUD Reticles */}
      {/* Head / Jaw Hotspot */}
      <Rect
        x={toX(140)}
        y={toY(280)}
        width={toX(170)}
        height={toY(75)}
        fill="transparent"
        onClick={handleSectionClick('head_jaw')}
      />

      {/* Eyes Hotspot */}
      <Rect
        x={toX(145)}
        y={toY(175)}
        width={toX(160)}
        height={toY(35)}
        fill="transparent"
        onClick={handleSectionClick('eyes')}
      />

      {/* Brows Hotspot */}
      <Rect
        x={toX(150)}
        y={toY(155)}
        width={toX(150)}
        height={toY(25)}
        fill="transparent"
        onClick={handleSectionClick('eyebrows')}
      />

      {/* Nose Hotspot */}
      <Rect
        x={toX(190)}
        y={toY(200)}
        width={toX(70)}
        height={toY(55)}
        fill="transparent"
        onClick={handleSectionClick('nose')}
      />

      {/* Mouth Hotspot */}
      <Rect
        x={toX(175)}
        y={toY(260)}
        width={toX(100)}
        height={toY(40)}
        fill="transparent"
        onClick={handleSectionClick('mouth')}
      />

      {/* Hair Hotspot */}
      <Rect
        x={toX(100)}
        y={toY(25)}
        width={toX(240)}
        height={toY(120)}
        fill="transparent"
        onClick={handleSectionClick('hair')}
      />

      {/* 9. Forensic Framing & Vignette Border */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke={isPencil ? '#0F1216' : '#2D3748'}
        strokeWidth={3}
        listening={false}
      />
    </Group>
  );
}
