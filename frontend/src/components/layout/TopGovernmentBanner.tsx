"use client";

import React, { useState, useEffect } from "react";
import { Shield, Clock } from "lucide-react";
import { useApp } from "@/lib/store";

export default function TopGovernmentBanner() {
  const { t } = useApp();
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      aria-label="Official Clearance Banner"
      className="w-full text-xs font-mono py-1 px-4 sm:px-8 flex items-center justify-between border-b border-white/[0.06] bg-[#07080B] text-slate-400 z-50 select-none"
    >
      {/* Left: Clearance & Organization */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px] tracking-wide">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">CRIMINAL JUSTICE INFORMATION SERVICES</span>
          <span className="sm:hidden">CJIS</span>
        </div>
        <span className="text-white/[0.12] hidden sm:inline">|</span>
        <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
          {t.classification || "LAW ENFORCEMENT SENSITIVE"}
        </span>
      </div>

      {/* Right: Live UTC & System Status */}
      <div className="flex items-center space-x-4 text-[11px]">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span className="hidden md:inline font-mono text-[10px] text-slate-400">STATUS: OPERATIONAL</span>
        </div>
        <span className="text-white/[0.12] hidden md:inline">•</span>
        <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px]">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{utcTime || "SYNCING UTC..."}</span>
        </div>
      </div>
    </aside>
  );
}
