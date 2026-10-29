import { FaceState, HeadJawState } from '../types';

export interface FacialGeometry {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  
  // Cranial & Mandibular bounds
  craniumRadiusX: number;
  craniumRadiusY: number;
  craniumCenterY: number;
  jawTopY: number;
  chinBottomY: number;
  jawLeftX: number;
  jawRightX: number;
  chinLeftX: number;
  chinRightX: number;
  chinCenterX: number;
  cheekLeftX: number;
  cheekRightX: number;
  cheekY: number;

  // Key Feature Centerpoints
  browY: number;
  eyeY: number;
  noseBridgeY: number;
  noseTipY: number;
  noseBaseY: number;
  mouthY: number;
  lowerLipY: number;
  chinTipY: number;

  // Left & Right eye coordinates
  leftEyeX: number;
  rightEyeX: number;
  eyeWidth: number;
  eyeHeight: number;
  eyeTiltRad: number;

  // Eyebrow bounds
  leftBrowX: number;
  rightBrowX: number;
  browWidth: number;
  browTiltRad: number;

  // Nose bounds
  noseWidth: number;
  nostrilLeftX: number;
  nostrilRightX: number;

  // Mouth bounds
  mouthWidth: number;
  mouthLeftX: number;
  mouthRightX: number;

  // Ear coordinates
  earTopY: number;
  earBottomY: number;
  earLeftX: number;
  earRightX: number;
  earWidth: number;

  // Neck bounds
  neckLeftX: number;
  neckRightX: number;
  neckBottomY: number;
}

/**
 * Calculates anatomically proportional facial geometry from typed FaceState
 * Normalized for a base 500 x 625 canvas (4:5 ratio)
 */
export function computeFacialGeometry(state: FaceState, canvasWidth = 500, canvasHeight = 625): FacialGeometry {
  const cx = canvasWidth / 2;
  const cy = canvasHeight * 0.44; // Anatomical vertical center

  const headJaw: any = state.head_jaw || {};
  const widthFactor = (headJaw.width || 1.0);
  const jawAngleFactor = (headJaw.jaw_angle || 1.0);
  const chinLengthFactor = (headJaw.chin_length || 1.0);
  const chinWidthFactor = (headJaw.chin_width || 1.0);
  const cheekProminence = (headJaw.cheekbone_prominence || 1.0);

  // Cranium base
  const craniumRadiusX = 110 * widthFactor;
  const craniumRadiusY = 135;
  const craniumCenterY = cy - 25;

  // Vertical feature anchors
  const eyeState: any = state.eyes || {};
  const noseState: any = state.nose || {};
  const mouthState: any = state.mouth || {};

  const eyeVerticalOffset = ((eyeState.vertical_position || 1.0) - 1.0) * 20;
  const noseVerticalOffset = ((noseState.vertical_position || 1.0) - 1.0) * 20;
  const mouthVerticalOffset = ((mouthState.vertical_position || 1.0) - 1.0) * 20;

  const eyeY = cy - 10 + eyeVerticalOffset;
  const browY = eyeY - 26 * (state.eyebrows?.height || 1.0);
  const noseBridgeY = eyeY + 12;
  const noseBaseY = cy + 55 + noseVerticalOffset;
  const noseTipY = noseBaseY - 6;
  const mouthY = noseBaseY + 38 + mouthVerticalOffset;
  const lowerLipY = mouthY + 14 * (mouthState.lower_lip_thickness || 1.0);
  
  const baseChinY = cy + 160;
  const chinBottomY = baseChinY + (chinLengthFactor - 1.0) * 35;
  const jawTopY = cy + 20;

  // Horizontal anchors
  const eyeSpacing = (eyeState.spacing || 1.0);
  const leftEyeX = cx - 50 * eyeSpacing;
  const rightEyeX = cx + 50 * eyeSpacing;
  const eyeWidth = 26 * (eyeState.size || 1.0);
  const eyeHeight = 13 * (eyeState.size || 1.0);
  const eyeTiltRad = ((eyeState.tilt || 0) * Math.PI) / 180;

  const browSpacing = (state.eyebrows?.spacing || 1.0);
  const leftBrowX = cx - 52 * browSpacing;
  const rightBrowX = cx + 52 * browSpacing;
  const browWidth = 36 * (state.eyebrows?.density || 1.0);
  const browTiltRad = ((state.eyebrows?.tilt || 0) * Math.PI) / 180;

  // Jaw & Cheek coordinates
  const cheekY = cy + 15;
  const cheekLeftX = cx - (craniumRadiusX * 0.98 * cheekProminence);
  const cheekRightX = cx + (craniumRadiusX * 0.98 * cheekProminence);

  const jawWidth = craniumRadiusX * 0.88 * jawAngleFactor;
  const jawLeftX = cx - jawWidth;
  const jawRightX = cx + jawWidth;

  const chinW = 28 * chinWidthFactor;
  const chinLeftX = cx - chinW;
  const chinRightX = cx + chinW;

  // Nose bounds
  const noseWidth = 24 * (noseState.width || 1.0);
  const nostrilLeftX = cx - noseWidth * 0.9;
  const nostrilRightX = cx + noseWidth * 0.9;

  // Mouth bounds
  const mouthWidth = 44 * (mouthState.width || 1.0);
  const mouthLeftX = cx - mouthWidth;
  const mouthRightX = cx + mouthWidth;

  // Ears
  const earSize = (state.ears?.size || 1.0);
  const earVerticalOffset = ((state.ears?.vertical_position || 1.0) - 1.0) * 15;
  const earTopY = browY + 6 + earVerticalOffset;
  const earBottomY = noseBaseY - 4 + earVerticalOffset + (earSize - 1.0) * 20;
  const earProtrusion = (state.ears?.protrusion || 1.0);
  const earWidth = 26 * earProtrusion;
  const earLeftX = cheekLeftX - 6;
  const earRightX = cheekRightX + 6;

  // Neck
  const neckLeftX = cx - craniumRadiusX * 0.72;
  const neckRightX = cx + craniumRadiusX * 0.72;
  const neckBottomY = canvasHeight;

  return {
    width: canvasWidth,
    height: canvasHeight,
    centerX: cx,
    centerY: cy,
    craniumRadiusX,
    craniumRadiusY,
    craniumCenterY,
    jawTopY,
    chinBottomY,
    jawLeftX,
    jawRightX,
    chinLeftX,
    chinRightX,
    chinCenterX: cx,
    cheekLeftX,
    cheekRightX,
    cheekY,
    browY,
    eyeY,
    noseBridgeY,
    noseTipY,
    noseBaseY,
    mouthY,
    lowerLipY,
    chinTipY: chinBottomY,
    leftEyeX,
    rightEyeX,
    eyeWidth,
    eyeHeight,
    eyeTiltRad,
    leftBrowX,
    rightBrowX,
    browWidth,
    browTiltRad,
    noseWidth,
    nostrilLeftX,
    nostrilRightX,
    mouthWidth,
    mouthLeftX,
    mouthRightX,
    earTopY,
    earBottomY,
    earLeftX,
    earRightX,
    earWidth,
    neckLeftX,
    neckRightX,
    neckBottomY,
  };
}
