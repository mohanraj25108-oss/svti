"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "./translations";
import { getCurrentStoredUser, removeAuthToken } from "./api";
import { ToastProvider } from "@/components/ui/Toast";

interface User {
  id: number;
  email: string;
  full_name: string;
  badge_number: string;
  department: string;
  role: string;
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  timeCritical: boolean;
  setTimeCritical: (tc: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  logout: () => void;
  activeCaseId: number | null;
  setActiveCaseId: (id: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [timeCritical, setTimeCritical] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeCaseId, setActiveCaseId] = useState<number | null>(1);

  useEffect(() => {
    const stored = getCurrentStoredUser();
    if (stored) {
      setUser(stored);
    }
    const savedLang = localStorage.getItem("sketchforce_lang") as Language;
    if (savedLang && ["en", "hi", "ta"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("sketchforce_lang", lang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        language,
        setLanguage: handleSetLanguage,
        t,
        timeCritical,
        setTimeCritical,
        theme,
        toggleTheme,
        logout,
        activeCaseId,
        setActiveCaseId,
      }}
    >
      <div className={theme === "dark" ? "dark bg-[#07090D] min-h-screen text-slate-100" : "bg-slate-100 min-h-screen text-slate-900"}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

