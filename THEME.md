# SKETCHFORCE Design System & Theme Specification

This document defines the extracted design tokens and visual hierarchy of the **SKETCHFORCE** platform, based on the **Suspect Face Sketch** studio reference module.

---

## 🎨 Design Tokens

### 1. Surfaces & Backgrounds
| Token | Value | Tailwind / CSS Class | Description |
| :--- | :--- | :--- | :--- |
| `--bg-page` | `#07090D` | `bg-command-bg` / `bg-[#07090D]` | Base page near-black charcoal background with subtle grid overlay |
| `--bg-panel` | `#0F131A` | `bg-command-panel` / `bg-[#0F131A]` | Surface for primary operational panels, cards, and toolbars |
| `--bg-panel-translucent` | `rgba(15, 19, 26, 0.85)` | `glass-panel` | Glassmorphic panel with `backdrop-blur-md` and subtle border |
| `--bg-input` | `#07090D` | `bg-command-input` | Dark recessed input fields, textareas, and option selects |
| `--bg-canvas` | `#000000` | `bg-black` | Pure black backdrop for SVG portraits, blueprints, and videos |

### 2. Borders & Outlines
| Token | Value | Tailwind / CSS Class | Description |
| :--- | :--- | :--- | :--- |
| `--border-subtle` | `rgba(30, 41, 59, 0.8)` | `border-slate-800` | Thin subtle panel border between command modules |
| `--border-focus` | `rgba(0, 229, 255, 0.4)` | `border-cyan-500/40` | Focused or active interactive element border |
| `--border-glow-blue` | `rgba(30, 107, 255, 0.35)` | `border-police-blue/40` | Glow border for active selection and featured viewports |
| `--border-danger` | `rgba(255, 30, 60, 0.4)` | `border-electric-red/40` | Alert and classification warning border |

### 3. Accent Palette
| Token | Value | Description |
| :--- | :--- | :--- |
| `--accent-cyan` | `#00E5FF` / `#38BDF8` | Bright cyan/aqua for active tabs, selected states, micro-labels (`LLM PARSER READY`), and active pill indicators |
| `--accent-coral-from` | `#FF5238` | Coral gradient start for primary call-to-action buttons |
| `--accent-coral-to` | `#FF1E3C` | Electric red gradient end for primary call-to-action buttons |
| `--accent-orange-outline`| `#FB923C` | Red-orange outline for secondary action chips (e.g. *"AI Enhance"*, *"Multi-Witness"*) |
| `--accent-amber` | `#FFB020` / `#FACC15` | Amber/gold slider fill, witness confidence meter, and portrait frame bottom metadata bar |
| `--accent-emerald` | `#00E599` / `#10B981` | Approved official lead status, active online pingers, and verified badges |

### 4. Typography & Labels
- **Display Headings**: Orbitron / Rajdhani (`font-orbitron font-extrabold uppercase tracking-wide text-white`).
- **Micro-Labels & Status**: JetBrains Mono (`font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase`).
- **Body & Captions**: Inter (`font-sans text-xs text-slate-300 leading-relaxed`).
- **Muted Gray**: `text-slate-400` / `text-slate-500`.

### 5. Shapes & Corner Radii
- **Main Panels**: `rounded-2xl` (`16px`).
- **Sub-cards / Inputs**: `rounded-xl` (`12px`) or `rounded-lg` (`8px`).
- **Tabs & Filter Chips**: Pill-shaped `rounded-lg` or `rounded-md` with `px-3 py-1 text-xs font-mono`.

---

## 🛠️ Shared Themed Primitives
Every page in the suite consumes the central tokens defined in `globals.css` and shared components in `@/components/ui/ThemedPrimitives.tsx`:
1. `<ThemedPanel>`: Charcoal glassmorphic card with micro-label title bar and subtle border.
2. `<ThemedButton variant="primary | secondary | outline | danger">`: Primary coral gradient, cyan-outlined secondary, amber warning, or electric red danger.
3. `<PillTabs>`: Pill-shaped active cyan tab controls with instant keyboard accessibility.
4. `<ThemedInput>`, `<ThemedTextarea>`, `<ThemedSelect>`: Deep recessed inputs with focus glow.
5. `<ThemedSlider>`: Dual-tone cyan/amber slider track for attribute adjustments.
6. `<ThemedBadge>`: High-contrast status badges (Approved, Pending, Classified, Fast Mode).

