'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { FaceState, FeatureSectionId } from './types';

const KonvaFaceCanvasDynamic = dynamic(
  () => import('./konva/KonvaFaceCanvas').then((mod) => mod.KonvaFaceCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="p-5 rounded-xl bg-[#0C0E14] border border-white/[0.08] shadow-sm flex items-center justify-center min-h-[550px]">
        <div className="flex flex-col items-center space-y-2 text-slate-400 font-mono text-xs">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>INITIALIZING KONVA FORENSIC CANVAS...</span>
        </div>
      </div>
    ),
  }
);

interface FaceCanvasProps {
  state: FaceState;
  previewState?: FaceState | null;
  beforeState?: FaceState | null;
  displayMode: 'pencil' | 'realistic' | 'side_by_side';
  onChangeDisplayMode: (mode: 'pencil' | 'realistic' | 'side_by_side') => void;
  selectedSection: FeatureSectionId | null;
  onSelectSection: (section: FeatureSectionId) => void;
  onUpdateCoordinates?: (markId: string, x: number, y: number) => void;
}

export function FaceCanvas(props: FaceCanvasProps) {
  return <KonvaFaceCanvasDynamic {...props} />;
}
