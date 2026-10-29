"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderLock, Plus, Search, Filter, Calendar, MapPin, ShieldAlert, ArrowRight, X } from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";

export default function CasesPage() {
  const { setActiveCaseId } = useApp();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // New Case form fields
  const [newCaseNumber, setNewCaseNumber] = useState(`SF-2026-0${Math.floor(100 + Math.random() * 900)}`);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Armed Robbery");
  const [newLocation, setNewLocation] = useState("");
  const [newPriority, setNewPriority] = useState("HIGH");
  const [newDescription, setNewDescription] = useState("");

  const loadCases = async () => {
    try {
      setLoading(true);
      const res = await api.getCases({
        search: search || undefined,
        priority: priorityFilter || undefined,
        status: statusFilter || undefined,
      });
      setCases(res);
    } catch (err) {
      console.error("Error loading cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [priorityFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCases();
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCase({
        case_number: newCaseNumber,
        title: newTitle,
        incident_type: newType,
        incident_date: new Date().toISOString(),
        location: newLocation,
        priority: newPriority,
        description: newDescription,
      });
      setModalOpen(false);
      // Reset form
      setNewCaseNumber(`SF-2026-0${Math.floor(100 + Math.random() * 900)}`);
      setNewTitle("");
      setNewLocation("");
      setNewDescription("");
      loadCases();
    } catch (err: any) {
      alert(err.message || "Failed to create case");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08]/90 pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              OFFICIAL EVIDENCE REPOSITORY
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">
              ENCRYPTED CJIS COMPLIANT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-wide flex items-center space-x-3">
            <FolderLock className="w-7 h-7 text-blue-400" />
            <span>CASE MANAGEMENT REPOSITORY</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Official Registry of Active Investigations & Visual Evidence Leads
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl btn-coral-gradient text-white font-bold text-xs font-orbitron uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-red-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Case</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        
        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Case ID, title, or location..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 transition-all placeholder:text-slate-600"
          />
          <Search className="w-4 h-4 text-blue-400/70 absolute left-3 top-3" />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold">PRIORITY:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#07080B] border border-white/[0.08] rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="">ALL</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#07080B] border border-white/[0.08] rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="">ALL</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INVESTIGATION_PENDING">PENDING</option>
              <option value="LEAD_IDENTIFIED">LEAD FOUND</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cases.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-300 px-2.5 py-0.5 rounded-full bg-blue-500/10/50 border border-white/[0.08]">
                  {c.case_number}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  c.priority === "CRITICAL"
                    ? "bg-red-950/60 text-red-400 border border-red-500/40"
                    : c.priority === "HIGH"
                    ? "bg-white/[0.05]/60 text-slate-300 border border-blue-500/40/40"
                    : "bg-blue-950/60 text-blue-400 border border-blue-500/40"
                }`}>
                  {c.priority}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {c.description || "No description logged."}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/[0.08]/90 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400/80 shrink-0" />
                  <span className="truncate">{c.location}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{new Date(c.incident_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]/90">
              <span className="text-[11px] font-mono text-slate-500 uppercase">{c.status}</span>
              <Link
                href={`/cases/${c.id}`}
                onClick={() => setActiveCaseId(c.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#07080B] hover:bg-blue-500/10/40 text-slate-200 hover:text-blue-300 border border-white/[0.08] hover:border-cyan-500/50 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all"
              >
                <span>View Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Register Case Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full rounded-2xl bg-[#0C0E14] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">DOSSIER CREATION</span>
                <h2 className="text-lg font-bold text-white font-orbitron">REGISTER NEW INVESTIGATION FILE</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">CASE ID</label>
                  <input
                    type="text"
                    required
                    value={newCaseNumber}
                    onChange={(e) => setNewCaseNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">PRIORITY</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">INCIDENT TITLE</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Commercial Jeweler Robbery"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">INCIDENT CLASSIFICATION</label>
                <input
                  type="text"
                  required
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">LOCATION / ADDRESS</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. 500 Market St, Financial District"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">INCIDENT NARRATIVE SUMMARY</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Initial incident briefing..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-coral-gradient text-white font-bold font-orbitron text-xs tracking-wider uppercase shadow-lg shadow-red-950/40"
                >
                  Open Official File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

