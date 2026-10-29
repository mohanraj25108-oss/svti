"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  UserSquare2, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  MessageSquare, 
  Layers, 
  Download, 
  ShieldCheck, 
  RefreshCw, 
  Eye, 
  Users, 
  Glasses, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Undo2,
  Redo2,
  Save,
  FileDown,
  Dice5
} from "lucide-react";
import { api, isAuthenticated, ApiError } from "@/lib/api";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

// Facial Feature Editor & Vector Canvas Imports
import { FaceCanvas } from "@/features/face-editor/FaceCanvas";
import { FacialFeatureEditor } from "@/features/face-editor/FacialFeatureEditor";
import { useFaceHistory } from "@/features/face-editor/hooks/useFaceHistory";
import { 
  INITIAL_FACE_STATE, 
  randomizeFaceState 
} from "@/features/face-editor/defaultFaceState";
import { 
  exportHighResPng, 
  exportVectorSvg 
} from "@/features/face-editor/exportUtils";
import { FaceState, FeatureSectionId } from "@/features/face-editor/types";

export default function SuspectSketchPage() {
  const { user, t, timeCritical, activeCaseId } = useApp();
  const { showToast } = useToast();
  const router = useRouter();

  const handleAuthOrApiError = (err: any, fallbackMessage: string) => {
    if (err?.status === 401 || err?.isAuthError || !isAuthenticated()) {
      showToast(
        "Official Clearance Session Expired: Please authenticate with authorized credentials to continue.",
        "warning",
        "AUTHENTICATION REQUIRED",
        4000
      );
      if (typeof window !== "undefined") {
        sessionStorage.setItem("sketchforce_redirect", "/suspect-sketch");
      }
      setTimeout(() => {
        router.push("/login?redirect=/suspect-sketch");
      }, 1200);
      return;
    }
    showToast(err?.message || fallbackMessage, "error", "ERROR OCCURRED");
  };

  // -------------------------------------------------------------
  // SINGLE SOURCE OF TRUTH: Typed FaceState with Undo/Redo History
  // -------------------------------------------------------------
  const {
    state: faceState,
    setState: setFaceState,
    undo,
    redo,
    canUndo,
    canRedo,
    initialState
  } = useFaceHistory(INITIAL_FACE_STATE);

  // Hover preview state for presets
  const [previewState, setPreviewState] = useState<FaceState | null>(null);
  // Before state for comparison slider
  const [beforeState, setBeforeState] = useState<FaceState | null>(INITIAL_FACE_STATE);
  // Active feature section in the dedicated editor
  const [activeFeatureSection, setActiveFeatureSection] = useState<FeatureSectionId>('head_jaw');
  // Visual output display mode
  const [displayMode, setDisplayMode] = useState<"pencil" | "realistic" | "side_by_side">("side_by_side");

  // Tab 1: Input method (narrative, voice, guided)
  const [inputMode, setInputMode] = useState<"narrative" | "voice" | "guided">("narrative");
  const [narrativeText, setNarrativeText] = useState(
    "Male in his mid-30s, sharp angular jawline, short dark buzz cut hair, heavy 5-o'clock stubble, and a distinct thin linear scar cutting across his left cheek. No glasses observed during encounter."
  );

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);

  // Structured attributes matrix
  const [attributes, setAttributes] = useState<any>({
    age_range: "32-37",
    gender: "Male",
    face_shape: "Square",
    skin_tone: "Medium Olive",
    eye_shape: "Almond",
    eye_color: "Dark Brown",
    eyebrows: "Thick Arched",
    nose_shape: "Aquiline / Straight",
    lip_shape: "Medium Straight",
    jawline: "Sharp Angular",
    hair_style: "Short Crop Buzz",
    hair_color: "Black",
    facial_hair: "Heavy Stubble",
    glasses: "None",
    scars_marks: "Linear scar across left cheek",
    headwear: "None",
    clothing: "Dark Utility Jacket",
    confidence_ratings: {
      age_range: 85,
      jawline: 95,
      hair_style: 80,
      scars_marks: 95,
      glasses: 90
    }
  });

  // Candidate faces & current composite
  const [candidates, setCandidates] = useState<any[]>([
    {
      id: "cand-1",
      label: "Candidate A (Primary Concordance)",
      image_url: "/images/candidate_1.png",
      similarity_score: 96.4,
      description: "Primary hand-drawn forensic composite based on witness testimony."
    },
    {
      id: "cand-2",
      label: "Candidate B (Aviator Eyewear Variant)",
      image_url: "/images/candidate_2.png",
      similarity_score: 91.2,
      description: "Suspect with wireframe aviator glasses as reported in second intake."
    },
    {
      id: "cand-3",
      label: "Candidate C (Heavy Stubble Variant)",
      image_url: "/images/candidate_3.png",
      similarity_score: 87.5,
      description: "Submandibular 5-o-clock shadow and jawline stubble."
    },
    {
      id: "cand-4",
      label: "Candidate D (Weathered / Aged Variant)",
      image_url: "/images/candidate_4.png",
      similarity_score: 82.1,
      description: "Pronounced forehead tension furrows and lateral rhytids."
    }
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>({
    id: "cand-1",
    label: "Candidate A (Primary Concordance)",
    image_url: "/images/candidate_1.png",
    similarity_score: 96.4
  });
  const [currentComposite, setCurrentComposite] = useState<any | null>(null);

  // Contradictions and clarifying questions from NLP
  const [contradictions, setContradictions] = useState<any[]>([]);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);

  // Refinement states (Chat & Sliders)
  const [chatPrompt, setChatPrompt] = useState("");
  const [refining, setRefining] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);

  // Multi-witness merge view modal
  const [showMergeView, setShowMergeView] = useState(false);
  const [mergeResult, setMergeResult] = useState<any | null>(null);

  // Human-in-the-loop approval
  const [approvalNotes, setApprovalNotes] = useState("Investigative lead verified against primary witness statement.");
  const [isApproved, setIsApproved] = useState(false);

  // Parsing & synthesis loading states
  const [parsing, setParsing] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  // Web Speech API Voice Recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setNarrativeText((prev) => `${prev} ${transcript}`.trim());
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };
        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Load latest saved FaceState if available
  useEffect(() => {
    const caseId = activeCaseId || 1;
    if (isAuthenticated()) {
      api.getLatestFaceComposite(caseId)
        .then((rec) => {
          if (rec && rec.face_state) {
            setFaceState(rec.face_state);
            setBeforeState(rec.face_state);
            setIsApproved(rec.is_approved);
            if (rec.approval_notes) setApprovalNotes(rec.approval_notes);
            setVersions([rec]);
          }
        })
        .catch(() => {});
    }
  }, [activeCaseId, setFaceState]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      showToast(
        "Speech-to-text is supported on Chrome/Edge browsers. You can also type directly in narrative mode.",
        "info",
        "MICROPHONE INTERFACE"
      );
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  // Step 1: Parse Narrative and update single source of truth FaceState
  const handleParseNarrative = async () => {
    if (!isAuthenticated()) {
      handleAuthOrApiError(new ApiError("Not authenticated", 401), "Authentication required");
      return;
    }
    setParsing(true);
    try {
      const res = await api.parseNarrative(narrativeText);
      if (res.attributes) {
        setAttributes(res.attributes);

        // Map parsed attributes directly into the FaceState single source of truth
        const next = JSON.parse(JSON.stringify(faceState));
        if (res.attributes.face_shape) {
          const s = res.attributes.face_shape.toLowerCase();
          if (s.includes('square')) {
            next.head_jaw.shape = 'square';
            next.head_jaw.width = 1.1;
            next.head_jaw.jaw_angle = 1.25;
            next.head_jaw.chin_shape = 'square';
          } else if (s.includes('round')) {
            next.head_jaw.shape = 'round';
            next.head_jaw.width = 1.15;
            next.head_jaw.jaw_angle = 0.9;
          } else if (s.includes('oblong')) {
            next.head_jaw.shape = 'oblong';
            next.head_jaw.chin_length = 1.25;
          }
        }

        if (res.attributes.hair_style) {
          const h = res.attributes.hair_style.toLowerCase();
          if (h.includes('buzz') || h.includes('crop')) next.hair.style = 'short_buzz';
          else if (h.includes('fade') || h.includes('undercut')) next.hair.style = 'fade_undercut';
          else if (h.includes('wavy')) next.hair.style = 'wavy_parted';
          else if (h.includes('bald') || h.includes('shaved')) next.hair.style = 'shaved_bald';
        }

        if (res.attributes.facial_hair) {
          const fh = res.attributes.facial_hair.toLowerCase();
          if (fh.includes('stubble')) {
            next.facial_hair.beard = 'five_o_clock_stubble';
            next.facial_hair.stubble_density = 0.75;
          } else if (fh.includes('beard')) {
            next.facial_hair.beard = 'full_heavy';
            next.facial_hair.stubble_density = 1.0;
          } else if (fh.includes('clean')) {
            next.facial_hair.beard = 'none';
            next.facial_hair.stubble_density = 0;
          }
        }

        if (res.attributes.glasses) {
          const g = res.attributes.glasses.toLowerCase();
          if (g.includes('wireframe') || g.includes('aviator')) next.glasses.style = 'wireframe_aviator';
          else if (g.includes('rectangular') || g.includes('black')) next.glasses.style = 'black_rectangular';
          else if (g.includes('none')) next.glasses.style = 'none';
        }

        if (res.attributes.scars_marks) {
          next.marks_scars = [
            {
              id: 'scar_parsed_1',
              type: 'linear_scar',
              label: res.attributes.scars_marks,
              x: 38,
              y: 58,
              size: 1.2,
              rotation: -25,
              opacity: 0.9
            }
          ];
        }

        setFaceState(next);
      }
      setContradictions(res.contradictions || []);
      setClarifyingQuestions(res.clarifying_questions || []);

      // Fetch candidate variations
      const cands = await api.getCandidates(res.attributes || attributes);
      setCandidates(cands);
      if (cands.length > 0) {
        setSelectedCandidate(cands[0]);
      }
      showToast("Witness statement parsed and anatomical parameters updated.", "success", "PARSING COMPLETE");
    } catch (err: any) {
      handleAuthOrApiError(err, "Failed to analyze narrative");
    } finally {
      setParsing(false);
    }
  };

  // Step 2: Synthesize Composite
  const handleSynthesize = async () => {
    if (!isAuthenticated()) {
      handleAuthOrApiError(new ApiError("Not authenticated", 401), "Authentication required");
      return;
    }
    setSynthesizing(true);
    try {
      const res = await api.synthesizeComposite({
        case_id: activeCaseId || 1,
        title: "Suspect Face Lead",
        narrative: narrativeText,
        attributes,
        selected_mode: displayMode === "side_by_side" ? "pencil" : displayMode,
        time_critical: timeCritical
      });
      setCurrentComposite(res);
      setIsApproved(res.is_approved);
      setVersions((prev) => [res, ...prev]);

      // Save versioned FaceState
      await api.saveFaceComposite({
        case_id: activeCaseId || 1,
        title: `Composite v${faceState.version}`,
        face_state: faceState,
        selected_mode: displayMode === "side_by_side" ? "pencil" : displayMode,
        is_approved: isApproved,
        approval_notes: approvalNotes
      });

      showToast("Realistic 2D forensic composite rendered and committed.", "success", "SYNTHESIS READY");
    } catch (err: any) {
      handleAuthOrApiError(err, "Failed to synthesize composite");
    } finally {
      setSynthesizing(false);
    }
  };

  // Step 3: Refine via chat prompt or quick chips
  const handleRefine = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatPrompt.trim()) return;

    setRefining(true);
    try {
      const chat = chatPrompt.toLowerCase();
      const next = JSON.parse(JSON.stringify(faceState));
      next.version = (next.version || 1) + 1;

      if (chat.includes("jaw")) {
        if (chat.includes("wider") || chat.includes("broad") || chat.includes("square")) {
          next.head_jaw.width = 1.18;
          next.head_jaw.jaw_angle = 1.35;
          next.head_jaw.shape = "square";
          next.head_jaw.chin_shape = "square";
        } else if (chat.includes("narrow") || chat.includes("sharp")) {
          next.head_jaw.width = 0.94;
          next.head_jaw.jaw_angle = 1.1;
          next.head_jaw.chin_shape = "pointed";
        }
      }
      if (chat.includes("glasses")) {
        if (chat.includes("aviator") || chat.includes("wireframe") || chat.includes("add")) {
          next.glasses.style = "wireframe_aviator";
          next.hidden_features.glasses = false;
        } else if (chat.includes("remove") || chat.includes("none")) {
          next.glasses.style = "none";
        }
      }
      if (chat.includes("age") || chat.includes("older") || chat.includes("wrinkle")) {
        next.skin_age.age_appearance = Math.min(75, next.skin_age.age_appearance + 10);
        next.skin_age.forehead_wrinkles = Math.min(1, next.skin_age.forehead_wrinkles + 0.3);
        next.skin_age.crows_feet = Math.min(1, next.skin_age.crows_feet + 0.25);
        next.skin_age.nasolabial_folds = Math.min(1, next.skin_age.nasolabial_folds + 0.3);
      }
      if (chat.includes("beard") || chat.includes("stubble")) {
        if (chat.includes("clean") || chat.includes("shaven") || chat.includes("remove")) {
          next.facial_hair.beard = "none";
          next.facial_hair.stubble_density = 0;
        } else {
          next.facial_hair.beard = "full_heavy";
          next.facial_hair.stubble_density = 1.0;
          next.hidden_features.facial_hair = false;
        }
      }

      setFaceState(next);
      setChatPrompt("");
      setIsApproved(false);
      showToast(`Refinement applied. New revision v${next.version} generated.`, "success", "REFINEMENT COMMITTED");
    } catch (err: any) {
      handleAuthOrApiError(err, "Refinement failed");
    } finally {
      setRefining(false);
    }
  };

  // Step 4: Approve Lead (Human-in-the-loop)
  const handleApprove = async () => {
    if (!isAuthenticated()) {
      handleAuthOrApiError(new ApiError("Not authenticated", 401), "Authentication required");
      return;
    }
    try {
      setIsApproved(true);
      await api.saveFaceComposite({
        case_id: activeCaseId || 1,
        title: `Officially Approved Composite v${faceState.version}`,
        face_state: faceState,
        selected_mode: displayMode === "side_by_side" ? "pencil" : displayMode,
        is_approved: true,
        approval_notes: approvalNotes
      });
      showToast("Forensic lead officially signed and verified for dissemination.", "success", "APPROVAL CONFIRMED");
    } catch (err: any) {
      handleAuthOrApiError(err, "Approval sign-off failed");
    }
  };

  // Save current FaceState to backend
  const handleSaveComposite = async () => {
    if (!isAuthenticated()) {
      handleAuthOrApiError(new ApiError("Not authenticated", 401), "Authentication required");
      return;
    }
    setIsSavingRecord(true);
    try {
      const rec = await api.saveFaceComposite({
        case_id: activeCaseId || 1,
        title: `Lead Revision v${faceState.version}`,
        face_state: faceState,
        selected_mode: displayMode === "side_by_side" ? "pencil" : displayMode,
        is_approved: isApproved,
        approval_notes: approvalNotes
      });
      setVersions((prev) => [rec, ...prev]);
      setBeforeState(faceState);
      showToast(`Composite parameters v${rec.version} successfully persisted to secure case vault.`, "success", "SAVED TO DATABASE");
    } catch (err: any) {
      handleAuthOrApiError(err, "Failed to save composite");
    } finally {
      setIsSavingRecord(false);
    }
  };

  // High-Res PNG Export (>=2048px)
  const handleExportPng = async () => {
    try {
      const targetSvgId = displayMode === "realistic" ? "face-svg-realistic" : "face-svg-pencil";
      await exportHighResPng(targetSvgId, faceState, {
        caseNumber: `CASE-2026-${String(activeCaseId || 492).padStart(4, '0')}`,
        officerName: user?.full_name || "Det. Marcus Vance",
        badgeNumber: user?.badge_number || "4921",
        isApproved,
        mode: displayMode === "realistic" ? "realistic" : "pencil"
      });
      showToast("High-resolution 2048px forensic PNG exported with statutory CJIS watermark.", "success", "EXPORT COMPLETE");
    } catch (err: any) {
      showToast(err.message || "Failed to export high-res PNG", "error", "EXPORT ERROR");
    }
  };

  // Vector SVG Blueprint Export
  const handleExportSvg = () => {
    try {
      const targetSvgId = displayMode === "realistic" ? "face-svg-realistic" : "face-svg-pencil";
      exportVectorSvg(targetSvgId, faceState, `CASE-2026-${String(activeCaseId || 492).padStart(4, '0')}`);
      showToast("Parametric SVG vector blueprint exported cleanly.", "success", "EXPORT COMPLETE");
    } catch (err: any) {
      showToast(err.message || "Failed to export SVG blueprint", "error", "EXPORT ERROR");
    }
  };

  // Step 5: Multi-Witness Merge
  const handleMultiWitnessMerge = async () => {
    if (!isAuthenticated()) {
      handleAuthOrApiError(new ApiError("Not authenticated", 401), "Authentication required");
      return;
    }
    try {
      const res = await api.mergeWitnesses([
        { witness: "Frank Castiglione", narrative: narrativeText },
        { witness: "Amara Patel", narrative: "Suspect wore a dark baseball cap, was in early 30s, and ran very fast." }
      ]);
      setMergeResult(res);
      setShowMergeView(true);
      showToast("Multi-witness statements cross-referenced and merged.", "info", "MERGE COMPLETE");
    } catch (err: any) {
      handleAuthOrApiError(err, "Merge analysis failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest">
              MODULE 01 // CRANIOFACIAL COMPOSITE SYNTHESIS
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">CASE #SF-2026-0492</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-wide flex items-center space-x-2 mt-1">
            <UserSquare2 className="w-7 h-7 text-blue-500" />
            <span>SUSPECT FACE SKETCH STUDIO</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Multi-Witness Merge */}
          <button
            onClick={handleMultiWitnessMerge}
            className="px-3 py-2 rounded-lg bg-[#0C0E14] hover:bg-slate-800 text-slate-300 border border-white/[0.1] font-mono text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Multi-Witness Merge</span>
          </button>

          {/* Export Dossier Link */}
          <Link
            href={`/reports?case_id=${activeCaseId || 1}`}
            className="px-3.5 py-2 rounded-lg bg-[#0C0E14] hover:bg-slate-800 text-slate-300 border border-white/[0.1] font-mono text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Case Dossier</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Grid (Left: Witness Intake & Attributes, Right: Visual Canvas & Feature Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (5 Cols): Witness Intake & Matrix */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Intake Tabs */}
          <div className="p-4 rounded-2xl bg-[#0C0E14] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                1. EYEWITNESS INTAKE METHOD
              </span>
              <div className="flex space-x-1 text-xs font-mono">
                <button
                  onClick={() => setInputMode("narrative")}
                  className={`px-2.5 py-1 rounded ${inputMode === "narrative" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Narrative
                </button>
                <button
                  onClick={() => setInputMode("voice")}
                  className={`px-2.5 py-1 rounded flex items-center space-x-1 ${inputMode === "voice" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  <Mic className="w-3 h-3" />
                  <span>Voice</span>
                </button>
                <button
                  onClick={() => setInputMode("guided")}
                  className={`px-2.5 py-1 rounded ${inputMode === "guided" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Matrix Form
                </button>
              </div>
            </div>

            {/* Narrative / Voice Box */}
            {inputMode !== "guided" && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={narrativeText}
                    onChange={(e) => setNarrativeText(e.target.value)}
                    placeholder="Enter witness description in plain text or click voice to record..."
                    className="w-full p-3 rounded-lg bg-[#07080B] border border-white/[0.1] text-white text-xs font-sans leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                  {inputMode === "voice" && (
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
                        isRecording 
                          ? "bg-red-600 text-white animate-ping" 
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                      title={isRecording ? "Stop Recording" : "Start Voice Recording"}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {narrativeText.length} characters • Auto-normalized
                  </span>
                  <button
                    onClick={handleParseNarrative}
                    disabled={parsing}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{parsing ? "Parsing Anatomy..." : "Analyze & Extract"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Contradictions & Follow-up Clarifying Questions Alert */}
            {contradictions.length > 0 && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 space-y-1 text-xs font-mono">
                <div className="text-blue-500 font-bold flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>CONTRADICTION DETECTED:</span>
                </div>
                {contradictions.map((c, idx) => (
                  <p key={idx} className="text-red-200 text-[11px] leading-relaxed">
                    • {c.message} <span className="text-slate-400">({c.resolution})</span>
                  </p>
                ))}
              </div>
            )}

            {clarifyingQuestions.length > 0 && (
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 space-y-1 text-xs font-mono">
                <div className="text-blue-400 font-bold">SUGGESTED CLARIFYING QUESTIONS FOR WITNESS:</div>
                {clarifyingQuestions.map((q, idx) => (
                  <p key={idx} className="text-slate-300 text-[11px] leading-relaxed">
                    {idx + 1}. {q}
                  </p>
                ))}
              </div>
            )}

            {/* Structured Questionnaire Matrix Form */}
            <div className="pt-2 border-t border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                STRUCTURED FACIAL ATTRIBUTES MATRIX
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">AGE ESTIMATION</label>
                  <select
                    value={attributes.age_range || "32-37"}
                    onChange={(e) => {
                      setAttributes({ ...attributes, age_range: e.target.value });
                      const age = parseInt(e.target.value.split('-')[0]) || 34;
                      setFaceState({ ...faceState, skin_age: { ...faceState.skin_age, age_appearance: age } });
                    }}
                    className="w-full px-2 py-1.5 rounded bg-[#07080B] border border-white/[0.1] text-white"
                  >
                    <option value="20-25">20-25 Years</option>
                    <option value="26-30">26-30 Years</option>
                    <option value="32-37">32-37 Years</option>
                    <option value="38-45">38-45 Years</option>
                    <option value="46-55">46-55 Years</option>
                    <option value="60-65">60-65 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">FACE SHAPE</label>
                  <select
                    value={attributes.face_shape || "Square"}
                    onChange={(e) => {
                      setAttributes({ ...attributes, face_shape: e.target.value });
                      const shape = e.target.value.toLowerCase() as any;
                      setFaceState({ ...faceState, head_jaw: { ...faceState.head_jaw, shape: shape.includes('square') ? 'square' : 'oval' } });
                    }}
                    className="w-full px-2 py-1.5 rounded bg-[#07080B] border border-white/[0.1] text-white"
                  >
                    <option value="Square">Square Angular</option>
                    <option value="Oval">Oval Balanced</option>
                    <option value="Round">Round Full</option>
                    <option value="Oblong">Oblong Elongated</option>
                    <option value="Heart">Heart Pointed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">HAIR STYLE</label>
                  <select
                    value={attributes.hair_style || "Short Crop Buzz"}
                    onChange={(e) => {
                      setAttributes({ ...attributes, hair_style: e.target.value });
                      const s = e.target.value.toLowerCase();
                      const style = s.includes('buzz') ? 'short_buzz' : s.includes('fade') ? 'fade_undercut' : 'wavy_parted';
                      setFaceState({ ...faceState, hair: { ...faceState.hair, style: style as any } });
                    }}
                    className="w-full px-2 py-1.5 rounded bg-[#07080B] border border-white/[0.1] text-white"
                  >
                    <option value="Short Crop Buzz">Short Crop Buzz</option>
                    <option value="Fade / Undercut">Fade / Undercut</option>
                    <option value="Wavy Tapered">Wavy Tapered</option>
                    <option value="Bald / Shaved">Bald / Shaved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">FACIAL HAIR</label>
                  <select
                    value={attributes.facial_hair || "Heavy Stubble"}
                    onChange={(e) => {
                      setAttributes({ ...attributes, facial_hair: e.target.value });
                      const s = e.target.value.toLowerCase();
                      const beard = s.includes('stubble') ? 'five_o_clock_stubble' : s.includes('beard') ? 'full_heavy' : 'none';
                      setFaceState({ ...faceState, facial_hair: { ...faceState.facial_hair, beard: beard as any } });
                    }}
                    className="w-full px-2 py-1.5 rounded bg-[#07080B] border border-white/[0.1] text-white"
                  >
                    <option value="Clean Shaven">Clean Shaven</option>
                    <option value="Heavy Stubble">Heavy 5-o'clock Stubble</option>
                    <option value="Full Heavy Beard">Full Heavy Beard</option>
                    <option value="Goatee">Goatee with Moustache</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSynthesize}
                disabled={synthesizing}
                className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sm flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${synthesizing ? "animate-spin" : ""}`} />
                <span>{synthesizing ? "SYNTHESIZING COMPOSITE..." : "SYNTHESIZE CRANIOFACIAL LEAD"}</span>
              </button>

            </div>
          </div>

          {/* Candidate Faces Grid */}
          {candidates.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#0C0E14] border border-white/[0.08] space-y-3 shadow-xl">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>SELECT CLOSEST CANDIDATE SEED</span>
                <span className="text-blue-400">{candidates.length} VARIATIONS</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {candidates.map((cand, idx) => (
                  <button
                    key={cand.id}
                    onClick={() => {
                      setSelectedCandidate(cand);
                      // Update FaceState to match the selected candidate's anatomical variations
                      const next = JSON.parse(JSON.stringify(faceState));
                      if (idx === 0) {
                        next.glasses.style = "none";
                        next.facial_hair.stubble_density = 0;
                        next.facial_hair.beard = "none";
                        next.skin_age.age_appearance = 28;
                        next.skin_age.forehead_wrinkles = 0;
                      } else if (idx === 1) {
                        next.glasses.style = "wireframe_aviator";
                        next.hidden_features.glasses = false;
                      } else if (idx === 2) {
                        next.facial_hair.stubble_density = 0.85;
                        next.facial_hair.beard = "stubble_5oclock";
                        next.hidden_features.facial_hair = false;
                      } else if (idx === 3) {
                        next.skin_age.age_appearance = 48;
                        next.skin_age.forehead_wrinkles = 0.75;
                      }
                      setFaceState(next);
                      handleSynthesize();
                    }}
                    className={`p-2 rounded-lg border text-left space-y-1.5 transition-all ${
                      selectedCandidate?.id === cand.id
                        ? "bg-blue-600/20 border-blue-500 ring-1 ring-blue-500"
                        : "bg-[#07080B] border-white/[0.08] hover:border-white/[0.1]"
                    }`}
                  >
                    <div className="h-28 rounded overflow-hidden bg-[#0A0C11] p-1 border border-white/[0.06] flex items-center justify-center">
                      <img
                        src={cand.image_url || `/images/candidate_${(idx % 4) + 1}.png`}
                        alt={cand.label}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-200 truncate">{cand.label}</div>
                    <div className="text-[9px] font-mono text-blue-400">Match: {cand.similarity_score}%</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (7 Cols): Visual Canvas & Facial Feature Editor */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Visual Canvas Frame */}
          <FaceCanvas
            state={faceState}
            previewState={previewState}
            beforeState={beforeState}
            displayMode={displayMode}
            onChangeDisplayMode={setDisplayMode}
            selectedSection={activeFeatureSection}
            onSelectSection={setActiveFeatureSection}
          />

          {/* Master Control Bar: Undo, Redo, Randomize, Save, Exports */}
          <div className="p-3 rounded-2xl bg-[#0C0E14] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center space-x-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-lg bg-[#07080B] hover:bg-slate-800 text-slate-300 border border-white/[0.1] flex items-center space-x-1.5 font-mono text-xs disabled:opacity-40"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Undo</span>
              </button>

              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-lg bg-[#07080B] hover:bg-slate-800 text-slate-300 border border-white/[0.1] flex items-center space-x-1.5 font-mono text-xs disabled:opacity-40"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Redo</span>
              </button>

              <button
                onClick={() => setFaceState(randomizeFaceState(faceState))}
                className="px-3 py-2 rounded-lg bg-[#07080B] hover:bg-slate-800 text-blue-400 border border-white/[0.1] flex items-center space-x-1.5 font-mono text-xs font-bold"
                title="Randomize unlocked facial features"
              >
                <Dice5 className="w-3.5 h-3.5" />
                <span>Randomize All</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveComposite}
                disabled={isSavingRecord}
                className="px-3.5 py-2 rounded-lg bg-[#12151D] hover:bg-slate-800 text-blue-400 border border-blue-500/40 flex items-center space-x-1.5 font-mono text-xs font-bold shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingRecord ? "Saving..." : "Save Revision"}</span>
              </button>

              {/* High-Res PNG Export */}
              <button
                onClick={handleExportPng}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-sm"
                title="Export high-resolution 2048px PNG with statutory watermark"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PNG</span>
              </button>

              {/* Vector SVG Export */}
              <button
                onClick={handleExportSvg}
                className="px-3 py-2 rounded-lg bg-[#07080B] hover:bg-slate-800 text-slate-300 border border-white/[0.1] font-mono text-xs flex items-center space-x-1.5"
                title="Export parametric vector SVG blueprint"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
            </div>
          </div>

          {/* DEDICATED FACIAL FEATURE EDITOR PANEL */}
          <FacialFeatureEditor
            state={faceState}
            onChange={(next) => setFaceState(next)}
            activeSection={activeFeatureSection}
            onSelectSection={setActiveFeatureSection}
            onHoverPreset={setPreviewState}
          />

          {/* Refinement Studio (Chat Commands & Quick Chips) */}
          <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white font-orbitron">
                  CONVERSATIONAL DELTA REFINEMENT
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Natural Language Modification
              </span>
            </div>

            {/* Chat Refinement Command Input */}
            <form onSubmit={handleRefine} className="flex gap-2 font-mono text-xs">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="e.g. 'Make the jaw wider', 'Age by 10 years', 'Add wireframe glasses', 'Heavier beard'..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#07080B] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={refining || !chatPrompt.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-600 text-white font-bold uppercase transition-colors disabled:opacity-50"
              >
                {refining ? "Applying..." : "Apply Prompt"}
              </button>
            </form>

            {/* Quick Refinement Chips */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <button
                onClick={() => {
                  const next = JSON.parse(JSON.stringify(faceState));
                  next.head_jaw.width = 1.2;
                  next.head_jaw.jaw_angle = 1.35;
                  setFaceState(next);
                  showToast("Jawline broadened to square angular archetype.", "info", "DELTA APPLIED");
                }}
                className="px-2.5 py-1 rounded bg-[#07080B] border border-white/[0.1] text-slate-300 hover:border-blue-500"
              >
                + Wider Jaw
              </button>
              <button
                onClick={() => {
                  const next = JSON.parse(JSON.stringify(faceState));
                  if (!next.glasses) next.glasses = { ...INITIAL_FACE_STATE.glasses };
                  if (!next.hidden_features) next.hidden_features = { ...INITIAL_FACE_STATE.hidden_features };
                  next.glasses.style = "wireframe_aviator";
                  next.hidden_features.glasses = false;
                  setFaceState(next);
                  showToast("Wireframe aviator frames attached.", "info", "DELTA APPLIED");
                }}
                className="px-2.5 py-1 rounded bg-[#07080B] border border-white/[0.1] text-slate-300 hover:border-blue-500"
              >
                + Add Glasses
              </button>
              <button
                onClick={() => {
                  const next = JSON.parse(JSON.stringify(faceState));
                  if (!next.skin_age) next.skin_age = { ...INITIAL_FACE_STATE.skin_age };
                  next.skin_age.age_appearance = Math.min(75, (next.skin_age.age_appearance || 34) + 10);
                  next.skin_age.forehead_wrinkles = Math.min(1, (next.skin_age.forehead_wrinkles || 0.2) + 0.35);
                  next.skin_age.crows_feet = Math.min(1, (next.skin_age.crows_feet || 0.2) + 0.3);
                  setFaceState(next);
                  showToast("Age progressed +10 years with periorbital furrows.", "info", "DELTA APPLIED");
                }}
                className="px-2.5 py-1 rounded bg-[#07080B] border border-white/[0.1] text-slate-300 hover:border-blue-500"
              >
                + Age Progression (+10)
              </button>
              <button
                onClick={() => {
                  const next = JSON.parse(JSON.stringify(faceState));
                  if (!next.facial_hair) next.facial_hair = { ...INITIAL_FACE_STATE.facial_hair };
                  if (!next.hidden_features) next.hidden_features = { ...INITIAL_FACE_STATE.hidden_features };
                  next.facial_hair.beard = "full_heavy";
                  next.facial_hair.stubble_density = 1.0;
                  next.hidden_features.facial_hair = false;
                  setFaceState(next);
                  showToast("Full heavy beard applied.", "info", "DELTA APPLIED");
                }}
                className="px-2.5 py-1 rounded bg-[#07080B] border border-white/[0.1] text-slate-300 hover:border-blue-500"
              >
                + Heavy Beard
              </button>
              <button
                onClick={() => {
                  const next = JSON.parse(JSON.stringify(faceState));
                  if (!next.facial_hair) next.facial_hair = { ...INITIAL_FACE_STATE.facial_hair };
                  next.facial_hair.beard = "none";
                  next.facial_hair.stubble_density = 0;
                  setFaceState(next);
                  showToast("Facial hair removed (Clean shaven).", "info", "DELTA APPLIED");
                }}
                className="px-2.5 py-1 rounded bg-[#07080B] border border-white/[0.1] text-slate-300 hover:border-blue-500"
              >
                - Clean Shaven
              </button>
            </div>

            {/* Human-In-The-Loop Approval Box */}
            <div className="p-4 rounded-xl bg-[#07080B] border border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>OFFICIAL HUMAN-IN-THE-LOOP SIGN-OFF</span>
                </span>
                {isApproved ? (
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 text-[10px]">
                    OFFICIALLY APPROVED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10 text-[10px]">
                    PENDING APPROVAL
                  </span>
                )}
              </div>

              <textarea
                rows={2}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Enter investigator authorization remarks..."
                className="w-full p-2.5 rounded bg-[#0C0E14] border border-white/[0.1] text-white font-sans text-xs focus:outline-none"
              />

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-500">
                  Officer: {user?.full_name || "Det. Marcus Vance"} [#{user?.badge_number || "4921"}]
                </span>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1 shadow-md shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sign & Authorize Lead</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Multi-Witness Merge Modal */}
      {showMergeView && mergeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full rounded-2xl bg-[#0C0E14] border border-white/[0.1] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-base font-bold text-white font-orbitron">
                MULTI-WITNESS CONCORDANCE & CONFLICT ANALYSIS
              </h2>
              <button onClick={() => setShowMergeView(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Agreements */}
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="text-blue-400 font-bold">POINTS OF WITNESS AGREEMENT (CONCORDANCE):</div>
                {mergeResult.concordance_agreements?.map((agr: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-slate-300 text-[11px]">
                    <span>• {agr.attribute}: {agr.detail}</span>
                    <span className="text-blue-400 font-bold">{agr.agreement}</span>
                  </div>
                ))}
              </div>

              {/* Conflicts */}
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="text-slate-300 font-bold">WITNESS DIVERGENCES & CONFLICTS:</div>
                {mergeResult.divergences_conflicts?.map((conf: any, idx: number) => (
                  <div key={idx} className="text-slate-300 text-[11px] space-y-0.5">
                    <div className="text-slate-200 font-semibold">• {conf.attribute}: {conf.detail}</div>
                    <div className="text-slate-400 pl-3">Resolution: {conf.recommendation}</div>
                  </div>
                ))}
              </div>

              {/* Recommended Merged Attributes */}
              <div className="p-3 rounded-lg bg-[#07080B] border border-white/[0.08] space-y-1">
                <div className="text-blue-400 font-bold">RECOMMENDED COMPOSITE VECTOR:</div>
                <div className="text-slate-300 text-[11px]">
                  Age: {mergeResult.merged_attributes?.age_range} • Jaw: {mergeResult.merged_attributes?.face_shape} • Scars: {mergeResult.merged_attributes?.scars_marks}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowMergeView(false)}
                  className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
                >
                  Return to Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
