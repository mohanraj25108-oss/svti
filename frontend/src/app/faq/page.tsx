"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight, FileText, ShieldAlert } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "Can a EyeWitness composite be presented directly as evidence in court?",
      a: "No. Forensic composites are legally classified as investigative leads, not evidence of identity. They serve to focus investigative resources, generate public tips, and assist officers in identifying persons of interest who must then be vetted through independent evidence."
    },
    {
      q: "How does the system handle conflicting witness descriptions?",
      a: "The Multi-Witness Merge module analyzes multiple statements simultaneously. It surfaces an anatomical concordance matrix: attributes with high consensus are highlighted green, while conflicting features (e.g. clean-shaven vs. beard) are flagged to generate multiple parallel lead variants."
    },
    {
      q: "Why does the video reconstruction use schematic stylized actors instead of real video?",
      a: "To eliminate legal prejudice and prevent false identification. Schematic mannequins accurately represent distance, direction, timing, and mechanics without implying real individual facial identities."
    },
    {
      q: "What is Time-Critical Mode?",
      a: "Time-Critical Mode prioritizes rapid batch generation and fast synthesis pipelines for high-priority incidents (e.g. active amber alerts, armed robberies, escapees) where leads are urgently needed within seconds."
    },
    {
      q: "Does the system operate offline or without third-party API keys?",
      a: "Yes. EyeWitness includes high-fidelity standalone mock generators and procedural vector rendering engines that generate authentic forensic sketches, floorplans, and video sequences completely offline with zero external cloud dependencies."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      
      <div className="text-center space-y-2 border-b border-white/[0.08]/90 pb-6">
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">TECHNICAL SOP & DIRECTIVES</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-orbitron">
          INVESTIGATIVE PROCEDURES & FAQ
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Standard Operating Procedures (SOP) & Technical Guidance
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-white/[0.08] transition-all space-y-2 shadow-xl">
            <h3 className="text-sm font-bold text-blue-400 font-mono">
              Q: {f.q}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {f.a}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/suspect-sketch"
          className="px-6 py-3 rounded-xl btn-coral-gradient text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 inline-flex items-center space-x-2"
        >
          <span>Proceed to Suspect Face Studio</span>
        </Link>
      </div>

    </div>
  );
}

