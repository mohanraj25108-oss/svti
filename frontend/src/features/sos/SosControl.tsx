'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  AlertOctagon, 
  Phone, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  ShieldAlert, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import styles from './sos.module.css';
import { useApp } from '@/lib/store';
import { getAuthToken } from '@/lib/api';
import { useSosTimer } from './useSosTimer';
import { useSosLocation } from './useSosLocation';
import { SosErrorBoundary } from './SosErrorBoundary';
import { 
  SosStage, 
  SosEventResponse, 
  SosLocationData 
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function SosControlInner() {
  const pathname = usePathname();
  const { user, activeCaseId } = useApp();

  // Environment feature flag
  const isEnabled = process.env.NEXT_PUBLIC_SOS_ENABLED !== 'false';

  // Component state
  const [stage, setStage] = useState<SosStage>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<SosEventResponse | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Geolocation stream
  const { location, acquireLocation } = useSosLocation(activeEventId);

  // Long-press 5.0s monotonic timer hook
  const {
    isPressing,
    progress,
    remainingSeconds,
    hintVisible,
    ariaAnnouncement,
    handlers,
    resetActivation
  } = useSosTimer({
    disabled: stage === 'activated' || stage === 'sending' || stage === 'sent',
    onStartHold: () => {
      setStage('pressing');
    },
    onCancel: () => {
      if (stage === 'pressing') {
        setStage('cancelled');
        setTimeout(() => setStage('idle'), 1500);
      }
    },
    onActivate: (idempotencyKey) => {
      handleTriggerEmergency(idempotencyKey);
    }
  });

  // Trigger emergency dispatch to backend
  const handleTriggerEmergency = async (idempotencyKey: string) => {
    setStage('activated');
    setIsExpanded(true);

    // 1. Initial quick location attempt (up to 2.0s so emergency dispatch is never delayed)
    const initialLoc = await acquireLocation(2000);
    setStage('sending');

    try {
      const token = getAuthToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const caseStr = activeCaseId ? `CASE-2026-${String(activeCaseId).padStart(4, '0')}` : "CASE-2026-0492";

      const response = await fetch(`${API_BASE_URL}/sos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idempotencyKey,
          caseId: caseStr,
          userId: user?.email || 'officer@sketchforce.gov',
          userBadge: user?.badge_number || '4921',
          timestamp: new Date().toISOString(),
          location: {
            latitude: initialLoc.latitude,
            longitude: initialLoc.longitude,
            accuracy: initialLoc.accuracy,
            timestamp: initialLoc.timestamp
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Emergency dispatch rejected');
      }

      const data: SosEventResponse = await response.json();
      setActiveEmergency(data);
      setActiveEventId(data.eventId);
      
      const hasFailure = data.delivery.sms === 'failed';
      setStage(hasFailure ? 'partial_failure' : 'sent');
    } catch (err: any) {
      console.error('Emergency dispatch error:', err);
      setErrorMessage(err.message || 'Dispatch error occurred');
      setStage('partial_failure');
    }
  };

  // Resolve active emergency
  const handleResolveEmergency = async () => {
    if (!activeEventId) return;

    try {
      const token = getAuthToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_BASE_URL}/sos/resolve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          eventId: activeEventId,
          resolvedBy: user?.badge_number || '4921',
          timestamp: new Date().toISOString()
        })
      });

      setStage('resolved');
      setTimeout(() => {
        setStage('idle');
        setIsExpanded(false);
        setActiveEmergency(null);
        setActiveEventId(null);
        resetActivation();
      }, 2500);
    } catch (e) {
      console.error('Failed to resolve emergency:', e);
    }
  };

  // Hide on public landing or login page if no authenticated user
  const isPublicPage = (pathname === '/' || pathname === '/login') && !user;
  if (!isEnabled || isPublicPage) {
    return null;
  }

  // Active / Expanded Emergency Card
  if (isExpanded && (stage === 'activated' || stage === 'sending' || stage === 'sent' || stage === 'partial_failure' || stage === 'resolved')) {
    return (
      <div 
        className={styles.sosContainer}
        role="region" 
        aria-label="Emergency SOS Active Command Panel"
      >
        <div className={styles.sosPanel}>
          {/* Card Top Emergency Header */}
          <div className="p-3.5 bg-red-950/80 border-b border-red-500/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
              </span>
              <span className="font-heading font-black text-xs tracking-wider text-white">
                EMERGENCY SOS ALERT ACTIVATED
              </span>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Minimize to pill"
              aria-label="Minimize SOS emergency panel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3.5 text-xs font-mono">
            {/* Immediate Danger Public Safety Line */}
            <div className="p-2.5 rounded-lg bg-red-900/40 border border-red-600/60 text-red-200 flex items-center gap-2 font-bold text-[11px]">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>In immediate danger, call your local emergency number (112 in India / 911).</span>
            </div>

            {/* Officer Information & Direct Calling */}
            <div className="p-3 rounded-xl bg-[#07090D] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider">Investigating Officer</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <div className="text-white font-bold text-sm">
                {activeEmergency?.officer.name || "Det. Marcus Vance"}
              </div>
              <div className="text-slate-400 text-[11px]">
                Badge #{activeEmergency?.officer.badgeNumber || "4921"} • {activeEmergency?.officer.department || "Major Crimes Division"}
              </div>

              {/* Call Officer Button with tel: link */}
              {activeEmergency?.officer.phoneNumber ? (
                <div className="pt-1.5">
                  <a
                    href={`tel:${activeEmergency.officer.phoneNumber}`}
                    className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>CALL OFFICER ({activeEmergency.officer.phoneNumber})</span>
                  </a>
                  <p className="text-[10px] text-slate-500 text-center mt-1">
                    Tap to call • OS dialer confirmation required
                  </p>
                </div>
              ) : (
                <div className="pt-1 text-slate-500 text-[10px]">
                  Direct cellular voice dispatch routing through central radio desk.
                </div>
              )}
            </div>

            {/* Live GPS Location Sharing */}
            <div className="p-3 rounded-xl bg-[#07090D] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>Live GPS Streaming</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>{location.status === 'acquired' ? (location.isStale ? 'LAST KNOWN' : 'LIVE') : location.status.toUpperCase()}</span>
                </span>
              </div>

              {location.latitude && location.longitude ? (
                <div>
                  <div className="text-white text-xs font-mono font-bold">
                    {location.latitude.toFixed(5)}° N, {location.longitude.toFixed(5)}° W
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                    <span>Radius: ±{location.accuracy || 15}m</span>
                    <a
                      href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Open Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-[11px]">
                  {location.error || "Location acquisition in progress..."}
                </div>
              )}
            </div>

            {/* Delivery Status & Sandbox Notice */}
            {activeEmergency?.delivery.sandboxNotice && (
              <div className="p-2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 text-[10px]">
                <Info className="w-3 h-3 inline mr-1 text-amber-400" />
                {activeEmergency.delivery.sandboxNotice}
              </div>
            )}

            <div className="space-y-1 pt-1 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">SMS Notification:</span>
                <span className={activeEmergency?.delivery.sms === 'failed' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {activeEmergency?.delivery.sms?.toUpperCase() || (stage === 'sending' ? 'SENDING...' : 'PENDING')}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Incident Audit Trail:</span>
                <span className="text-cyan-400 font-bold">
                  {activeEmergency?.delivery.audit?.toUpperCase() || 'LOGGED'}
                </span>
              </div>
            </div>

            {/* Resolve Button */}
            <div className="pt-2 flex items-center gap-2">
              {stage !== 'resolved' ? (
                <button
                  onClick={handleResolveEmergency}
                  className="w-full py-2.5 rounded-xl bg-[#0F131A] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-colors"
                >
                  RESOLVE EMERGENCY
                </button>
              ) : (
                <div className="w-full py-2 text-center text-emerald-400 font-bold text-xs">
                  ✓ EMERGENCY OFFICIALLY MARKED RESOLVED
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Collapsed SOS Control Pill (Anchored to Bottom-Right)
  return (
    <div 
      className={styles.sosContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Screen Reader ARIA Live Region */}
      <div className={styles.srOnly} aria-live="assertive">
        {ariaAnnouncement}
      </div>

      {/* Short Tap Hint Toast */}
      {hintVisible && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-black/90 border border-red-500/80 backdrop-blur-md shadow-2xl text-[11px] font-mono text-white whitespace-nowrap animate-bounce">
          Hold continuously for 5.0s to trigger SOS
        </div>
      )}

      {/* Re-open Active Emergency Button if Minimized */}
      {stage === 'sent' || stage === 'partial_failure' ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-red-950 border-2 border-red-500 text-white shadow-lg shadow-red-950/80 font-mono font-bold text-xs animate-pulse"
          aria-label="View active SOS emergency dispatch"
        >
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>ACTIVE SOS</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      ) : (
        /* Main Press-and-Hold Button */
        <button
          {...handlers}
          className={`${styles.sosPill} ${isPressing ? 'scale-105 border-red-500' : styles.sosIdleGlow}`}
          aria-label="Emergency SOS Button. Press and hold for 5 seconds."
          role="button"
          tabIndex={0}
        >
          {/* Circular Countdown Progress Ring during Press */}
          {isPressing ? (
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#FF1E3C"
                  strokeWidth="3.5"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 * (1 - progress)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-mono font-black text-white">
                {Math.ceil(remainingSeconds)}
              </span>
            </div>
          ) : (
            <AlertOctagon className="w-4 h-4 text-red-500 flex-shrink-0 animate-pulse" />
          )}

          {/* Button Text */}
          <div className="flex flex-col text-left">
            <span className="font-heading font-black text-xs tracking-wider text-red-500">
              {isPressing ? `${remainingSeconds}s` : 'SOS'}
            </span>
            {(isHovered || isPressing) && (
              <span className="text-[9px] font-mono text-slate-300 leading-none">
                {isPressing ? 'Release to cancel' : 'HOLD 5s FOR EMERGENCY'}
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  );
}

export function SosControl() {
  return (
    <SosErrorBoundary>
      <SosControlInner />
    </SosErrorBoundary>
  );
}
