"use client";

import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  Users, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Key, 
  RefreshCw,
  Lock,
  FileCheck
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";

export default function AdminPage() {
  const { user } = useApp();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [modelSettings, setModelSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [logSearch, setLogSearch] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [uList, logs, settings] = await Promise.all([
        api.getUsers().catch(() => []),
        api.getAuditLogs(100).catch(() => []),
        api.getModelSettings().catch(() => null),
      ]);
      setUsers(uList);
      setAuditLogs(logs);
      setModelSettings(settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.user_name.toLowerCase().includes(logSearch.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(logSearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08]/90 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
              COMMAND & SECURITY OVERSIGHT
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] text-blue-400 tracking-widest uppercase">ADMIN CLEARANCE REQUIRED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-wide flex items-center space-x-3 mt-1">
            <Sliders className="w-7 h-7 text-blue-400" />
            <span>ADMINISTRATIVE GOVERNANCE CONSOLE</span>
          </h1>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 rounded-xl bg-[#07080B] hover:bg-blue-500/10/40 text-blue-300 border border-white/[0.08] hover:border-blue-500 font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Audit Feed</span>
        </button>
      </div>

      {/* Model Providers & System Latency Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-white/[0.08] transition-all space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="font-orbitron">AI INFERENCE LAYER</span>
            </span>
            <span className="text-blue-400 font-bold bg-blue-500/10/60 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px]">ACTIVE</span>
          </div>
          <div className="space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Image Engine:</span>
              <span className="text-white font-bold">{modelSettings?.image_provider || "Forensic Vector (Mock)"}</span>
            </div>
            <div className="flex justify-between">
              <span>NLP Engine:</span>
              <span className="text-white font-bold">{modelSettings?.text_provider || "Rule-Based + LLM Adapter"}</span>
            </div>
            <div className="flex justify-between">
              <span>Video Engine:</span>
              <span className="text-white font-bold">{modelSettings?.video_provider || "Schematic Tactical Vector"}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-white/[0.08] transition-all space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="font-orbitron">SYSTEM LATENCY</span>
            </span>
            <span className="text-blue-400 font-bold bg-blue-500/10/60 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px]">142 MS</span>
          </div>
          <div className="space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>API Gateway:</span>
              <span className="text-blue-400">FastAPI Uvicorn Async</span>
            </div>
            <div className="flex justify-between">
              <span>Database Engine:</span>
              <span className="text-slate-300">SQLite Async / Postgres Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Auth Method:</span>
              <span className="text-slate-300">JWT HS256 Role-Based</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-white/[0.08] transition-all space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-blue-500" />
              <span className="font-orbitron">LEGAL GOVERNANCE</span>
            </span>
            <span className="text-blue-400 font-bold bg-blue-500/10/60 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px]">ENFORCED</span>
          </div>
          <div className="space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Watermarking:</span>
              <span className="text-blue-400 font-bold">MANDATORY</span>
            </div>
            <div className="flex justify-between">
              <span>Officer Approval:</span>
              <span className="text-blue-400 font-bold">MANDATORY</span>
            </div>
            <div className="flex justify-between">
              <span>Audit Logging:</span>
              <span className="text-blue-400 font-bold">IMMUTABLE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Users & Role Management */}
      <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white font-orbitron">SYSTEM USERS & ROLE ASSIGNMENTS</h2>
          </div>
          <span className="text-slate-500">{users.length} Authorized Personnel</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.08] text-blue-400 text-[10px] uppercase tracking-widest">
                <th className="py-2.5">Officer Name</th>
                <th className="py-2.5">Badge #</th>
                <th className="py-2.5">Department</th>
                <th className="py-2.5">Role Clearance</th>
                <th className="py-2.5">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-white">{u.full_name}</td>
                  <td className="py-3 text-blue-400 font-bold">#{u.badge_number}</td>
                  <td className="py-3 text-slate-400">{u.department}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      u.role === "Admin"
                        ? "bg-red-950/60 text-red-400 border border-red-500/40"
                        : u.role === "Investigator"
                        ? "bg-blue-500/10/60 text-blue-300 border border-white/[0.08]"
                        : u.role === "Forensic Artist"
                        ? "bg-white/[0.05]/60 text-slate-300 border border-blue-500/40/40"
                        : "bg-blue-500/10/60 text-blue-400 border border-emerald-500/40"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-blue-400 font-bold">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Audit Trail Explorer */}
      <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white font-orbitron">SYSTEM AUDIT TRAIL & TAMPER LOG</h2>
          </div>
          
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search audit actions or users..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 transition-all placeholder:text-slate-600"
            />
            <Search className="w-3.5 h-3.5 text-blue-400/70 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[#07080B] border border-white/[0.08]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-white/[0.08] transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-400">{log.action}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-bold">{log.user_name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({log.user_role})</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">{log.details}</p>
              </div>

              <div className="text-right shrink-0 text-[10px] text-slate-500">
                <div>{new Date(log.timestamp).toLocaleString()}</div>
                <div>IP: {log.ip_address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

