'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { FaceState } from '../types';

interface UseFaceHistoryReturn {
  state: FaceState;
  setState: (newState: FaceState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  initialState: FaceState;
}

export function useFaceHistory(initialState: FaceState): UseFaceHistoryReturn {
  const [past, setPast] = useState<FaceState[]>([]);
  const [present, setPresent] = useState<FaceState>(initialState);
  const [future, setFuture] = useState<FaceState[]>([]);

  // Keep a ref to latest state and history to avoid stale closures in key listeners
  const stateRef = useRef({ past, present, future });
  useEffect(() => {
    stateRef.current = { past, present, future };
  }, [past, present, future]);

  const setState = useCallback((newState: FaceState) => {
    setPast((prev) => [...prev.slice(-30), present]);
    setPresent(newState);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    const { past: currentPast, present: currentPresent, future: currentFuture } = stateRef.current;
    if (currentPast.length === 0) return;

    const previous = currentPast[currentPast.length - 1];
    const newPast = currentPast.slice(0, currentPast.length - 1);

    setPast(newPast);
    setFuture([currentPresent, ...currentFuture]);
    setPresent(previous);
  }, []);

  const redo = useCallback(() => {
    const { past: currentPast, present: currentPresent, future: currentFuture } = stateRef.current;
    if (currentFuture.length === 0) return;

    const next = currentFuture[0];
    const newFuture = currentFuture.slice(1);

    setPast([...currentPast, currentPresent]);
    setPresent(next);
    setFuture(newFuture);
  }, []);

  // Keyboard shortcut listener: Ctrl+Z (undo), Ctrl+Y / Ctrl+Shift+Z (redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state: present,
    setState,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    historyLength: past.length,
    initialState
  };
}

