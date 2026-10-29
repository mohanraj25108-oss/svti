'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SosLocationData } from './types';
import { getAuthToken } from '@/lib/api';

const LOCATION_UPDATE_INTERVAL_MS = 12000; // Update location every 12s while emergency is active
const STALE_THRESHOLD_MS = 60000; // 60s threshold for marking location as "last known / stale"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function useSosLocation(activeEmergencyId: string | null) {
  const [location, setLocation] = useState<SosLocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    status: 'idle'
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Acquire single accurate location with configurable timeout
  const acquireLocation = useCallback((timeoutMs: number = 3000): Promise<SosLocationData> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        const unavail: SosLocationData = {
          latitude: null,
          longitude: null,
          accuracy: null,
          timestamp: Date.now(),
          status: 'unavailable',
          error: 'Browser does not support geolocation'
        };
        setLocation(unavail);
        resolve(unavail);
        return;
      }

      setLocation(prev => ({ ...prev, status: 'requesting' }));

      let hasResolved = false;
      const timer = setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          const timeoutData: SosLocationData = {
            latitude: null,
            longitude: null,
            accuracy: null,
            timestamp: Date.now(),
            status: 'unavailable',
            error: 'GPS signal timeout'
          };
          setLocation(timeoutData);
          resolve(timeoutData);
        }
      }, timeoutMs);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (hasResolved) return;
          hasResolved = true;
          clearTimeout(timer);
          const acquired: SosLocationData = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            timestamp: pos.timestamp || Date.now(),
            status: 'acquired',
            isStale: false
          };
          setLocation(acquired);
          resolve(acquired);
        },
        (err) => {
          if (hasResolved) return;
          hasResolved = true;
          clearTimeout(timer);
          let errorMsg = 'Location acquisition failed';
          let status: SosLocationData['status'] = 'unavailable';

          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = 'Location permission denied by user';
            status = 'denied';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMsg = 'GPS signal unavailable or timeout';
            status = 'unavailable';
          }

          const failed: SosLocationData = {
            latitude: null,
            longitude: null,
            accuracy: null,
            timestamp: Date.now(),
            status,
            error: errorMsg
          };
          setLocation(failed);
          resolve(failed);
        },
        {
          enableHighAccuracy: true,
          timeout: timeoutMs,
          maximumAge: 5000
        }
      );
    });
  }, []);

  // Periodic location stream when emergency is active
  useEffect(() => {
    if (!activeEmergencyId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const token = getAuthToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Initial acquisition on activation
    acquireLocation().then((loc) => {
      if (loc.status === 'acquired' && loc.latitude && loc.longitude) {
        fetch(`${API_BASE_URL}/sos/location`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            eventId: activeEmergencyId,
            latitude: loc.latitude,
            longitude: loc.longitude,
            accuracy: loc.accuracy,
            timestamp: loc.timestamp
          })
        }).catch(e => console.warn('SOS location update sync warning:', e));
      }
    });

    // Setup 12-second periodic update loop
    intervalRef.current = setInterval(async () => {
      const updated = await acquireLocation();
      if (updated.status === 'acquired' && updated.latitude && updated.longitude) {
        fetch(`${API_BASE_URL}/sos/location`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            eventId: activeEmergencyId,
            latitude: updated.latitude,
            longitude: updated.longitude,
            accuracy: updated.accuracy,
            timestamp: updated.timestamp
          })
        }).catch(e => console.warn('SOS interval location update warning:', e));
      }
    }, LOCATION_UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeEmergencyId, acquireLocation]);

  // Compute staleness (>60s)
  const isStale = location.timestamp 
    ? (Date.now() - location.timestamp > STALE_THRESHOLD_MS) 
    : false;

  return {
    location: { ...location, isStale },
    acquireLocation
  };
}
