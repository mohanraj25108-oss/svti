"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, 
  Filter, 
  Search, 
  UserSquare2, 
  MapPin, 
  Video, 
  Download, 
  Columns, 
  CheckCircle2, 
  Eye, 
  X,
  FileCheck
} from "lucide-react";
import { api } from "@/lib/api";

export default function EvidenceGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Comparison modal states
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareData, setCompareData] = useState<any | null>(null);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const res = await api.getEvidenceGallery({
        asset_type: typeFilter || undefined
      });
      setItems(res);
    } catch (err) {
      console.error("Gallery load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [typeFilter]);

  const openComparison = async (item1: any) => {
    const composites = items.filter((i) => i.type === "composite");
    const item2 = composites.find((i) => i.id !== item1.id) || item1;
    try {
      const res = await api.compareEvidence(item1.id, item2.id);
      setCompareData(res);
      setCompareModalOpen(true);
    } catch (err) {
      alert("Comparison could not be loaded");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08]/90 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              CENTRAL FORENSIC ARCHIVE
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">
              CJIS VERIFIED LEADS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-wide flex items-center space-x-3 mt-1">
            <Shield className="w-7 h-7 text-blue-400" />
            <span>CENTRAL EVIDENCE REPOSITORY</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Catalog of Forensic Composites, Crime Scene Diagrams, and Tactical Reconstructions
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <Filter className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold">FILTER ASSET:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#07080B] border border-white/[0.08] rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
          >
            <option value="">ALL ASSET TYPES</option>
            <option value="composite">Suspect Composites</option>
            <option value="scene">Crime Scene Diagrams</option>
            <option value="video">Video Reconstructions</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10/50 text-blue-300 border border-white/[0.08] font-bold text-[10px]">
                  {item.case_number}
                </span>
                {item.is_approved ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10/60 text-blue-400 border border-emerald-500/40 font-bold text-[10px]">
                    APPROVED LEAD
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05]/60 text-slate-300 border border-blue-500/40/40 font-bold text-[10px]">
                    PENDING SIGN-OFF
                  </span>
                )}
              </div>

              {/* Graphic Thumbnail with Amber Accent Baseline */}
              <div className="h-60 rounded-2xl overflow-hidden bg-[#07080B] p-1 relative border border-white/[0.08] flex flex-col justify-between shadow-inner">
                {item.preview_svg ? (
                  <div className="w-full h-full relative" dangerouslySetInnerHTML={{ __html: item.preview_svg }} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs space-y-2">
                    <Video className="w-10 h-10 text-blue-400 animate-pulse" />
                    <span>SCHEMATIC VIDEO CLIP</span>
                    <span className="text-[10px] text-slate-600">{item.duration_seconds} Seconds Sequence</span>
                  </div>
                )}
                <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <div className="text-[10px] font-mono text-red-400 mt-1 uppercase tracking-wider">
                  {item.watermark}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08]/90 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 text-[10px]">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                {item.type === "composite" && (
                  <button
                    onClick={() => openComparison(item)}
                    className="px-3 py-1.5 rounded-xl bg-[#07080B] hover:bg-blue-500/10/40 text-blue-300 border border-white/[0.08] hover:border-blue-500 text-[11px] font-bold flex items-center space-x-1.5 transition-all"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>
                )}
                <Link
                  href={`/reports?case_id=${item.case_id}`}
                  className="p-2 rounded-xl bg-[#07080B] hover:bg-slate-800 text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
                  title="View in Case Dossier"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {compareModalOpen && compareData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="max-w-4xl w-full rounded-2xl bg-[#0C0E14] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">VERSION COMPARISON ENGINE</span>
                <div className="flex items-center space-x-2">
                  <Columns className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white font-orbitron">
                    SIDE-BY-SIDE FORENSIC COMPARISON & VERSION DELTA
                  </h2>
                </div>
              </div>
              <button onClick={() => setCompareModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
              {/* Asset 1 */}
              <div className="p-4 rounded-2xl bg-[#07080B] border border-white/[0.08]/90 space-y-3 shadow-lg">
                <div className="flex justify-between items-center text-blue-400 font-bold">
                  <span>{compareData.asset_1.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10/60 border border-white/[0.08] text-[10px]">VERSION v{compareData.asset_1.version}</span>
                </div>
                <div className="h-64 rounded-xl overflow-hidden bg-black p-1 flex flex-col justify-between border border-white/[0.08]">
                  <div className="w-full h-full relative" dangerouslySetInnerHTML={{ __html: compareData.asset_1.pencil_svg }} />
                  <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full" />
                </div>
                <div className="text-[10px] text-slate-400">
                  Logged: {new Date(compareData.asset_1.created_at).toLocaleString()}
                </div>
              </div>

              {/* Asset 2 */}
              <div className="p-4 rounded-2xl bg-[#07080B] border border-white/[0.08]/90 space-y-3 shadow-lg">
                <div className="flex justify-between items-center text-blue-400 font-bold">
                  <span>{compareData.asset_2.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10/60 border border-emerald-500/40 text-[10px]">VERSION v{compareData.asset_2.version}</span>
                </div>
                <div className="h-64 rounded-xl overflow-hidden bg-black p-1 flex flex-col justify-between border border-white/[0.08]">
                  <div className="w-full h-full relative" dangerouslySetInnerHTML={{ __html: compareData.asset_2.realistic_svg }} />
                  <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full" />
                </div>
                <div className="text-[10px] text-slate-400">
                  Logged: {new Date(compareData.asset_2.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-5 py-2.5 rounded-xl btn-coral-gradient font-orbitron text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/40"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

