"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldAlert, X } from "lucide-react";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string, duration: number = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#0F131A] border shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 ${
              toast.type === "error"
                ? "border-red-500/60 shadow-red-950/50 text-red-200"
                : toast.type === "warning"
                ? "border-amber-500/60 shadow-amber-950/50 text-amber-200"
                : toast.type === "success"
                ? "border-emerald-500/60 shadow-emerald-950/50 text-emerald-200"
                : "border-cyan-500/60 shadow-cyan-950/50 text-cyan-200"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-electric-red" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === "info" && <ShieldAlert className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                    toast.type === "error"
                      ? "text-red-400"
                      : toast.type === "warning"
                      ? "text-amber-400"
                      : toast.type === "success"
                      ? "text-emerald-400"
                      : "text-cyan-400"
                  }`}
                >
                  {toast.title || (toast.type === "error" ? "SYSTEM ADVISORY // ERROR" : toast.type === "warning" ? "OFFICIAL NOTICE // WARNING" : toast.type === "success" ? "OPERATION VERIFIED" : "TACTICAL DISPATCH")}
                </span>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-500 hover:text-white p-0.5 rounded transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-sans text-slate-200 leading-relaxed break-words">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      toasts: [],
      showToast: (message: string, type: ToastType = "info", title?: string) => {
        console.log(`[Toast ${type.toUpperCase()}] ${title ? title + ": " : ""}${message}`);
      },
      removeToast: () => {},
    };
  }
  return context;
}

