"use client";

import React from "react";

// 1. Themed Panel Container
interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
  headerTag?: string;
  headerRight?: React.ReactNode;
}

export function ThemedPanel({
  children,
  glow = false,
  className = "",
  headerTag,
  headerRight,
  ...props
}: PanelProps) {
  return (
    <div
      className={`p-5 sm:p-6 rounded-xl bg-[#0C0E14] border transition-all ${
        glow
          ? "border-blue-500/40 shadow-[0_0_25px_rgba(37,99,235,0.15)]"
          : "border-white/[0.08] shadow-sm"
      } ${className}`}
      {...props}
    >
      {(headerTag || headerRight) && (
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
          {headerTag && (
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>{headerTag}</span>
            </span>
          )}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// 2. Themed Buttons
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline-orange" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function ThemedButton({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-xs rounded-lg font-medium",
    lg: "px-6 py-2.5 text-sm font-semibold rounded-lg",
  }[size];

  let variantClasses = "";
  if (variant === "primary") {
    variantClasses = "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]";
  } else if (variant === "secondary" || variant === "outline-orange") {
    variantClasses = "bg-[#12151D] hover:bg-[#181C26] active:bg-[#1E2330] text-slate-200 border border-white/10";
  } else if (variant === "danger") {
    variantClasses = "bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200";
  } else {
    variantClasses = "bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-white";
  }

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// 3. Segmented Control / Pill Tabs Group
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface PillTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function PillTabs({
  tabs,
  activeId,
  onChange,
  className = "",
  size = "md",
}: PillTabsProps) {
  return (
    <div className={`flex items-center space-x-1 p-1 bg-[#07080B] border border-white/[0.08] rounded-lg text-xs ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            }`}
          >
            {tab.icon && <span className="w-3.5 h-3.5 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// 4. Micro Header Tag
export function MicroHeader({
  label,
  color = "cyan",
  pulse = false,
  className = "",
}: {
  label: string;
  color?: "cyan" | "coral" | "emerald" | "amber";
  pulse?: boolean;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center space-x-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-300 ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 ${pulse ? "animate-pulse" : ""}`} />
      <span>{label}</span>
    </div>
  );
}

// 5. Themed Badge / Status Chip
export function ThemedBadge({
  status,
  label,
  className = "",
}: {
  status: "approved" | "pending" | "critical" | "high" | "medium" | "active" | "info";
  label?: string;
  className?: string;
}) {
  const styles = {
    approved: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    pending: "bg-white/[0.06] text-slate-300 border-white/10",
    critical: "bg-blue-500/15 text-blue-300 border-blue-500/40 font-semibold",
    high: "bg-white/[0.06] text-slate-300 border-white/10",
    medium: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    active: "bg-blue-600 text-white border-transparent font-medium",
    info: "bg-white/[0.04] text-slate-400 border-white/[0.08]",
  }[status];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border ${styles} ${className}`}>
      {label || status}
    </span>
  );
}

// 6. Themed Input Field
export function ThemedInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/[0.1] text-slate-100 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${props.className || ""}`}
    />
  );
}

// 7. Themed Textarea
export function ThemedTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full p-3 rounded-lg bg-[#07080B] border border-white/[0.1] text-slate-100 text-xs font-sans placeholder:text-slate-600 leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${props.className || ""}`}
    />
  );
}

// 8. Themed Select
export function ThemedSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-2.5 py-1.5 rounded-lg bg-[#07080B] border border-white/[0.1] text-slate-200 text-xs font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${props.children ? "" : ""} ${props.className || ""}`}
    >
      {props.children}
    </select>
  );
}
