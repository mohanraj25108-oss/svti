"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  Layers, 
  UserSquare2, 
  MapPin, 
  Video, 
  FolderLock, 
  FileText, 
  Sliders, 
  Globe2, 
  LogOut, 
  Menu, 
  X,
  Search
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Language } from "@/lib/translations";

export default function TacticalNavbar() {
  const pathname = usePathname();
  const { user, language, setLanguage, t, logout, activeCaseId } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: t.nav.dashboard, icon: Layers },
    { href: "/cases", label: t.nav.cases, icon: FolderLock },
    { href: "/suspect-sketch", label: t.nav.suspectSketch, icon: UserSquare2 },
    { href: "/scene-sketch", label: t.nav.sceneSketch, icon: MapPin },
    { href: "/video-recon", label: t.nav.videoRecon, icon: Video },
    { href: "/gallery", label: t.nav.evidence, icon: Shield },
    { href: "/reports", label: t.nav.reports, icon: FileText },
    { href: "/admin", label: t.nav.admin, icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080B]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-500 transition-colors">
                <Shield className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans">
                  Eye<span className="text-blue-500">Witness</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-400 border border-white/10 font-mono">
                  v2.4
                </span>
              </div>
            </Link>

            {/* Active Case Indicator */}
            {activeCaseId && (
              <div className="hidden xl:flex items-center space-x-2 ml-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-500 text-[11px]">CASE</span>
                <span className="text-slate-200 font-semibold text-[11px]">SF-2026-0492</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-white/[0.03] rounded-lg border border-white/[0.06]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <select
                aria-label="Select Interface Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border border-white/[0.08] hover:border-white/[0.15] text-slate-300 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="en" className="bg-[#0C0E14] text-white">EN</option>
                <option value="es" className="bg-[#0C0E14] text-white">ES</option>
                <option value="fr" className="bg-[#0C0E14] text-white">FR</option>
                <option value="de" className="bg-[#0C0E14] text-white">DE</option>
                <option value="ar" className="bg-[#0C0E14] text-white">AR</option>
                <option value="hi" className="bg-[#0C0E14] text-white">HI</option>
              </select>
            </div>

            {/* User Session Profile / Login CTA */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/[0.08]">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-200 leading-none">{user.full_name || user.email}</span>
                  <span className="text-[10px] text-blue-400 font-mono mt-0.5">{user.badge_number || user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#0C0E14] px-4 pt-3 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-300 font-medium">{user.full_name}</span>
                <button onClick={logout} className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center rounded-md bg-blue-600 text-white text-xs font-medium block"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
