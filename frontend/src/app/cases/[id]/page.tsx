"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  FolderLock, 
  MapPin, 
  Calendar, 
  UserSquare2, 
  Video, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Download,
  AlertTriangle,
  Radio,
  FileCheck,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = Number(params?.id || 1);
  const { setActiveCaseId } = useApp();

  const [caseData, setCaseData] = useState<any | null>(null);
  const [evidenceItems, setEvidenceItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"timeline" | "witnesses" | "evidence">("timeline");

  // Modals for adding timeline event or witness
  const [timelineModal, setTimelineModal] = useState(false);
  const [witnessModal, setWitnessModal] = useState(false);

  const [tTitle, setTTitle] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tSource, setTSource] = useState("CCTV Camera 04");
  const [tSeverity, setTSeverity] = useState("INFO");

  const [wName, setWName] = useState("");
  const [wType, setWType] = useState("Eyewitness");
  const [wNarrative, setWNarrative] = useState("");

  const loadCase = async () => {
    try {
      setLoading(true);
      const res = await api.getCase(caseId);
      setCaseData(res);
      setActiveCaseId(caseId);
      const evRes = await api.getEvidenceGallery({ case_id: caseId });
      setEvidenceItems(evRes);
    } catch (err) {
      console.error("Failed to load case detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const handleAddTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addTimelineEvent(caseId, {
        timestamp: new Date().toISOString(),
        title: tTitle,
        description: tDesc,
        source: tSource,
        severity: tSeverity,
      });
      setTimelineModal(false);
      setTTitle("");
      setTDesc("");
      loadCase();
    } catch (err: any) {
      alert(err.message || "Failed to add event");
    }
  };

  const handleAddWitness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addWitnessStatement(caseId, {
        witness_name: wName,
        witness_type: wType,
        raw_narrative: wNarrative,
      });
      setWitnessModal(false);
      setWName("");
      setWNarrative("");
      loadCase();
    } catch (err: any) {
      alert(err.message || "Failed to add witness");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-mono text-slate-400">
        <Radio className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
        LOADING CLASSIFIED CASE DOSSIER...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-mono text-blue-500">
        CASE FILE NOT FOUND IN ACTIVE SYSTEM.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Dossier Header */}
      <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/10/50 border border-white/[0.08]">
                {caseData.case_number}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                caseData.priority === "CRITICAL"
                  ? "bg-red-950/60 text-red-400 border border-red-500/40"
                  : "bg-white/[0.05]/60 text-slate-300 border border-blue-500/40/40"
              }`}>
                {caseData.priority} PRIORITY
              </span>
              <span className="text-xs font-mono text-blue-400 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{caseData.status}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron">
              {caseData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{caseData.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Incident Date: {new Date(caseData.incident_date).toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Dossier Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/suspect-sketch?case_id=${caseData.id}`}
              className="px-4 py-2.5 rounded-xl btn-coral-gradient text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-red-950/40 transition-all"
            >
              <UserSquare2 className="w-4 h-4" />
              <span>Generate Suspect</span>
            </Link>

            <Link
              href={`/reports?case_id=${caseData.id}`}
              className="px-4 py-2.5 rounded-xl bg-[#07080B] hover:bg-blue-500/10/30 text-blue-300 border border-white/[0.08] hover:border-blue-500 font-mono text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Export PDF Dossier</span>
            </Link>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-[#07080B] border border-white/[0.08] text-xs text-slate-300 leading-relaxed font-sans">
          <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold mb-1">
            INCIDENT BRIEFING & INVESTIGATIVE SYNOPSIS
          </div>
          {caseData.description || "No description logged for this file."}
        </div>
      </div>

      {/* Tabs Bar - Pill Style */}
      <div className="flex rounded-full bg-black/60 p-1 border border-white/[0.08]/90 font-mono text-xs">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex-1 py-2 text-center rounded-full font-bold transition-all ${
            activeTab === "timeline" ? "bg-blue-600 text-white shadow-md shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Case Timeline ({caseData.timeline_events?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("witnesses")}
          className={`flex-1 py-2 text-center rounded-full font-bold transition-all ${
            activeTab === "witnesses" ? "bg-blue-600 text-white shadow-md shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Witness Statements ({caseData.witness_statements?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`flex-1 py-2 text-center rounded-full font-bold transition-all ${
            activeTab === "evidence" ? "bg-blue-600 text-white shadow-md shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Visual Evidence & Sketches ({evidenceItems.length})
        </button>
      </div>

      {/* Tab 1: Timeline */}
      {activeTab === "timeline" && (
        <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">CHRONOLOGICAL AUDIT</span>
              <h2 className="text-base font-bold text-white font-orbitron">INCIDENT CHRONOLOGY TIMELINE</h2>
            </div>
            <button
              onClick={() => setTimelineModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#07080B] hover:bg-blue-500/10/40 text-blue-300 border border-white/[0.08] hover:border-blue-500 font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Timeline Event</span>
            </button>
          </div>

          <div className="relative pl-6 space-y-6 border-l-2 border-white/[0.08] font-mono text-xs">
            {caseData.timeline_events?.map((ev: any) => (
              <div key={ev.id} className="relative space-y-1">
                <span className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                  ev.severity === "CRITICAL"
                    ? "bg-red-500 border-red-950 shadow-sm shadow-red-500/50"
                    : ev.severity === "WARNING"
                    ? "bg-amber-500 border-amber-950 shadow-sm shadow-amber-500/50"
                    : "bg-cyan-400 border-cyan-950 shadow-sm shadow-cyan-400/50"
                }`}></span>
                
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{ev.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#07080B] border border-white/[0.08] text-[10px] text-blue-400">
                    Source: {ev.source}
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-sans leading-relaxed">
                  {ev.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Witness Statements */}
      {activeTab === "witnesses" && (
        <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">TESTIMONY RECORD</span>
              <h2 className="text-base font-bold text-white font-orbitron">EYEWITNESS STATEMENTS & INTAKE</h2>
            </div>
            <button
              onClick={() => setWitnessModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#07080B] hover:bg-blue-500/10/40 text-blue-300 border border-white/[0.08] hover:border-blue-500 font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Witness Statement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseData.witness_statements?.map((w: any) => (
              <div key={w.id} className="p-4 rounded-2xl bg-[#07080B] border border-white/[0.08]/90 hover:border-white/[0.08] transition-all space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white text-sm">{w.witness_name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10/60 text-blue-400 border border-emerald-500/40 font-bold text-[10px]">
                    Credibility: {Math.round(w.credibility_score * 100)}%
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-500">Type: {w.witness_type}</div>

                <p className="text-xs text-slate-300 font-sans italic bg-[#0C0E14] p-3 rounded-xl border border-white/[0.08] leading-relaxed">
                  "{w.raw_narrative}"
                </p>

                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-xs font-mono">
                  <Link
                    href={`/suspect-sketch?narrative=${encodeURIComponent(w.raw_narrative)}`}
                    className="text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1"
                  >
                    <span>Synthesize from this Statement</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Visual Evidence */}
      {activeTab === "evidence" && (
        <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">EVIDENTIARY ASSETS</span>
              <h2 className="text-base font-bold text-white font-orbitron">ATTACHED FORENSIC COMPOSITES & SCENE VISUALS</h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline"
            >
              View Full Gallery
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {evidenceItems.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#07080B] border border-white/[0.08]/90 hover:border-white/[0.08] transition-all space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-400 uppercase font-bold">{item.type}</span>
                  {item.is_approved ? (
                    <span className="text-blue-400 font-bold bg-blue-500/10/60 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px]">APPROVED LEAD</span>
                  ) : (
                    <span className="text-slate-300 font-bold bg-white/[0.05]/60 border border-blue-500/40/40 px-2 py-0.5 rounded-full text-[10px]">PENDING SIGN-OFF</span>
                  )}
                </div>

                <div className="h-52 rounded-xl overflow-hidden bg-[#07080B] border border-white/[0.08] p-1 relative flex flex-col justify-between">
                  <div className="w-full h-full relative" dangerouslySetInnerHTML={{ __html: item.preview_svg }} />
                  <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full" />
                </div>

                <div className="text-xs font-bold text-white truncate">{item.title}</div>
                <div className="text-[10px] font-mono text-red-400 tracking-wider">
                  {item.watermark}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Timeline Event */}
      {timelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#0C0E14] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">TIMELINE INGESTION</span>
                <h3 className="font-orbitron font-bold text-white">LOG CHRONOLOGICAL EVENT</h3>
              </div>
              <button onClick={() => setTimelineModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddTimeline} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">EVENT TITLE</label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="e.g. Suspect exits South Corridor"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">EVIDENTIARY SOURCE</label>
                <input
                  type="text"
                  value={tSource}
                  onChange={(e) => setTSource(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">SEVERITY / CRITICALITY</label>
                <select
                  value={tSeverity}
                  onChange={(e) => setTSeverity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                >
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={tDesc}
                  onChange={(e) => setTDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl btn-coral-gradient font-orbitron text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/40">
                RECORD EVENT TO DOSSIER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Witness Statement */}
      {witnessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#0C0E14] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">INTAKE INTERVIEW</span>
                <h3 className="font-orbitron font-bold text-white">RECORD WITNESS STATEMENT</h3>
              </div>
              <button onClick={() => setWitnessModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddWitness} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">WITNESS NAME</label>
                <input
                  type="text"
                  required
                  value={wName}
                  onChange={(e) => setWName(e.target.value)}
                  placeholder="e.g. Marcus Aurelius"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">WITNESS ROLE / TYPE</label>
                <select
                  value={wType}
                  onChange={(e) => setWType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                >
                  <option value="Eyewitness">Eyewitness</option>
                  <option value="Victim">Victim</option>
                  <option value="Responding Officer">Responding Officer</option>
                  <option value="Informant">Confidential Informant</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">RAW NARRATIVE / TESTIMONY</label>
                <textarea
                  rows={4}
                  required
                  value={wNarrative}
                  onChange={(e) => setWNarrative(e.target.value)}
                  placeholder="Describe suspect physical appearance, facial attributes, scars, clothing..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white font-sans text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl btn-coral-gradient font-orbitron text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/40">
                SAVE WITNESS TESTIMONY
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

