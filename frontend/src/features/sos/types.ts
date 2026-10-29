export type SosStage = 
  | 'idle'
  | 'pressing'
  | 'cancelled'
  | 'activated'
  | 'sending'
  | 'sent'
  | 'partial_failure'
  | 'resolved';

export interface SosLocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null; // meters
  timestamp: number | null;
  status: 'requesting' | 'acquired' | 'denied' | 'unavailable' | 'idle';
  error?: string;
  isStale?: boolean; // older than 60 seconds
}

export interface SosDeliveryStatus {
  sms: 'pending' | 'delivered' | 'failed' | 'not_configured' | 'sandbox';
  push: 'pending' | 'delivered' | 'failed' | 'not_configured' | 'sandbox';
  audit: 'pending' | 'logged' | 'failed';
  errorMessage?: string;
  sandboxNotice?: string;
}

export interface SosOfficerContact {
  name: string;
  badgeNumber: string;
  department: string;
  phoneNumber?: string; // provided only when active & authenticated
  callSupported: boolean;
}

export interface SosEventPayload {
  idempotencyKey: string;
  caseId?: string;
  userId?: string;
  userBadge?: string;
  timestamp?: string;
  location?: {
    latitude?: number | null;
    longitude?: number | null;
    accuracy?: number | null;
    timestamp?: number | null;
  };
}

export interface SosEventResponse {
  eventId: string;
  status: 'ACTIVE' | 'RESOLVED' | 'FAILED';
  delivery: SosDeliveryStatus;
  officer: SosOfficerContact;
  caseId: string;
  createdAt: string;
  isSandbox: boolean;
}

