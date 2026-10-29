// EYEWITNESS CRANIOFACIAL EXPORT ENGINE
// High-resolution PNG (>=2048px) and SVG vector blueprint export with statutory watermark

import { FaceState } from './types';

export interface ExportOptions {
  caseNumber: string;
  officerName: string;
  badgeNumber: string;
  isApproved: boolean;
  mode: 'pencil' | 'realistic';
}

export async function exportHighResPng(
  elementId: string,
  state: FaceState,
  options: ExportOptions
): Promise<void> {
  const container = document.getElementById(elementId);
  const konvaCanvas = container?.querySelector('canvas') || (container instanceof HTMLCanvasElement ? container : null);
  const svgEl = container instanceof SVGSVGElement ? container : (container?.querySelector('svg') || document.getElementById('face-svg-pencil') || document.getElementById('face-svg-realistic'));

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = 1638;
  finalCanvas.height = 2048;
  const ctx = finalCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D canvas context');
  }

  // 1. Draw Background
  ctx.fillStyle = options.mode === 'pencil' ? '#07080B' : '#0C0E14';
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  if (konvaCanvas) {
    // Direct Konva Canvas Capture (High fidelity)
    ctx.drawImage(konvaCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
    renderWatermarks(ctx, finalCanvas, state, options);
    triggerDownload(finalCanvas, options);
    return;
  }

  if (svgEl) {
    const clonedSvg = svgEl.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('width', '1638');
    clonedSvg.setAttribute('height', '2048');
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1638, 2048);
        URL.revokeObjectURL(url);
        renderWatermarks(ctx, finalCanvas, state, options);
        triggerDownload(finalCanvas, options);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to render SVG image'));
      };
      img.src = url;
    });
  }

  throw new Error('No renderable canvas or SVG found for export');
}

function renderWatermarks(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, state: FaceState, options: ExportOptions) {
  // Official Law Enforcement Header Strip
  ctx.fillStyle = 'rgba(7, 8, 11, 0.95)';
  ctx.fillRect(0, 0, canvas.width, 110);
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.lineTo(canvas.width, 110);
  ctx.stroke();

  ctx.fillStyle = '#60A5FA';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillText('CRIMINAL JUSTICE INFORMATION SERVICES // OFFICIAL FORENSIC COMPOSITE', 40, 48);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '22px "Courier New", monospace';
  ctx.fillText(`CASE: ${options.caseNumber}  |  LEAD SEED: SF-COMPOSITE-${state.seed || 1042}`, 40, 85);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '20px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC', canvas.width - 40, 85);
  ctx.textAlign = 'left';

  // Official Statutory Watermark Bottom Strip
  const bottomHeight = 130;
  ctx.fillStyle = 'rgba(7, 8, 11, 0.95)';
  ctx.fillRect(0, canvas.height - bottomHeight, canvas.width, bottomHeight);

  // Cobalt Blue Accent line
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - bottomHeight);
  ctx.lineTo(canvas.width, canvas.height - bottomHeight);
  ctx.stroke();

  ctx.fillStyle = '#60A5FA';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillText('COMPOSITE: INVESTIGATIVE LEAD ONLY, NOT EVIDENCE OF IDENTITY', 40, canvas.height - 75);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '19px "Courier New", monospace';
  ctx.fillText(
    `OFFICER: ${options.officerName || 'Detective'} | BADGE: #${options.badgeNumber || '4892'} | CJIS SAFEGUARD 18 U.S.C. § 1512`,
    40,
    canvas.height - 35
  );
}

function triggerDownload(canvas: HTMLCanvasElement, options: ExportOptions) {
  const downloadLink = document.createElement('a');
  downloadLink.download = `EyeWitness_${options.caseNumber}_LEAD_${Date.now()}.png`;
  downloadLink.href = finalDataUrl(canvas);
  downloadLink.click();
}

function finalDataUrl(canvas: HTMLCanvasElement): string {
  try {
    return canvas.toDataURL('image/png');
  } catch (e) {
    return '';
  }
}

export function exportVectorSvg(svgElementId: string, stateOrCase: any, optionalCaseNumber?: string): void {
  const caseNumber = optionalCaseNumber || (typeof stateOrCase === 'string' ? stateOrCase : 'SF-2026-0492');
  const svgEl = document.getElementById(svgElementId) || document.querySelector('svg');
  if (!svgEl) {
    throw new Error('Vector element not found for export');
  }

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgEl);

  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `EyeWitness_${caseNumber}_BLUEPRINT.svg`;
  link.click();
  URL.revokeObjectURL(url);
}
