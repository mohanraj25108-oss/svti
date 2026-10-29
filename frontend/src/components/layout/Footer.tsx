"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, ExternalLink } from "lucide-react";
import { useApp } from "@/lib/store";

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="w-full bg-[#07080B] border-t border-white/[0.08] text-xs text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/[0.06]">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight text-sm">
                Eye<span className="text-blue-500">Witness</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accelerating forensic composite workflows and investigative leads with precision AI assistance for authorized law enforcement agencies.
            </p>
          </div>

          {/* Core Modules */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 text-xs tracking-wider uppercase font-mono">
              Intelligence Modules
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/suspect-sketch" className="hover:text-white transition-colors">
                  Suspect Face Studio
                </Link>
              </li>
              <li>
                <Link href="/scene-sketch" className="hover:text-white transition-colors">
                  Crime Scene Reconstruction
                </Link>
              </li>
              <li>
                <Link href="/video-recon" className="hover:text-white transition-colors">
                  Video Super-Resolution
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Forensic Asset Repository
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 text-xs tracking-wider uppercase font-mono">
              Compliance & Ethics
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/ethics" className="hover:text-white transition-colors">
                  Ethical AI & Bias Mitigation
                </Link>
              </li>
              <li>
                <span className="text-slate-500">CJIS Policy 5.4 Compliant</span>
              </li>
              <li>
                <span className="text-slate-500">NIST Interagency Standards</span>
              </li>
              <li>
                <span className="text-slate-500">Chain-of-Custody SHA-256 Audit</span>
              </li>
            </ul>
          </div>

          {/* System Security */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 text-xs tracking-wider uppercase font-mono">
              Security
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-medium">Encrypted Enterprise Vault</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                All witness testimonies and biometric vectors are processed locally with cryptographic chain-of-custody logging.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Statutory Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © 2026 EyeWitness Forensics Inc. Authorized government & criminal justice agency deployment.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-mono text-[10px]">CJIS STATUTORY SAFEGUARD: LEADS ONLY</span>
            <span>•</span>
            <span className="text-slate-500 font-mono text-[10px]">ISO/IEC 27001 SECURED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
