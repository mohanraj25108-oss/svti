// EYEWITNESS CRANIOFACIAL PROPORTION ENGINE
// Mathematical interpolation of anatomical control points for forensic portrait rendering

import { FaceState } from '../types';

export interface HeadContourPoints {
  topCranium: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
  leftJaw: { x: number; y: number };
  rightJaw: { x: number; y: number };
  chinLeft: { x: number; y: number };
  chinTip: { x: number; y: number };
  chinRight: { x: number; y: number };
}

export function computeHeadContour(state: FaceState): string {
  const cx = 300;
  const cy = 350;
  const { 
    width = 1, 
    jaw_angle = 1, 
    chin_length = 1, 
    chin_shape = 'round', 
    chin_width = 1, 
    cheekbone_prominence = 1 
  } = state?.head_jaw || {};

  // Base dimensions
  const rx = 142 * width;
  const ry = 188;

  const jawWidth = rx * 0.88 * jaw_angle;
  const cheekWidth = rx * 1.02 * cheekbone_prominence;
  const chinW = 32 * chin_width;
  const chinY = cy + ry * chin_length;

  const templeY = cy - 80;
  const cheekY = cy + 20;
  const jawY = cy + 115 * chin_length;

  // Morph targets for chin shape
  let chinPathSnippet = '';
  if (chin_shape === 'square') {
    chinPathSnippet = `L ${cx - chinW} ${chinY} L ${cx + chinW} ${chinY}`;
  } else if (chin_shape === 'pointed') {
    chinPathSnippet = `L ${cx} ${chinY + 8}`;
  } else if (chin_shape === 'cleft') {
    chinPathSnippet = `Q ${cx - chinW * 0.5} ${chinY + 4} ${cx} ${chinY - 4} Q ${cx + chinW * 0.5} ${chinY + 4} ${cx + chinW} ${chinY}`;
  } else if (chin_shape === 'receding') {
    chinPathSnippet = `Q ${cx} ${chinY - 12} ${cx + chinW} ${chinY - 6}`;
  } else if (chin_shape === 'protruding') {
    chinPathSnippet = `Q ${cx} ${chinY + 14} ${cx + chinW} ${chinY}`;
  } else {
    // round
    chinPathSnippet = `Q ${cx} ${chinY + 6} ${cx + chinW} ${chinY}`;
  }

  // Continuous smooth cubic/quadratic bezier cranium and mandible contour
  const path = `
    M ${cx} ${cy - ry}
    C ${cx + rx * 0.9} ${cy - ry}, ${cx + rx} ${templeY - 40}, ${cx + rx * 0.96} ${templeY}
    C ${cx + rx * 0.98} ${templeY + 40}, ${cx + cheekWidth} ${cheekY - 20}, ${cx + cheekWidth} ${cheekY}
    C ${cx + cheekWidth} ${cheekY + 40}, ${cx + jawWidth} ${jawY - 25}, ${cx + jawWidth} ${jawY}
    C ${cx + jawWidth * 0.9} ${jawY + 35}, ${cx + chinW * 1.4} ${chinY - 10}, ${cx + chinW} ${chinY}
    ${chinPathSnippet}
    C ${cx - chinW * 1.4} ${chinY - 10}, ${cx - jawWidth * 0.9} ${jawY + 35}, ${cx - jawWidth} ${jawY}
    C ${cx - jawWidth} ${jawY - 25}, ${cx - cheekWidth} ${cheekY + 40}, ${cx - cheekWidth} ${cheekY}
    C ${cx - cheekWidth} ${cheekY - 20}, ${cx - rx * 0.98} ${templeY + 40}, ${cx - rx * 0.96} ${templeY}
    C ${cx - rx} ${templeY - 40}, ${cx - rx * 0.9} ${cy - ry}, ${cx} ${cy - ry}
    Z
  `;

  return path.replace(/\s+/g, ' ').trim();
}

export function computeNeckPath(state: FaceState): string {
  const cx = 300;
  const { width = 1, jaw_angle = 1 } = state?.head_jaw || {};
  const neckHalfW = 86 * width * (jaw_angle > 1 ? 1.08 : 0.96);
  const collarY = 700;

  return `
    M ${cx - neckHalfW} 480
    L ${cx - neckHalfW - 75} ${collarY}
    L ${cx + neckHalfW + 75} ${collarY}
    L ${cx + neckHalfW} 480
    Z
  `.replace(/\s+/g, ' ').trim();
}
