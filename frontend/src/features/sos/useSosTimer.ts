'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const HOLD_DURATION_MS = 5000; // 5.0 seconds required

interface UseSosTimerOptions {
  onActivate: (idempotencyKey: string) => void;
  onCancel?: () => void;
  onStartHold?: () => void;
  disabled?: boolean;
}

export function useSosTimer({
  onActivate,
  onCancel,
  onStartHold,
  disabled = false
}: UseSosTimerOptions) {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [remainingSeconds, setRemainingSeconds] = useState(5.0);
  const [hintVisible, setHintVisible] = useState(false);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  // Keep latest callbacks in refs to avoid recreating timers on re-render
  const onActivateRef = useRef(onActivate);
  const onCancelRef = useRef(onCancel);
  const onStartHoldRef = useRef(onStartHold);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    onActivateRef.current = onActivate;
    onCancelRef.current = onCancel;
    onStartHoldRef.current = onStartHold;
    disabledRef.current = disabled;
  });

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const intervalTickerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const hasActivatedRef = useRef(false);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cancel hold cleanly and immediately
  const cancelHold = useCallback((reason = 'cancelled') => {
    if (!isHoldingRef.current) return;

    isHoldingRef.current = false;
    startTimeRef.current = null;
    setIsPressing(false);
    setProgress(0);
    setRemainingSeconds(5.0);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (intervalTickerRef.current) {
      clearInterval(intervalTickerRef.current);
      intervalTickerRef.current = null;
    }

    if (!hasActivatedRef.current) {
      setAriaAnnouncement('SOS cancelled');
      if (onCancelRef.current) onCancelRef.current();
    }
  }, []);

  // Monotonic step loop using requestAnimationFrame + performance.now()
  const step = useCallback(() => {
    if (!isHoldingRef.current || startTimeRef.current === null) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const currentProgress = Math.min(1, elapsed / HOLD_DURATION_MS);
    const timeLeft = Math.max(0, (HOLD_DURATION_MS - elapsed) / 1000);

    setProgress(currentProgress);
    setRemainingSeconds(parseFloat(timeLeft.toFixed(1)));

    if (elapsed >= HOLD_DURATION_MS) {
      // Trigger emergency activation exactly once
      isHoldingRef.current = false;
      hasActivatedRef.current = true;
      setIsPressing(false);
      setProgress(1);
      setRemainingSeconds(0);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (intervalTickerRef.current) {
        clearInterval(intervalTickerRef.current);
        intervalTickerRef.current = null;
      }

      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `sos_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      setAriaAnnouncement('SOS activated! Emergency protocol dispatched.');
      if (onActivateRef.current) onActivateRef.current(idempotencyKey);
    } else {
      animFrameRef.current = requestAnimationFrame(step);
    }
  }, []);

  // Start hold
  const startHold = useCallback((e?: React.SyntheticEvent) => {
    if (disabledRef.current || hasActivatedRef.current || isHoldingRef.current) return;

    if (e && e.cancelable) {
      e.preventDefault();
    }

    isHoldingRef.current = true;
    startTimeRef.current = performance.now();
    setIsPressing(true);
    setProgress(0);
    setRemainingSeconds(5.0);
    setAriaAnnouncement('SOS hold started. Keep holding for 5 seconds.');

    if (onStartHoldRef.current) onStartHoldRef.current();

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (intervalTickerRef.current) clearInterval(intervalTickerRef.current);

    animFrameRef.current = requestAnimationFrame(step);
    intervalTickerRef.current = setInterval(step, 60);
  }, [step]);

  // Short tap or normal click handler
  const handleShortClick = useCallback(() => {
    if (hasActivatedRef.current) return;
    setHintVisible(true);
    setAriaAnnouncement('Press and hold for 5 seconds to activate SOS.');
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setHintVisible(false);
    }, 2800);
  }, []);

  // Event handlers for mouse/pointer, touch, keyboard
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    startHold(e);
  }, [startHold]);

  const onPointerUp = useCallback(() => {
    cancelHold();
  }, [cancelHold]);

  const onPointerLeave = useCallback(() => {
    cancelHold();
  }, [cancelHold]);

  const onTouchCancel = useCallback(() => {
    cancelHold();
  }, [cancelHold]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (!isHoldingRef.current) {
        startHold(e);
      }
    }
  }, [startHold]);

  const onKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      cancelHold();
    }
  }, [cancelHold]);

  // Cancel immediately if document becomes hidden (tab switch)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) cancelHold();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (intervalTickerRef.current) clearInterval(intervalTickerRef.current);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, [cancelHold]);

  const resetActivation = useCallback(() => {
    hasActivatedRef.current = false;
    isHoldingRef.current = false;
    setProgress(0);
    setRemainingSeconds(5.0);
    setIsPressing(false);
  }, []);

  return {
    isPressing,
    progress,
    remainingSeconds,
    hintVisible,
    ariaAnnouncement,
    handlers: {
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      onMouseDown: (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        startHold(e);
      },
      onMouseUp: () => cancelHold(),
      onMouseLeave: () => cancelHold(),
      onTouchStart: (e: React.TouchEvent) => startHold(e),
      onTouchEnd: () => cancelHold(),
      onTouchCancel,
      onKeyDown,
      onKeyUp,
      onClick: handleShortClick,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault()
    },
    resetActivation
  };
}
