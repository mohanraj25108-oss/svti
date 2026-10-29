# SKETCHFORCE: AI Forensic Composite Suite

> **OFFICIAL LAW ENFORCEMENT INVESTIGATIVE LEAD GENERATION PLATFORM**  
> *Accelerating suspect face composites, crime scene diagrams, and video reconstructions from eyewitness testimony.*

---

## 🏛️ Problem Statement
Police departments face a critical shortage of certified forensic sketch artists. Eyewitness memory degrades by over 60% within the first 48 hours of an incident, allowing suspects critical escape windows. **SKETCHFORCE** turns witness narratives, audio interviews, and structured crime scene reports into verified, admissible forensic visual leads in under 4 minutes.

---

## ⚙️ Tech Stack & Architecture
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + Lucide Icons (Optimized for Laptops, Tablets, and Mobile phones)
- **Backend**: FastAPI (Python 3.11) with async REST endpoints and thread-safe sessions
- **Database**: SQLite default (with PostgreSQL connection support) + SQLAlchemy ORM
- **Authentication**: JWT HS256 with Role-Based Access Control (`Admin`, `Investigator`, `Forensic Artist`, `Viewer`)
- **AI Integration Layer**: Clean provider abstraction module supporting instant offline standalone forensic vector synthesis (zero API keys needed out of the box), with plug-and-play config for OpenAI, Gemini, and Stability.
- **Statutory Compliance**: Mandatory watermarking (`COMPOSITE: INVESTIGATIVE LEAD ONLY, NOT EVIDENCE OF IDENTITY`), human-in-the-loop officer approval, and immutable SHA-256 audit logs.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (FastAPI)
```bash
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- API Documentation (Swagger UI): **http://localhost:8000/docs**
- Health Check: **http://localhost:8000/api/health**

### 2. Start the Frontend (Next.js)
```bash
cd frontend
npm run dev
```
- Web Application: **http://localhost:3000**

---

## 🛡️ Pre-Seeded Demo Personnel (Password: `police2026`)
| Role | Name | Email | Badge # | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Investigator** | Det. Marcus Vance | `marcus.vance@sketchforce.gov` | `#4921` | Case management, suspect composite approval, PDF exports |
| **Forensic Artist** | Elena Rostova | `elena.rostova@sketchforce.gov` | `#ART-882` | Dual-mode synthesis, slider adjustments, variants generator |
| **Admin** | Cmdr. Jackson Reed | `admin@sketchforce.gov` | `#ADM-001` | User roles, full audit trail access, model settings |
| **Viewer** | Agent Sarah Chen | `viewer@sketchforce.gov` | `#OBS-104` | Read-only inspection of active cases and evidence |

---

## 📂 Pre-Seeded Investigation Cases
1. **Case SF-2026-0492**: Metro Gold Vault Armored Heist (Armed Robbery // Subterranean commercial depository break-in, multiple witness statements, dual-mode composite, 2D blueprint diagram, video sequence).
2. **Case SF-2026-0718**: Bayview High-End Tech Distribution Burglary (Commercial Burglary // High-tech signal jammer theft, distinctive facial scar, wireframe aviators).
3. **Case SF-2026-0931**: Metro Central Underground Extortion (Platform 3 multi-witness conflict resolution and concordance matrix).

---

## 🎨 Mobile, Tablet & Laptop Responsiveness
- **Laptop / Desktop**: Multi-pane command center layout with real-time side-by-side pencil vs. photographic render comparison, interactive canvas, and collapsible audit inspector.
- **Tablet**: Adaptive dual-column grid with touch-friendly sliders and drag-and-drop evidence tags.
- **Mobile Phone**: Responsive slide-out tactical drawer navigation, stacked candidate cards, voice interview recording button, and mobile PDF preview.

---

## ⚖️ Responsible AI Notice
All generated assets carry persistent statutory watermarks:
- Suspect Composites: `COMPOSITE: INVESTIGATIVE LEAD ONLY, NOT EVIDENCE OF IDENTITY`
- Crime Video Reconstructions: `AI RECONSTRUCTION: ILLUSTRATIVE ONLY, NOT ACTUAL FOOTAGE` (Uses schematic/stylized non-photorealistic mannequin actors to eliminate prejudice).

