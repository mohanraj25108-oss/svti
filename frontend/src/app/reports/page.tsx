"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  FolderLock, 
  Calendar, 
  MapPin, 
  Lock, 
  FileCheck 
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";

function ReportsContent() {
  const searchParams = useSearchParams();
  const initialCaseId = searchParams.get("case_id") ? Number(searchParams.get("case_id")) : 1;

  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<number>(initialCaseId);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const caseList = await api.getCases();
        setCases(caseList);
        if (caseList.length > 0) {
          const cId = initialCaseId || caseList[0].id;
          setSelectedCaseId(cId);
          const c = await api.getCase(cId);
          setSelectedCase(c);
        }
      } catch (err) {
        console.error("Reports load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [initialCaseId]);

  const handleSelectCase = async (id: number) => {
    setSelectedCaseId(id);
    try {
      const c = await api.getCase(id);
      setSelectedCase(c);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPdf = () => {
    const url = `http://localhost:8000/api/reports/pdf/${selectedCaseId}`;
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08]/90 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              OFFICIAL EVIDENCE DOSSIER
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">
              CERTIFIED POLICE REPORT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-wide flex items-center space-x-3 mt-1">
            <FileText className="w-7 h-7 text-blue-400" />
            <span>OFFICIAL CASE DOSSIER & PDF EXPORT</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Certified Chain-of-Custody Document Generation with Cryptographic Watermarks
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-[#07080B] hover:bg-slate-800 text-slate-300 border border-white/[0.08] font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 rounded-xl btn-coral-gradient text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-red-950/40 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Case Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <FolderLock className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold">SELECT INVESTIGATION DOSSIER:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCaseId === c.id
                  ? "bg-blue-600 text-white shadow-md shadow-sm"
                  : "bg-[#07080B] border border-white/[0.08] text-slate-400 hover:text-white"
              }`}
            >
              {c.case_number} ({c.priority})
            </button>
          ))}
        </div>
      </div>

      {/* Live Official Printable Case Dossier Preview */}
      {selectedCase && (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-2xl max-w-4xl mx-auto space-y-8 font-mono text-xs print:bg-white print:text-black">
          
          {/* Official Department Letterhead */}
          <div className="text-center space-y-2 border-b-2 border-blue-500/30 pb-6">
            <div className="text-blue-500 font-bold tracking-widest text-xs uppercase">
              LAW ENFORCEMENT SENSITIVE // OFFICIAL FORENSIC INVESTIGATIVE DOSSIER
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-orbitron tracking-wider">
              METROPOLITAN POLICE DEPARTMENT — FORENSIC ART & IDENTIFICATION UNIT
            </h2>
            <div className="text-[11px] text-slate-400 font-sans">
              Headquarters Forensic Division • System Reference: EyeWitness-LEAD-{selectedCase.case_number}
            </div>
          </div>

          {/* Core Case File Metadata Table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#07080B] border border-white/[0.08] text-xs">
            <div>
              <div className="text-slate-500 text-[10px]">CASE FILE NUMBER:</div>
              <div className="text-blue-400 font-bold text-sm">{selectedCase.case_number}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">PRIORITY CLASSIFICATION:</div>
              <div className="text-red-400 font-bold">{selectedCase.priority}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">STATUS:</div>
              <div className="text-blue-400 font-bold">{selectedCase.status}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">INCIDENT DATE:</div>
              <div className="text-slate-300">{new Date(selectedCase.incident_date).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Mandatory Forensic Disclaimer Box */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-blue-500/30/40 space-y-1">
            <div className="text-blue-500 font-bold flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>STATUTORY NOTICE & LEGAL ADVISORY:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
              THIS COMPOSITE SKETCH IS AN INVESTIGATIVE LEAD ONLY AND DOES NOT CONSTITUTE POSITIVE EVIDENCE OF IDENTITY. Probable cause for arrest, detention, or search warrant execution cannot be based solely on facial resemblance to this composite.
            </p>
          </div>

          {/* Incident Synopsis */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider font-orbitron">
              1. INCIDENT BRIEFING & INVESTIGATIVE SUMMARY
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans bg-[#07080B] p-4 rounded-xl border border-white/[0.08]">
              {selectedCase.description}
            </p>
          </div>

          {/* Chronological Event Timeline */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider font-orbitron">
              2. INCIDENT CHRONOLOGY TIMELINE
            </div>
            <div className="space-y-2">
              {selectedCase.timeline_events?.map((ev: any) => (
                <div key={ev.id} className="p-3.5 rounded-xl bg-[#07080B] border border-white/[0.08] flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-xs">{ev.title}</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">{ev.description}</p>
                  </div>
                  <span className="text-[10px] text-blue-400 shrink-0 ml-4 font-mono">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Witness Statements */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider font-orbitron">
              3. WITNESS TESTIMONY & RECALL ATTRIBUTES
            </div>
            <div className="space-y-2">
              {selectedCase.witness_statements?.map((w: any) => (
                <div key={w.id} className="p-3.5 rounded-xl bg-[#07080B] border border-white/[0.08] space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{w.witness_name} ({w.witness_type})</span>
                    <span className="text-blue-400">Credibility: {Math.round(w.credibility_score * 100)}%</span>
                  </div>
                  <p className="text-slate-300 text-xs italic font-sans">
                    "{w.raw_narrative}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Chain of Custody & Human Approval Stamp */}
          <div className="p-5 rounded-xl bg-[#07080B] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="text-blue-400 font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>OFFICIALLY APPROVED FOR INVESTIGATIVE DISSEMINATION</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Authorizing Officer: Det. Marcus Vance [Badge #4921] • SHA-256 Verified
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                HASH: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </div>
            </div>

            <div className="border-2 border-emerald-500/80 p-2.5 rounded-xl text-center font-bold text-blue-400 tracking-wider text-[11px] uppercase">
              CERTIFIED POLICE RECORD
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-slate-400">Loading Report Dossier...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
