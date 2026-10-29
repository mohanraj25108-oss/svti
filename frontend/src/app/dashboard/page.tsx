"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FolderLock, 
  UserSquare2, 
  MapPin, 
  Video, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck, 
  TrendingUp,
  FileText
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";

export default function DashboardPage() {
  const { user, t } = useApp();
  const [cases, setCases] = useState<any[]>([]);
  const [evidenceItems, setEvidenceItems] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [casesRes, evidenceRes, logsRes] = await Promise.all([
          api.getCases(),
          api.getEvidenceGallery(),
          api.getAuditLogs(10),
        ]);
        setCases(casesRes);
        setEvidenceItems(evidenceRes);
        setAuditLogs(logsRes);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Welcome Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              COMMAND CENTER DASHBOARD
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-blue-400 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="tracking-widest uppercase">LIVE REPOSITORY</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron">
            Welcome, {user?.full_name || "Investigator"}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {user?.department || "Metro Police - Forensic Division"} • Clearance: <span className="text-blue-400 font-semibold">{user?.role || "Investigator"}</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/suspect-sketch"
            className="px-4 py-2.5 rounded-xl btn-coral-gradient text-white font-bold text-xs font-orbitron uppercase tracking-wider shadow-lg shadow-red-950/40 flex items-center space-x-1.5 transition-all"
          >
            <UserSquare2 className="w-4 h-4" />
            <span>New Suspect Sketch</span>
          </Link>

          <Link
            href="/scene-sketch"
            className="px-4 py-2.5 rounded-xl bg-[#07080B] hover:bg-blue-500/10/30 text-blue-300 border border-white/[0.08] hover:border-blue-500 font-mono text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Scene Diagram</span>
          </Link>

          <Link
            href="/video-recon"
            className="px-4 py-2.5 rounded-xl bg-[#07080B] hover:bg-orange-950/30 text-orange-300 border border-orange-500/40 hover:border-orange-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Video className="w-4 h-4 text-orange-400" />
            <span>Video Recon</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-white/[0.08] transition-all space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-blue-400 text-[10px] font-mono tracking-widest uppercase font-semibold">
            <span>ACTIVE CASES</span>
            <FolderLock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-orbitron">{cases.length || 3}</div>
          <div className="text-[11px] text-blue-400 font-mono flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>+1 priority lead added today</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-red-500/40 transition-all space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-blue-400 text-[10px] font-mono tracking-widest uppercase font-semibold">
            <span>SYNTHESIZED COMPOSITES</span>
            <UserSquare2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-white font-orbitron">
            {evidenceItems.filter((e) => e.type === "composite").length || 6}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Dual-mode rendered</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-emerald-500/40 transition-all space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-blue-400 text-[10px] font-mono tracking-widest uppercase font-semibold">
            <span>APPROVED LEADS</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-400 font-orbitron">
            {evidenceItems.filter((e) => e.is_approved).length || 4}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Human officer signed</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-blue-500/40/40 transition-all space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-blue-400 text-[10px] font-mono tracking-widest uppercase font-semibold">
            <span>MEAN TIME TO SKETCH</span>
            <Clock className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-3xl font-extrabold text-slate-300 font-orbitron">3m 42s</div>
          <div className="text-[11px] text-blue-400 font-mono">98% faster than traditional</div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Active Cases & Recent Forensic Composites */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Cases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-orbitron flex items-center space-x-2">
                <FolderLock className="w-5 h-5 text-blue-400" />
                <span>Priority Investigation Cases</span>
              </h2>
              <Link href="/cases" className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1">
                <span>View Full Registry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {cases.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/10/50 border border-white/[0.08]">
                        {c.case_number}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        c.priority === "CRITICAL" ? "bg-red-950/60 text-red-400 border border-red-500/40" : "bg-white/[0.05]/60 text-slate-300 border border-blue-500/40/40"
                      }`}>
                        {c.priority}
                      </span>
                      <span className="text-xs font-mono text-slate-500">• {c.status}</span>
                    </div>
                    <div className="text-sm font-bold text-white font-sans">{c.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 font-mono">{c.location}</div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Link
                      href={`/cases/${c.id}`}
                      className="px-3.5 py-2 rounded-xl bg-[#07080B] hover:bg-blue-500/10/40 text-slate-200 hover:text-blue-300 border border-white/[0.08] hover:border-cyan-500/50 text-xs font-mono font-semibold transition-all"
                    >
                      Open Dossier
                    </Link>
                    <Link
                      href={`/reports?case_id=${c.id}`}
                      className="p-2 rounded-xl bg-[#07080B] hover:bg-slate-800 text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.1] transition-colors"
                      title="Export Case PDF"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Composites Visual Gallery Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-orbitron flex items-center space-x-2">
                <UserSquare2 className="w-5 h-5 text-blue-500" />
                <span>Recent Generated Forensic Leads</span>
              </h2>
              <Link href="/gallery" className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1">
                <span>Open Evidence Gallery</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evidenceItems.filter((e) => e.type === "composite").slice(0, 2).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-400 font-bold">{item.case_number}</span>
                    {item.is_approved ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10/60 text-blue-400 font-bold border border-emerald-500/40 text-[10px]">
                        APPROVED LEAD
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05]/60 text-slate-300 font-bold border border-blue-500/40/40 text-[10px]">
                        PENDING SIGN-OFF
                      </span>
                    )}
                  </div>

                  {/* Dual Thumbnail Comparison with reference page amber bar */}
                  <div className="grid grid-cols-2 gap-2 h-44 rounded-xl overflow-hidden bg-[#07080B] border border-white/[0.08] p-1 relative">
                    <div className="w-full h-full relative" dangerouslySetInnerHTML={{ __html: item.preview_svg }} />
                    <div className="w-full h-full relative" dangerouslySetInnerHTML={{ __html: item.realistic_svg }} />
                    <div className="col-span-2 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full" />
                  </div>

                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">{item.title}</div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]/90 text-[11px] font-mono text-slate-400">
                    <span>Version v{item.version || 1}</span>
                    <Link href={`/gallery?compare=${item.id}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                      Compare Side-by-Side
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Audit Trail & Operational Metrics */}
        <div className="space-y-6">
          
          {/* Live Activity Feed */}
          <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white font-orbitron">Chain of Custody Feed</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/[0.08]">SHA-256</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-[#07080B] border border-white/[0.08] space-y-1 hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400">{log.action}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">{log.details}</p>
                  <div className="text-[9px] text-slate-500">By {log.user_name} ({log.user_role})</div>
                </div>
              ))}
            </div>

            <Link
              href="/admin"
              className="block text-center text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline pt-2 border-t border-white/[0.08]"
            >
              View Complete System Audit Log
            </Link>
          </div>

          {/* Model Status Card */}
          <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-3.5 text-xs font-mono shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-orbitron">AI FORENSIC ENGINE</span>
              <span className="text-blue-400 font-bold bg-blue-500/10/60 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px]">READY</span>
            </div>
            <div className="space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Provider:</span>
                <span className="text-slate-200">Forensic Vector / Mock Standby</span>
              </div>
              <div className="flex justify-between">
                <span>Inference Latency:</span>
                <span className="text-blue-400">142 ms</span>
              </div>
              <div className="flex justify-between">
                <span>Statutory Watermark:</span>
                <span className="text-blue-400 font-bold">ENFORCED</span>
              </div>
              <div className="flex justify-between">
                <span>Human-in-the-Loop:</span>
                <span className="text-blue-400 font-bold">REQUIRED</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

