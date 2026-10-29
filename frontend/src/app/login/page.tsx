"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, UserCheck, AlertCircle, Key, BadgeAlert, ArrowRight, ShieldAlert } from "lucide-react";
import { api, setAuthToken } from "@/lib/api";
import { useApp } from "@/lib/store";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useApp();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("marcus.vance@sketchforce.gov");
  const [password, setPassword] = useState("police2026");
  const [fullName, setFullName] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [department, setDepartment] = useState("Metro Police - Forensic Division");
  const [role, setRole] = useState("Investigator");

  useEffect(() => {
    const redirectUrl = searchParams.get("redirect") || (typeof window !== "undefined" ? sessionStorage.getItem("sketchforce_redirect") : null);
    const notice = typeof window !== "undefined" ? sessionStorage.getItem("sketchforce_auth_notice") : null;
    if (notice) {
      setRedirectNotice(notice);
      sessionStorage.removeItem("sketchforce_auth_notice");
    } else if (redirectUrl) {
      setRedirectNotice(`Official clearance session required to access ${redirectUrl}. Please authenticate.`);
    }
  }, [searchParams]);

  const getTargetUrl = () => {
    const redirect = searchParams.get("redirect") || (typeof window !== "undefined" ? sessionStorage.getItem("sketchforce_redirect") : null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("sketchforce_redirect");
    }
    return redirect || "/dashboard";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      router.push(getTargetUrl());
    } catch (err: any) {
      setError(err.message || "Authentication failed. Verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.register({
        email,
        password,
        full_name: fullName,
        badge_number: badgeNumber,
        department,
        role,
      });
      // Automatically login after registration
      const res = await api.login({ email, password });
      setUser(res.user);
      router.push(getTargetUrl());
    } catch (err: any) {
      setError(err.message || "Registration failed. Verify badge or email.");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill preset credentials for instant demo flow
  const selectQuickProfile = (profEmail: string, profRole: string) => {
    setEmail(profEmail);
    setPassword("police2026");
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-tactical-grid">
      <div className="max-w-md w-full space-y-6">
        
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-police-blue/80 via-blue-900 to-[#0F131A] border border-white/[0.08] flex items-center justify-center shadow-lg shadow-sm">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-orbitron tracking-wider">
            OFFICIAL ACCESS PORTAL
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[11px] text-blue-400/90 font-mono uppercase tracking-widest">
              CJIS Level 4 Authentication Standard
            </p>
          </div>
        </div>

        {/* Redirect / Re-authentication Friendly Notice */}
        {redirectNotice && (
          <div className="p-3.5 rounded-2xl bg-white/[0.05]/40 border border-blue-500/40/50 text-amber-200 text-xs font-mono flex items-center space-x-2.5 shadow-lg shadow-amber-950/40 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-slate-300 shrink-0" />
            <span className="leading-relaxed">{redirectNotice}</span>
          </div>
        )}

        {/* Quick Demo Credential Selector Pill Bar */}
        <div className="p-3.5 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-xl text-xs">
          <div className="text-[10px] font-mono text-blue-400 tracking-widest uppercase mb-2.5 font-bold flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Fast Demo Credential Switcher</span>
            </span>
            <span className="text-slate-300 font-mono bg-white/[0.05]/40 px-2 py-0.5 rounded border border-blue-500/40/30">
              Pass: police2026
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => selectQuickProfile("marcus.vance@sketchforce.gov", "Investigator")}
              className={`p-2 rounded-xl border text-left transition-all ${
                email === "marcus.vance@sketchforce.gov"
                  ? "bg-blue-500/10/40 border-cyan-500/60 text-cyan-200 shadow-sm shadow-cyan-500/20"
                  : "bg-[#07080B] border-white/[0.08] text-slate-400 hover:bg-slate-900 hover:border-white/[0.1] hover:text-slate-200"
              }`}
            >
              <div className="font-bold text-white">Det. Vance</div>
              <div className="text-[9px] text-blue-400">Investigator #4921</div>
            </button>

            <button
              type="button"
              onClick={() => selectQuickProfile("elena.rostova@sketchforce.gov", "Forensic Artist")}
              className={`p-2 rounded-xl border text-left transition-all ${
                email === "elena.rostova@sketchforce.gov"
                  ? "bg-white/[0.05]/40 border-blue-500/40/60 text-amber-200 shadow-sm shadow-amber-500/20"
                  : "bg-[#07080B] border-white/[0.08] text-slate-400 hover:bg-slate-900 hover:border-white/[0.1] hover:text-slate-200"
              }`}
            >
              <div className="font-bold text-white">E. Rostova</div>
              <div className="text-[9px] text-slate-300">Forensic Artist #882</div>
            </button>

            <button
              type="button"
              onClick={() => selectQuickProfile("admin@sketchforce.gov", "Admin")}
              className={`p-2 rounded-xl border text-left transition-all ${
                email === "admin@sketchforce.gov"
                  ? "bg-red-950/40 border-red-500/60 text-red-200 shadow-sm shadow-red-500/20"
                  : "bg-[#07080B] border-white/[0.08] text-slate-400 hover:bg-slate-900 hover:border-white/[0.1] hover:text-slate-200"
              }`}
            >
              <div className="font-bold text-white">Cmdr. Reed</div>
              <div className="text-[9px] text-red-400">Command Admin #001</div>
            </button>

            <button
              type="button"
              onClick={() => selectQuickProfile("viewer@sketchforce.gov", "Viewer")}
              className={`p-2 rounded-xl border text-left transition-all ${
                email === "viewer@sketchforce.gov"
                  ? "bg-blue-500/10/40 border-emerald-500/60 text-emerald-200 shadow-sm shadow-emerald-500/20"
                  : "bg-[#07080B] border-white/[0.08] text-slate-400 hover:bg-slate-900 hover:border-white/[0.1] hover:text-slate-200"
              }`}
            >
              <div className="font-bold text-white">Agent Chen</div>
              <div className="text-[9px] text-blue-400">Oversight Viewer #104</div>
            </button>
          </div>
        </div>

        {/* Tab Switcher - Pill Style */}
        <div className="flex rounded-full bg-black/60 p-1 border border-white/[0.08]/90 font-mono text-xs">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-center rounded-full font-bold transition-all ${
              tab === "login"
                ? "bg-blue-600 text-white shadow-md shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Terminal Sign In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-center rounded-full font-bold transition-all ${
              tab === "register"
                ? "bg-blue-600 text-white shadow-md shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Officer Enrollment
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center space-x-2 shadow-lg shadow-red-950/40">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Forms */}
        <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08]/90 shadow-2xl">
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                  OFFICER / AGENT EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all placeholder:text-slate-600"
                  placeholder="officer@department.gov"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                  SECURITY PASSCODE
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all placeholder:text-slate-600"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl btn-coral-gradient text-white font-bold font-orbitron text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-950/50 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>AUTHORIZE ACCESS</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                  FULL NAME & RANK
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 transition-all placeholder:text-slate-600"
                  placeholder="Det. Sarah Connor"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                    BADGE NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all placeholder:text-slate-600"
                    placeholder="9942"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                    ROLE CLEARANCE
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all"
                  >
                    <option value="Investigator">Investigator</option>
                    <option value="Forensic Artist">Forensic Artist</option>
                    <option value="Admin">Admin</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                  DEPARTMENT / DIVISION
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                  OFFICIAL EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all placeholder:text-slate-600"
                  placeholder="officer@department.gov"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1.5">
                  PASSCODE
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07080B] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl btn-coral-gradient text-white font-bold font-orbitron text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-950/40 disabled:opacity-50"
              >
                {loading ? "ENROLLING..." : "REGISTER OFFICIAL ACCOUNT"}
              </button>
            </form>
          )}
        </div>

        {/* Security Advisory Strip */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          <BadgeAlert className="w-3.5 h-3.5 inline mr-1 text-slate-300" />
          Unlawful access to this terminal is monitored and logged under Federal Criminal Code 18 U.S.C. § 1030.
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center font-mono text-blue-400 text-xs">
        INITIALIZING OFFICIAL ACCESS GATEWAY...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

