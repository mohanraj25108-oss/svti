"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Layers, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Compass, 
  Maximize2, 
  ShieldAlert, 
  RefreshCw,
  CheckCircle2,
  Sliders
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

export default function SceneSketchPage() {
  const { activeCaseId } = useApp();
  const { showToast } = useToast();

  // Mode: "technical" or "realistic"
  const [mode, setMode] = useState<"technical" | "realistic">("technical");
  
  // Scene structured fields
  const [locationType, setLocationType] = useState("Indoor - Commercial Vault");
  const [roomLayout, setRoomLayout] = useState("Reinforced Vault & Teller Area");
  const [lighting, setLighting] = useState("Dim Auxiliary Halogen");
  const [timeOfDay, setTimeOfDay] = useState("Night 02:40 AM");
  const [narrative, setNarrative] = useState(
    "Perimeter breach at South Entrance. Suspect traversed along counter A before entering the vault area. Emptied canisters and exited through emergency corridor west."
  );

  // Evidence markers on canvas
  const [markers, setMarkers] = useState<any[]>([
    {"id": 1, "label": "9mm Casing (Federal)", "x": 480, "y": 320, "type": "ballistics"},
    {"id": 2, "label": "Partial Palm Print on Glass", "x": 460, "y": 180, "type": "latent"},
    {"id": 3, "label": "Dropped Black Cable Ties", "x": 280, "y": 240, "type": "physical"},
    {"id": 4, "label": "Pry Marks on Safe Lock", "x": 160, "y": 140, "type": "tool_mark"},
    {"id": 5, "label": "Torn Fabric Snag", "x": 105, "y": 380, "type": "fiber"}
  ]);

  // Layer toggles
  const [showGrid, setShowGrid] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);

  // New marker input
  const [newMarkerLabel, setNewMarkerLabel] = useState("");
  const [newMarkerType, setNewMarkerType] = useState("physical");

  // Output generated SVGs
  const [synthesizing, setSynthesizing] = useState(false);
  const [sceneRecord, setSceneRecord] = useState<any | null>(null);

  const handleSynthesize = async () => {
    setSynthesizing(true);
    try {
      const res = await api.synthesizeSceneSketch({
        case_id: activeCaseId || 1,
        title: "Forensic Crime Scene Diagram",
        location_type: locationType,
        room_layout: roomLayout,
        lighting,
        time_of_day: timeOfDay,
        narrative,
        markers,
        measurements: [{"from": "Entry", "to": "Vault", "distance": "12.4m"}]
      });
      setSceneRecord(res);
      showToast("Crime scene diagram and spatial matrix generated.", "success", "SCENE SYNTHESIZED");
    } catch (err: any) {
      showToast(err.message || "Failed to generate scene diagram", "error", "SYNTHESIS FAILED");
    } finally {
      setSynthesizing(false);
    }
  };

  const addMarker = () => {
    if (!newMarkerLabel.trim()) return;
    const newId = markers.length + 1;
    setMarkers([
      ...markers,
      {
        id: newId,
        label: newMarkerLabel.trim(),
        x: 300 + (markers.length * 20) % 200,
        y: 200 + (markers.length * 30) % 200,
        type: newMarkerType
      }
    ]);
    setNewMarkerLabel("");
  };

  const removeMarker = (id: number) => {
    setMarkers(markers.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08]/90 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              MODULE 02 // SPATIAL CRIME SCENE RECONSTRUCTION
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-slate-400">CASE #SF-2026-0492</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-wide flex items-center space-x-3 mt-1">
            <MapPin className="w-7 h-7 text-blue-400" />
            <span>CRIME SCENE DIAGRAM & SPATIAL MATRIX</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href={`/reports?case_id=${activeCaseId || 1}`}
            className="px-4 py-2.5 rounded-xl btn-coral-gradient text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-red-950/40 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Attach Diagram to Dossier</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (4 Cols): Scene Inputs & Evidence Markers List */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Structured Scene Parameters */}
          <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-4 shadow-xl font-mono text-xs">
            <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest border-b border-white/[0.08] pb-2">
              SCENE CONFIGURATION PARAMETERS
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-blue-400/90 mb-1.5 font-semibold">LOCATION CLASSIFICATION</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
              >
                <option value="Indoor - Commercial Vault">Indoor - Commercial Bank / Vault</option>
                <option value="Indoor - Convenience Store">Indoor - Convenience Retail</option>
                <option value="Indoor - Residential Residence">Indoor - Residential Apartment</option>
                <option value="Outdoor - Commercial Alleyway">Outdoor - Urban Alleyway</option>
                <option value="Outdoor - Parking Garage Sub-level">Outdoor - Subterranean Garage</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-blue-400/90 mb-1.5 font-semibold">LIGHTING CONDITIONS</label>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                >
                  <option value="Dim Auxiliary Halogen">Dim Halogen</option>
                  <option value="Fluorescent Overhead">Fluorescent</option>
                  <option value="Night Darkness / Strobe">Dark / Flashlight</option>
                  <option value="Daylight Natural">Daylight</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-blue-400/90 mb-1.5 font-semibold">TIME OF INCIDENT</label>
                <input
                  type="text"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-blue-400/90 mb-1.5 font-semibold">SPATIAL NARRATIVE & TRAJECTORY</label>
              <textarea
                rows={3}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#07080B] border border-white/[0.08] text-white font-sans text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
              />
            </div>

            <button
              onClick={handleSynthesize}
              disabled={synthesizing}
              className="w-full py-3 rounded-xl btn-coral-gradient text-white font-bold font-orbitron text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${synthesizing ? "animate-spin" : ""}`} />
              <span>{synthesizing ? "Synthesizing Diagram..." : "Generate Scene Visualization"}</span>
            </button>
          </div>

          {/* Interactive Evidence Markers List */}
          <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">EVIDENCE CONES & TAGS</span>
              <span className="text-slate-300 font-bold bg-white/[0.05]/50 border border-blue-500/40/40 px-2.5 py-0.5 rounded-full text-[10px]">{markers.length} TAGS LOGGED</span>
            </div>

            {/* Add Marker Form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMarkerLabel}
                onChange={(e) => setNewMarkerLabel(e.target.value)}
                placeholder="e.g. Broken Glass / Shell Casing"
                className="flex-1 px-3 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-[11px] focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addMarker}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-[11px] shadow-sm shadow-amber-500/20"
              >
                + Add Tag
              </button>
            </div>

            {/* Markers List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {markers.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-[#07080B] border border-white/[0.08]/90 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-[10px]">
                      {m.id}
                    </span>
                    <span className="text-slate-200">{m.label}</span>
                  </div>
                  <button
                    onClick={() => removeMarker(m.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Layer Control Panel */}
          <div className="p-4 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-2.5 font-mono text-xs shadow-lg">
            <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
              DIAGRAM LAYER TOGGLES
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded bg-slate-900 text-blue-400 focus:ring-0"
                />
                <span>Blueprint Grid</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMarkers}
                  onChange={(e) => setShowMarkers(e.target.checked)}
                  className="rounded bg-slate-900 text-blue-400 focus:ring-0"
                />
                <span>Evidence Tags</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMeasurements}
                  onChange={(e) => setShowMeasurements(e.target.checked)}
                  className="rounded bg-slate-900 text-blue-400 focus:ring-0"
                />
                <span>Scale Calipers</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrajectory}
                  onChange={(e) => setShowTrajectory(e.target.checked)}
                  className="rounded bg-slate-900 text-blue-400 focus:ring-0"
                />
                <span>Perp Trajectory</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column (8 Cols): Interactive Blueprint / Perspective Canvas */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-2xl space-y-4">
            
            {/* Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">VIEWPOINT:</span>
                <div className="flex rounded-full bg-black/60 p-1 border border-white/[0.08]/90">
                  <button
                    onClick={() => setMode("technical")}
                    className={`px-3.5 py-1.5 rounded-full transition-all text-xs ${
                      mode === "technical" ? "bg-blue-600 text-white font-bold shadow-md shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    2D Technical Blueprint (Top-Down)
                  </button>
                  <button
                    onClick={() => setMode("realistic")}
                    className={`px-3.5 py-1.5 rounded-full transition-all text-xs ${
                      mode === "realistic" ? "bg-blue-600 text-white font-bold shadow-md shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    3D Perspective Render
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                SCALE: 1:50 METRIC • OFFICIAL POLICE RECORD
              </div>
            </div>

            {/* Interactive Canvas with Reference Amber Accent Bar */}
            <div className="relative rounded-2xl bg-[#07080B] border border-white/[0.08]/90 h-[500px] overflow-hidden flex flex-col justify-between p-2 shadow-inner">
              <div
                className="w-full h-full relative"
                dangerouslySetInnerHTML={{
                  __html: mode === "technical"
                    ? (sceneRecord?.technical_plan_data || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%"><rect width="800" height="600" fill="#07090D"/><text x="400" y="300" fill="#00E5FF" font-family="monospace" text-anchor="middle">Click "Generate Scene Visualization" to render blueprint</text></svg>`)
                    : (sceneRecord?.realistic_render_data || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%"><rect width="800" height="600" fill="#07090D"/><text x="400" y="300" fill="#FF5238" font-family="monospace" text-anchor="middle">Perspective 3D Reconstruction</text></svg>`)
                }}
              />
              <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full mt-2" />
            </div>

            {/* Evidentiary Legend Bar */}
            <div className="p-3 rounded-xl bg-[#07080B] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5 text-yellow-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span>Evidence Tag</span>
                </span>
                <span className="flex items-center space-x-1.5 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Suspect Trajectory</span>
                </span>
                <span className="flex items-center space-x-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>Witness Line-of-Sight</span>
                </span>
              </div>
              <span className="text-slate-500 font-bold">
                MANDATORY STATUTORY WATERMARK ATTACHED
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

