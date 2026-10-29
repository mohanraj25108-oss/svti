import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // STRICT TWO-COLOR DESIGN SYSTEM
        // 1. NEUTRAL FOUNDATION: Carbon & Obsidian Scale
        carbon: {
          950: "#07080B", // Canvas root base
          900: "#0C0E14", // Primary panel / card surface
          850: "#12151D", // Elevated sub-surface
          800: "#181C26", // Interactive hover surface
          700: "#222735", // Active surface & strong border
          600: "#2F3647", // Subtle border
          500: "#4B5565", // Muted metadata
          400: "#94A3B8", // Secondary readable text
          300: "#CBD5E1", // Primary muted text
          100: "#F8FAFC", // Titanium primary text
        },

        // 2. SIGNATURE ACCENT: Precision Electric Cobalt
        accent: {
          DEFAULT: "#2563EB", // Primary CTA & active indicator
          hover: "#1D4ED8",   // Hover state
          light: "#60A5FA",   // Light highlight
          muted: "rgba(37, 99, 235, 0.12)", // Subtle wash
          border: "rgba(59, 130, 246, 0.35)", // Accent border
          glow: "rgba(37, 99, 235, 0.25)",    // Ambient glow
        },

        // Backward compatibility mappings (seamlessly collapsed into the 2-color system)
        command: {
          bg: "#07080B",
          panel: "#0C0E14",
          "panel-translucent": "rgba(12, 14, 20, 0.85)",
          input: "#07080B",
          card: "#12151D",
          border: "#1E2330",
          "border-subtle": "rgba(255, 255, 255, 0.08)",
          hover: "#181C26",
        },
        police: {
          blue: "#2563EB",
          "blue-glow": "rgba(37, 99, 235, 0.25)",
        },
        electric: {
          red: "#2563EB",
          "red-glow": "rgba(37, 99, 235, 0.25)",
        },
        alert: {
          amber: "#3B82F6",
          "amber-glow": "rgba(59, 130, 246, 0.2)",
        },
        forensic: {
          cyan: "#3B82F6",
          "cyan-dim": "rgba(37, 99, 235, 0.12)",
          coral: "#2563EB",
          orange: "#2563EB",
          green: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        orbitron: ["Inter", "-apple-system", "sans-serif"], // Replaced with high-clarity typography
      },
      borderRadius: {
        panel: "0.875rem", // 14px
        card: "0.75rem",   // 12px
      },
      boxShadow: {
        "subtle-card": "0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "accent-glow": "0 0 20px -3px rgba(37, 99, 235, 0.35)",
        "inner-light": "inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
      }
    },
  },
  plugins: [],
};
export default config;
