"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  ArrowRight, 
  UserSquare2, 
  MapPin, 
  Video, 
  Lock, 
  Check, 
  ChevronRight, 
  Activity, 
  Search,
  Scale,
  BrainCircuit,
  Fingerprint,
  Sliders,
  Layers,
  Sparkles
} from "lucide-react";
import { useApp } from "@/lib/store";

export default function LandingPage() {
  const { t } = useApp();
  const [activePreviewTab, setActivePreviewTab] = useState<"pencil" | "realistic" | "dual">("dual");

  return (
    <div className="relative overflow-hidden bg-[#07080B]">
      
      {/* Subtle Ambient Radial Lighting (Linear style) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37, 99, 235, 0.3), transparent 70%)"
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Institutional Pill Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Next-Generation Law Enforcement Intelligence</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.08]">
            Accelerate Suspect Identification <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
              From Witness Memory to Evidence
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Bridge the critical forensic artist shortage. Transform witness narratives into mathematically accurate 2D composites, structured crime scenes, and video leads in minutes.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/suspect-sketch"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center space-x-2 transition-all"
          >
            <span>Launch Suspect Studio</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            href="/cases"
            className="px-5 py-2.5 rounded-lg bg-[#12151D] hover:bg-[#181C26] active:bg-[#1E2330] text-slate-200 border border-white/10 font-medium text-sm flex items-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search Case Files</span>
          </Link>
        </div>

        {/* Comparative Metrics / Speed Stats */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.08] p-px rounded-xl overflow-hidden border border-white/[0.08]">
          <div className="bg-[#0C0E14] p-5">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Traditional Method</div>
            <div className="text-2xl font-bold text-slate-400 font-mono mt-1 line-through decoration-slate-600">
              72+ Hours
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Specialist queue backlog</div>
          </div>

          <div className="bg-[#0C0E14] p-5">
            <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider flex items-center space-x-1">
              <span>EyeWitness AI</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 font-mono mt-1">
              4.8 Minutes
            </div>
            <div className="text-[11px] text-slate-400 mt-1">First usable visual lead</div>
          </div>

          <div className="bg-[#0C0E14] p-5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Accuracy Gain</div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
              +42%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Multi-witness consensus</div>
          </div>

          <div className="bg-[#0C0E14] p-5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Audit Security</div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
              100%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">SHA-256 chain of custody</div>
          </div>
        </div>

        {/* Product Interface Showcase */}
        <div className="mt-14 max-w-5xl mx-auto rounded-xl border border-white/[0.1] bg-[#0C0E14] p-2 shadow-2xl">
          <div className="rounded-lg bg-[#07080B] border border-white/[0.06] p-4 sm:p-6 space-y-4">
            
            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs font-mono font-medium text-slate-300">
                  CASE STUDIO: SF-2026-0492 // SUSPECT MORPHOMETRY
                </span>
              </div>
              <div className="flex items-center space-x-1 p-0.5 bg-white/[0.04] rounded-md border border-white/[0.08] text-xs">
                <button
                  onClick={() => setActivePreviewTab("dual")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    activePreviewTab === "dual" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Dual View
                </button>
                <button
                  onClick={() => setActivePreviewTab("pencil")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    activePreviewTab === "pencil" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Charcoal
                </button>
                <button
                  onClick={() => setActivePreviewTab("realistic")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    activePreviewTab === "realistic" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Realistic
                </button>
              </div>
            </div>

            {/* Split Interactive View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Canvas: Forensic Charcoal */}
              {(activePreviewTab === "dual" || activePreviewTab === "pencil") && (
                <div className="relative aspect-[4/5] max-h-[380px] mx-auto w-full bg-[#12151D] rounded-lg border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-4">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/[0.08]">
                    MODE: FORENSIC GRAPHITE HATCHING
                  </div>
                  {/* Vector SVG Blueprint Representation */}
                  <svg viewBox="0 0 400 500" className="w-full h-full max-h-[320px]">
                    <circle cx="200" cy="220" r="110" fill="#181C26" stroke="#475569" strokeWidth="2" strokeDasharray="3,3" />
                    <ellipse cx="200" cy="230" rx="85" ry="120" fill="#0C0E14" stroke="#94A3B8" strokeWidth="2.5" />
                    {/* Jaw & Chin contour */}
                    <path d="M 115 220 Q 120 320 200 350 Q 280 320 285 220" fill="none" stroke="#CBD5E1" strokeWidth="2.5" />
                    {/* Eyes */}
                    <ellipse cx="160" cy="210" rx="18" ry="9" fill="#181C26" stroke="#94A3B8" strokeWidth="1.5" />
                    <circle cx="160" cy="210" r="5" fill="#CBD5E1" />
                    <ellipse cx="240" cy="210" rx="18" ry="9" fill="#181C26" stroke="#94A3B8" strokeWidth="1.5" />
                    <circle cx="240" cy="210" r="5" fill="#CBD5E1" />
                    {/* Brows */}
                    <path d="M 135 198 Q 160 190 185 197" fill="none" stroke="#CBD5E1" strokeWidth="3" />
                    <path d="M 215 197 Q 240 190 265 198" fill="none" stroke="#CBD5E1" strokeWidth="3" />
                    {/* Nose */}
                    <path d="M 200 210 L 196 265 L 208 268" fill="none" stroke="#94A3B8" strokeWidth="2" />
                    {/* Mouth */}
                    <path d="M 175 295 Q 200 302 225 295" fill="none" stroke="#94A3B8" strokeWidth="2" />
                    {/* Hairline */}
                    <path d="M 125 180 Q 200 130 275 180" fill="none" stroke="#94A3B8" strokeWidth="3" />
                  </svg>
                  <div className="w-full h-1 bg-blue-600 mt-2"></div>
                </div>
              )}

              {/* Right Canvas: Realistic Forensic Reference */}
              {(activePreviewTab === "dual" || activePreviewTab === "realistic") && (
                <div className="relative aspect-[4/5] max-h-[380px] mx-auto w-full bg-[#12151D] rounded-lg border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-4">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-blue-400 bg-black/60 px-2 py-0.5 rounded border border-blue-500/20">
                    MODE: REALISTIC FORENSIC REFERENCE
                  </div>
                  {/* Layered Realistic Shaded Representation */}
                  <svg viewBox="0 0 400 500" className="w-full h-full max-h-[320px]">
                    <defs>
                      <radialGradient id="previewSkin" cx="50%" cy="45%" r="50%">
                        <stop offset="0%" stopColor="#C49A78" />
                        <stop offset="70%" stopColor="#8C6246" />
                        <stop offset="100%" stopColor="#5E3F2B" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="200" cy="230" rx="85" ry="120" fill="url(#previewSkin)" />
                    {/* Eyes realistic */}
                    <ellipse cx="160" cy="210" rx="18" ry="9" fill="#F1F5F9" />
                    <circle cx="160" cy="210" r="7" fill="#3D2817" />
                    <circle cx="158" cy="208" r="2" fill="#FFFFFF" />
                    <ellipse cx="240" cy="210" rx="18" ry="9" fill="#F1F5F9" />
                    <circle cx="240" cy="210" r="7" fill="#3D2817" />
                    <circle cx="238" cy="208" r="2" fill="#FFFFFF" />
                    {/* Eyebrows */}
                    <path d="M 135 198 Q 160 190 185 197" fill="none" stroke="#261A12" strokeWidth="4" />
                    <path d="M 215 197 Q 240 190 265 198" fill="none" stroke="#261A12" strokeWidth="4" />
                    {/* Nose shadow & bridge */}
                    <path d="M 200 210 L 195 265 Q 200 272 208 268" fill="none" stroke="#3D2817" strokeWidth="2.5" />
                    {/* Lips */}
                    <path d="M 175 295 Q 200 299 225 295" fill="none" stroke="#683428" strokeWidth="3" />
                    {/* Hair */}
                    <path d="M 115 200 Q 120 140 200 135 Q 280 140 285 200 Q 200 170 115 200" fill="#1C140E" />
                  </svg>
                  <div className="w-full h-1 bg-blue-600 mt-2"></div>
                </div>
              )}
            </div>

            {/* Quick Parameter Ribbon */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono border-t border-white/[0.06] gap-2">
              <div className="flex items-center space-x-3">
                <span>JAW: <strong className="text-white">ANGULAR</strong></span>
                <span>•</span>
                <span>HAIR: <strong className="text-white">SHORT CROP</strong></span>
                <span>•</span>
                <span>EYES: <strong className="text-white">ALMOND</strong></span>
              </div>
              <div className="text-[11px] text-blue-400 font-medium">
                CJIS COMPLIANT: INVESTIGATIVE LEAD ONLY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Core Intelligence Modules */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono font-medium text-blue-400 uppercase tracking-wider mb-2">
            Integrated Platform
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-sans">
            Engineered for High-Stakes Forensic Investigations
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Four specialized modules that synthesize eyewitness testimony into actionable leads while maintaining evidentiary integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Suspect Studio */}
          <div className="p-6 rounded-xl bg-[#0C0E14] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <UserSquare2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Suspect Face Studio</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Dedicated 11-section facial feature editor driven by continuous mathematical morphology curves and realistic forensic shaders.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Dual-view pencil & realistic modes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Conversational delta chat updates</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Anatomical construction guides</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Crime Scene */}
          <div className="p-6 rounded-xl bg-[#0C0E14] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Scene Spatial Reconstruction</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Translates witness spatial statements into scale 2D crime scene diagrams with calibrated sightlines, distances, and exit trajectories.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Multi-witness spatial alignment</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Direct measurement annotations</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>High-resolution vector export</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Video Super-Resolution */}
          <div className="p-6 rounded-xl bg-[#0C0E14] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">CCTV Enhancement & Recon</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Reconstructs low-resolution surveillance footage and motion-blurred video frames using temporal super-resolution models.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Frame-by-frame de-blurring</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Biometric feature cross-referencing</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                <span>Original frame integrity preserved</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="rounded-xl bg-[#0C0E14] border border-white/[0.08] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>CJIS Security Policy 5.4 & Evidentiary Safeguards</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Every composite is watermarked as an investigative lead, never identity proof.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              EyeWitness implements cryptographic SHA-256 chain of custody, human-in-the-loop officer sign-off, and strict algorithmic bias mitigation to safeguard witness memory and public trust.
            </p>
          </div>
          <Link
            href="/suspect-sketch"
            className="shrink-0 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Open Active Investigation
          </Link>
        </div>
      </section>
    </div>
  );
}
