"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-tactical-grid text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-2xl space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-950/40 border border-red-500/50 flex items-center justify-center text-blue-500 shadow-lg shadow-red-950/40">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          <div className="text-[10px] font-mono text-blue-500 font-bold tracking-widest uppercase">
            CLASSIFICATION CLEARANCE VIOLATION // 404
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-white font-orbitron">
          RESOURCE NOT FOUND
        </h1>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          The requested case file, forensic asset, or terminal route does not exist in the active police registry or has been archived.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl btn-coral-gradient text-white font-orbitron text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

