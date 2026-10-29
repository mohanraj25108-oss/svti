"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Camera, 
  Plus, 
  Trash2, 
  Layers, 
  ShieldAlert, 
  Download, 
  CheckCircle2, 
  RefreshCw,
  Film,
  MoveRight
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";

export default function VideoReconPage() {
  const { activeCaseId } = useApp();

  const [title, setTitle] = useState("Vault Infiltration Spatial Chronology");
  const [duration, setDuration] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [activeClipIndex, setActiveClipIndex] = useState(0);

  // Timeline chronology steps
  const [timelineSteps, setTimelineSteps] = useState<any[]>([
    {
      step: 1,
      timestamp: "00:00:03",
      title: "Perimeter Infiltration",
      description: "Perpetrator bypasses South emergency fire door using manual pry tool.",
      camera_view: "South Corridor Cam 04",
      characters: ["Suspect #1"]
    },
    {
      step: 2,
      timestamp: "00:00:08",
      title: "Teller Confrontation & Vault Entry",
      description: "Suspect approaches teller window, demands access, and forces vault inner gate.",
      camera_view: "Teller Overhead Cam 01",
      characters: ["Suspect #1", "Night Security Guard"]
    },
    {
      step: 3,
      timestamp: "00:00:14",
      title: "Rapid Extraction West",
      description: "Suspect leaves with duffel canisters and sprints towards rear alleyway exit.",
      camera_view: "West Alleyway Cam 02",
      characters: ["Suspect #1"]
    }
  ]);

  // Generation status
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "READY">("READY");
  const [activeCamera, setActiveCamera] = useState("South Corridor Cam 04");

  // New step fields
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");
  const [newStepTime, setNewStepTime] = useState("00:00:18");

  const addStep = () => {
    if (!newStepTitle.trim()) return;
    const newStepNum = timelineSteps.length + 1;
    setTimelineSteps([
      ...timelineSteps,
      {
        step: newStepNum,
        timestamp: newStepTime,
        title: newStepTitle,
        description: newStepDesc,
        camera_view: "Tactical Overhead View",
        characters: ["Suspect #1"]
      }
    ]);
    setNewStepTitle("");
    setNewStepDesc("");
  };

  const removeStep = (index: number) => {
    setTimelineSteps(timelineSteps.filter((_, idx) => idx !== index));
  };

  const handleSynthesizeVideo = async () => {
    setStatus("PROCESSING");
    try {
      await api.synthesizeVideoRecon({
        case_id: activeCaseId || 1,
        title,
        timeline_steps: timelineSteps,
        duration_seconds: duration,
        style: "SCHEMATIC_TACTICAL"
      });
      setTimeout(() => {
        setStatus("READY");
      }, 1000);
    } catch (err: any) {
      alert(err.message || "Failed to synthesize video sequence");
      setStatus("IDLE");
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08]/90 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              MODULE 03 // SCHEMATIC EVENT RECONSTRUCTION
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-slate-400">CASE #SF-2026-0492</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-wide flex items-center space-x-3 mt-1">
            <Video className="w-7 h-7 text-blue-400" />
            <span>TACTICAL CRIME VIDEO RECONSTRUCTION</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href={`/reports?case_id=${activeCaseId || 1}`}
            className="px-4 py-2.5 rounded-xl btn-coral-gradient text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-red-950/40 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Attach Video Log to Case Dossier</span>
          </Link>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (5 Cols): Timeline Event Editor & Clip Arranger */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">EVENT CHRONOLOGY BUILDER</span>
              <span className="text-blue-400 font-bold bg-blue-500/10/40 border border-white/[0.08] px-2.5 py-0.5 rounded-full text-[10px]">{timelineSteps.length} CLIPS ARRANGED</span>
            </div>

            {/* Sequence Title & Duration */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-blue-400/90 mb-1.5 font-semibold">RECONSTRUCTION TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-blue-400/90 mb-1.5 font-semibold">SPAN (SEC)</label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
            </div>

            {/* Add Step Form */}
            <div className="p-3.5 rounded-xl bg-[#07080B] border border-white/[0.08]/90 space-y-2.5">
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Add New Sequence Event</div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newStepTime}
                  onChange={(e) => setNewStepTime(e.target.value)}
                  placeholder="00:00:15"
                  className="px-2.5 py-1.5 rounded-lg bg-[#0C0E14] border border-white/[0.08] text-white text-[11px] focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  placeholder="Action Title"
                  className="col-span-2 px-2.5 py-1.5 rounded-lg bg-[#0C0E14] border border-white/[0.08] text-white text-[11px] focus:outline-none focus:border-blue-500"
                />
              </div>
              <textarea
                rows={2}
                value={newStepDesc}
                onChange={(e) => setNewStepDesc(e.target.value)}
                placeholder="Tactical movement description..."
                className="w-full p-2.5 rounded-lg bg-[#0C0E14] border border-white/[0.08] text-white text-[11px] focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addStep}
                className="w-full py-2 rounded-xl bg-[#07080B] hover:bg-blue-500/10/40 text-blue-300 border border-white/[0.08] hover:border-blue-500 font-bold text-[11px] transition-all"
              >
                + Append Event to Timeline
              </button>
            </div>

            {/* Step Sequence List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {timelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveClipIndex(idx);
                    setActiveCamera(step.camera_view || "Tactical View");
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeClipIndex === idx
                      ? "bg-blue-500/10/40 border-cyan-500/60 shadow-md shadow-cyan-500/20 text-cyan-200"
                      : "bg-[#07080B] border-white/[0.08]/90 hover:border-white/[0.1]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-300 font-bold flex items-center justify-center text-[10px] border border-white/[0.08]">
                        {step.step || idx + 1}
                      </span>
                      <span className="font-bold text-white">{step.title}</span>
                    </div>
                    <span className="text-blue-400 font-bold">{step.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2">
                    {step.description}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/[0.08] text-[10px] text-slate-500">
                    <span>Camera: {step.camera_view}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStep(idx);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSynthesizeVideo}
              disabled={status === "PROCESSING"}
              className="w-full py-3 rounded-xl btn-coral-gradient text-white font-bold font-orbitron text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${status === "PROCESSING" ? "animate-spin" : ""}`} />
              <span>{status === "PROCESSING" ? "Rendering Simulation..." : "Synthesize Schematic Reconstruction"}</span>
            </button>

          </div>

          {/* Legal Compliance Box */}
          <div className="p-4 rounded-2xl bg-red-950/20 border border-blue-500/30/40 space-y-2 font-mono text-xs shadow-lg">
            <div className="text-blue-500 font-bold flex items-center space-x-1.5 text-[11px]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>LEGAL STATUTORY COMPLIANCE:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              Reconstruction models utilize schematic/mannequin actor representations to comply with statutory standards barring deepfakes or speculative photographic depictions of real individuals.
            </p>
          </div>

        </div>

        {/* Right Column (7 Cols): Schematic Video Reconstruction Player */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-2xl space-y-4">
            
            {/* Player Top Bar (Live Status & Camera Selector) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-red-400 font-bold uppercase tracking-wider">REC LIVE SIMULATION</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-bold">{activeCamera}</span>
              </div>

              <div className="flex items-center space-x-2 text-[11px]">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <select
                  value={activeCamera}
                  onChange={(e) => setActiveCamera(e.target.value)}
                  className="bg-[#07080B] border border-white/[0.08] rounded-xl px-2.5 py-1 text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="South Corridor Cam 04">South Corridor Cam 04</option>
                  <option value="Teller Overhead Cam 01">Teller Overhead Cam 01</option>
                  <option value="West Alleyway Cam 02">West Alleyway Cam 02</option>
                  <option value="Tactical 3D Free Angle">Tactical 3D Free Angle</option>
                </select>
              </div>
            </div>

            {/* Video Player Display Screen */}
            <div className="relative rounded-2xl bg-[#07080B] border border-white/[0.08]/90 h-[420px] overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              
              {/* Tactical Top Overlay */}
              <div className="flex items-center justify-between z-10 font-mono text-xs text-blue-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span>TIME: {timelineSteps[activeClipIndex]?.timestamp || "00:00:03"}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  EVENT #{activeClipIndex + 1} OF {timelineSteps.length}
                </div>
              </div>

              {/* Schematic Animated Graphic Representation (SVG Simulation) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" className="w-full h-full opacity-90">
                  <defs>
                    <pattern id="simGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#12273f" stroke-width="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="700" height="400" fill="#060911" />
                  <rect width="700" height="400" fill="url(#simGrid)" />

                  {/* Room Wireframe Walls */}
                  <rect x="80" y="60" width="540" height="280" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.6"/>
                  <line x1="80" y1="180" x2="350" y2="180" stroke="#2563eb" stroke-width="2" opacity="0.4"/>

                  {/* Camera Target Crosshairs */}
                  <circle cx="350" cy="200" r="45" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
                  <line x1="350" y1="140" x2="350" y2="260" stroke="#3b82f6" stroke-width="1" opacity="0.3"/>
                  <line x1="290" y1="200" x2="410" y2="200" stroke="#3b82f6" stroke-width="1" opacity="0.3"/>

                  {/* Schematic Stylized Actor: Suspect Mannequin */}
                  <g transform={`translate(${activeClipIndex === 0 ? 180 : activeClipIndex === 1 ? 350 : 520}, 200)`} className="transition-all duration-700">
                    <circle cx="0" cy="-25" r="14" fill="#ef4444" stroke="#fca5a5" stroke-width="2" />
                    <line x1="0" y1="-11" x2="0" y2="25" stroke="#ef4444" stroke-width="5" stroke-linecap="round" />
                    <line x1="-18" y1="0" x2="18" y2="0" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
                    <line x1="0" y1="25" x2="-14" y2="55" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
                    <line x1="0" y1="25" x2="14" y2="55" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
                    <rect x="-40" y="-55" width="80" height="18" rx="2" fill="#090d14" stroke="#ef4444" stroke-width="1"/>
                    <text x="0" y="-43" fill="#ef4444" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">
                      SUSPECT #1
                    </text>
                  </g>

                  {/* Guard Mannequin in step 2 */}
                  {activeClipIndex === 1 && (
                    <g transform="translate(440, 200)">
                      <circle cx="0" cy="-25" r="14" fill="#3b82f6" stroke="#93c5fd" stroke-width="2" />
                      <line x1="0" y1="-11" x2="0" y2="25" stroke="#3b82f6" stroke-width="5" stroke-linecap="round" />
                      <line x1="-18" y1="0" x2="18" y2="0" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" />
                      <line x1="0" y1="25" x2="-14" y2="55" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" />
                      <line x1="0" y1="25" x2="14" y2="55" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" />
                      <rect x="-40" y="-55" width="80" height="18" rx="2" fill="#090d14" stroke="#3b82f6" stroke-width="1"/>
                      <text x="0" y="-43" fill="#60a5fa" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">
                        WITNESS GUARD
                      </text>
                    </g>
                  )}

                  {/* Tactical Trajectory Line */}
                  <path d="M 180 200 L 350 200 L 520 200" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" />
                </svg>
              </div>



              {/* Mandatory Persistent Watermark Strip */}
              <div className="z-10 text-center py-1 bg-red-950/80 border border-blue-500/30 text-[11px] font-mono text-red-200 font-bold tracking-widest uppercase rounded">
                AI RECONSTRUCTION: ILLUSTRATIVE ONLY, NOT ACTUAL FOOTAGE
              </div>

            </div>

            {/* Video Controls (Scrubber, Play, Step) */}
            <div className="p-3.5 rounded-2xl bg-[#07080B] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={togglePlayback}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-600 text-white transition-all shadow-md shadow-sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setActiveClipIndex(0);
                    setIsPlaying(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/[0.08] transition-colors"
                  title="Reset to 00:00:00"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <span className="text-blue-400 font-bold">
                  {timelineSteps[activeClipIndex]?.timestamp || "00:00:03"} / 00:00:{duration}
                </span>
              </div>

              {/* Clip Scrubber Buttons */}
              <div className="flex items-center space-x-1.5 rounded-full bg-black/60 p-1 border border-white/[0.08]/90">
                {timelineSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveClipIndex(idx)}
                    className={`px-3 py-1 rounded-full font-bold transition-all text-xs ${
                      activeClipIndex === idx
                        ? "bg-blue-600 text-white shadow-md shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Clip {idx + 1}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

