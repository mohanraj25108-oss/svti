'use client';

import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid, 
  SplitSquareVertical, 
  Shield
} from 'lucide-react';
import { FaceState, FeatureSectionId } from '../types';
import { INITIAL_FACE_STATE } from '../defaultFaceState';
import { RealisticKonvaFace } from './RealisticKonvaFace';

interface KonvaFaceCanvasProps {
  state: FaceState;
  previewState?: FaceState | null; // Used for hover preview
  beforeState?: FaceState | null;  // Used for before/after comparison
  displayMode: 'pencil' | 'realistic' | 'side_by_side';
  onChangeDisplayMode: (mode: 'pencil' | 'realistic' | 'side_by_side') => void;
  selectedSection: FeatureSectionId | null;
  onSelectSection: (section: FeatureSectionId) => void;
  onUpdateCoordinates?: (markId: string, x: number, y: number) => void;
}

export function KonvaFaceCanvas({
  state,
  previewState,
  beforeState,
  displayMode,
  onChangeDisplayMode,
  selectedSection,
  onSelectSection,
}: KonvaFaceCanvasProps) {
  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Construction Grid toggle
  const [showGrid, setShowGrid] = useState(false);

  // Before/After comparison mode
  const [showComparison, setShowComparison] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50); // 0 to 100%

  // Active state to render (previewState takes precedence if hovering preset)
  const activeState = previewState || state || INITIAL_FACE_STATE;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Direct pan mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.altKey) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0C0E14] border border-white/[0.08] shadow-sm space-y-4">
      {/* Top Controls Strip: Render Modes & Canvas Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        {/* Render Mode Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">VIEW:</span>
          <div className="flex bg-[#07080B] p-0.5 rounded-lg border border-white/[0.08] text-xs">
            <button
              onClick={() => onChangeDisplayMode('side_by_side')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                displayMode === 'side_by_side' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side Dual View
            </button>
            <button
              onClick={() => onChangeDisplayMode('pencil')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                displayMode === 'pencil' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forensic Pencil
            </button>
            <button
              onClick={() => onChangeDisplayMode('realistic')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                displayMode === 'realistic' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Realistic Portrait
            </button>
          </div>
        </div>

        {/* Canvas Toolbar Actions */}
        <div className="flex items-center space-x-1.5 text-xs">
          {/* Construction Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition-colors flex items-center space-x-1 ${
              showGrid 
                ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-sm' 
                : 'bg-[#07080B] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
            title="Toggle Anatomical Construction Guides"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>GUIDES</span>
          </button>

          {/* Before/After Split Comparison Toggle */}
          {beforeState && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition-colors flex items-center space-x-1 ${
                showComparison
                  ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-sm'
                  : 'bg-[#07080B] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title="Compare Before & After"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>COMPARE</span>
            </button>
          )}

          {/* Zoom In / Out / Reset */}
          <div className="flex items-center bg-[#07080B] border border-white/[0.08] rounded-md p-0.5 text-slate-400">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] text-slate-300 font-mono font-medium">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoomPan}
              className="p-1 hover:text-white border-l border-white/[0.08] ml-0.5"
              title="Reset Zoom & Pan"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Portrait Stage Frame (Sharp 4:5 Aspect Ratio) */}
      <div
        className="relative rounded-xl bg-[#07080B] border border-white/[0.08] p-2 min-h-[520px] flex flex-col justify-between overflow-hidden shadow-sm"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Hover Preview Active Pill */}
        {previewState && (
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded bg-blue-600 text-white font-mono font-semibold text-[10px] shadow-sm">
            PRESET PREVIEW
          </div>
        )}

        {/* Dual View or Single View */}
        {displayMode === 'side_by_side' && !showComparison ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-[540px]">
            {/* Forensic Charcoal Sketch Pane */}
            <div className="relative rounded-lg overflow-hidden border border-white/[0.08] bg-[#0A0C11] flex flex-col">
              <div className="p-2.5 bg-[#12151D] border-b border-white/[0.06] flex justify-between items-center text-[10px] font-mono text-slate-300 font-medium">
                <span className="tracking-wider">FORENSIC CHARCOAL SKETCH</span>
                <span className="text-blue-400">REACT-KONVA 2D ENGINE</span>
              </div>
              <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden" id="konva-stage-pencil">
                <Stage
                  width={380}
                  height={475}
                  scaleX={zoom * (380 / 500)}
                  scaleY={zoom * (380 / 500)}
                  x={pan.x}
                  y={pan.y}
                >
                  <Layer>
                    <RealisticKonvaFace
                      state={activeState}
                      mode="pencil"
                      showGrid={showGrid}
                      selectedSection={selectedSection}
                      onSelectSection={onSelectSection}
                      width={500}
                      height={625}
                    />
                  </Layer>
                </Stage>
              </div>
            </div>

            {/* Realistic Reference Portrait Pane */}
            <div className="relative rounded-lg overflow-hidden border border-white/[0.08] bg-[#0A0C11] flex flex-col">
              <div className="p-2.5 bg-[#12151D] border-b border-white/[0.06] flex justify-between items-center text-[10px] font-mono text-slate-300 font-medium">
                <span className="tracking-wider">REALISTIC REFERENCE PORTRAIT</span>
                <span className="text-blue-400">PARAMETRIC CANVAS SHADER</span>
              </div>
              <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden" id="konva-stage-realistic">
                <Stage
                  width={380}
                  height={475}
                  scaleX={zoom * (380 / 500)}
                  scaleY={zoom * (380 / 500)}
                  x={pan.x}
                  y={pan.y}
                >
                  <Layer>
                    <RealisticKonvaFace
                      state={activeState}
                      mode="realistic"
                      showGrid={showGrid}
                      selectedSection={selectedSection}
                      onSelectSection={onSelectSection}
                      width={500}
                      height={625}
                    />
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
        ) : showComparison && beforeState ? (
          /* Before / After Split View Comparison */
          <div className="relative w-full max-w-lg h-[540px] mx-auto overflow-hidden rounded-lg border border-blue-500/40 flex items-center justify-center">
            {/* Base "After" (Current) Canvas */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Stage
                width={440}
                height={550}
                scaleX={zoom * (440 / 500)}
                scaleY={zoom * (440 / 500)}
                x={pan.x}
                y={pan.y}
              >
                <Layer>
                  <RealisticKonvaFace
                    state={activeState}
                    mode={displayMode === 'side_by_side' ? 'pencil' : displayMode}
                    showGrid={showGrid}
                    selectedSection={selectedSection}
                    onSelectSection={onSelectSection}
                    width={500}
                    height={625}
                  />
                </Layer>
              </Stage>
            </div>

            {/* Clipped "Before" Canvas */}
            <div 
              className="absolute inset-0 overflow-hidden border-r-2 border-blue-500 flex items-center justify-center"
              style={{ width: `${splitPosition}%` }}
            >
              <div className="w-[500px] h-full flex items-center justify-center">
                <Stage
                  width={440}
                  height={550}
                  scaleX={zoom * (440 / 500)}
                  scaleY={zoom * (440 / 500)}
                  x={pan.x}
                  y={pan.y}
                >
                  <Layer>
                    <RealisticKonvaFace
                      state={beforeState}
                      mode={displayMode === 'side_by_side' ? 'pencil' : displayMode}
                      showGrid={showGrid}
                      width={500}
                      height={625}
                    />
                  </Layer>
                </Stage>
              </div>
            </div>

            {/* Split Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 z-20 w-0.5 bg-blue-500 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shadow-md">
                ↔
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={splitPosition}
              onChange={(e) => setSplitPosition(Number(e.target.value))}
              className="absolute bottom-2 left-4 right-4 z-30 opacity-70 hover:opacity-100 accent-blue-600"
            />
          </div>
        ) : (
          /* Single Large View */
          <div className="w-full max-w-lg h-[540px] mx-auto relative rounded-lg overflow-hidden border border-white/[0.08] bg-[#0A0C11] flex items-center justify-center" id={displayMode === 'pencil' ? 'konva-stage-pencil' : 'konva-stage-realistic'}>
            <Stage
              width={440}
              height={550}
              scaleX={zoom * (440 / 500)}
              scaleY={zoom * (440 / 500)}
              x={pan.x}
              y={pan.y}
            >
              <Layer>
                <RealisticKonvaFace
                  state={activeState}
                  mode={displayMode === 'side_by_side' ? 'pencil' : displayMode}
                  showGrid={showGrid}
                  selectedSection={selectedSection}
                  onSelectSection={onSelectSection}
                  width={500}
                  height={625}
                />
              </Layer>
            </Stage>
          </div>
        )}

        {/* Minimal Signature Accent Line under Portrait Frames */}
        <div className="h-0.5 bg-blue-600 rounded-full mt-2" />
      </div>

      {/* Official Statutory Watermark Notice Bar */}
      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-300 font-medium">
          <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="text-[11px]">COMPOSITE: INVESTIGATIVE LEAD ONLY, NOT EVIDENCE OF IDENTITY</span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">CJIS SAFEGUARD 18 U.S.C. § 1512</span>
      </div>
    </div>
  );
}
