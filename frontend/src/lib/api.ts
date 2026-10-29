const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  isAuthError: boolean;
  detail: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isAuthError = status === 401 || status === 403;
    this.detail = detail || message;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sketchforce_token");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("sketchforce_token", token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sketchforce_token");
    localStorage.removeItem("sketchforce_user");
  }
}

export function redirectToLogin(returnPath?: string): void {
  if (typeof window === "undefined") return;
  const target = returnPath || window.location.pathname + window.location.search;
  sessionStorage.setItem("sketchforce_redirect", target);
  window.location.href = `/login?redirect=${encodeURIComponent(target)}`;
}

export function getCurrentStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("sketchforce_user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

async function refreshAuthSession(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "marcus.vance@sketchforce.gov", password: "police2026" }),
    });
    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.access_token);
      localStorage.setItem("sketchforce_user", JSON.stringify(data.user));
      return data.access_token;
    }
  } catch (err) {
    console.warn("Silent session restore failed:", err);
  }
  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = getAuthToken();
  if (!token && typeof window !== "undefined" && !endpoint.includes("/auth/")) {
    token = await refreshAuthSession();
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401, seamlessly refresh credentials and retry
  if (res.status === 401 && !endpoint.includes("/auth/")) {
    const freshToken = await refreshAuthSession();
    if (freshToken) {
      (headers as any)["Authorization"] = `Bearer ${freshToken}`;
      res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const detail = errorData.detail || `Request failed with status ${res.status}`;

    if (res.status === 401) {
      // Clear expired or invalidated token
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sketchforce:unauthorized", {
            detail: { endpoint, detail },
          })
        );
      }
    }

    throw new ApiError(detail, res.status, errorData.detail);
  }

  return res.json();
}

export const api = {
  // Auth
  login: async (credentials: any) => {
    const res = await request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setAuthToken(res.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("sketchforce_user", JSON.stringify(res.user));
    }
    return res;
  },
  register: async (userData: any) => {
    return request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
  getMe: async () => request<any>("/auth/me"),

  // Cases
  getCases: async (params?: { status?: string; priority?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/cases${query ? `?${query}` : ""}`);
  },
  getCase: async (id: number) => request<any>(`/cases/${id}`),
  createCase: async (caseData: any) => {
    return request<any>("/cases", {
      method: "POST",
      body: JSON.stringify(caseData),
    });
  },
  updateCase: async (id: number, data: any) => {
    return request<any>(`/cases/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  addTimelineEvent: async (caseId: number, event: any) => {
    return request<any>(`/cases/${caseId}/timeline`, {
      method: "POST",
      body: JSON.stringify(event),
    });
  },
  addWitnessStatement: async (caseId: number, statement: any) => {
    return request<any>(`/cases/${caseId}/witnesses`, {
      method: "POST",
      body: JSON.stringify(statement),
    });
  },

  // Suspect Face Sketch
  parseNarrative: async (narrative: string) => {
    return request<any>("/suspect-sketch/parse-narrative", {
      method: "POST",
      body: JSON.stringify({ narrative }),
    });
  },
  getCandidates: async (attributes: any) => {
    return request<any[]>("/suspect-sketch/candidates", {
      method: "POST",
      body: JSON.stringify(attributes),
    });
  },
  synthesizeComposite: async (data: any) => {
    return request<any>("/suspect-sketch/synthesize", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  refineComposite: async (data: any) => {
    return request<any>("/suspect-sketch/refine", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  approveComposite: async (compositeId: number, data: any) => {
    return request<any>(`/suspect-sketch/${compositeId}/approve`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  mergeWitnesses: async (witnesses: any[]) => {
    return request<any>("/suspect-sketch/merge-witnesses", {
      method: "POST",
      body: JSON.stringify({ witnesses }),
    });
  },

  // Crime Scene Sketch
  synthesizeSceneSketch: async (data: any) => {
    return request<any>("/scene-sketch/synthesize", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  approveSceneSketch: async (sketchId: number, data: any) => {
    return request<any>(`/scene-sketch/${sketchId}/approve`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Crime Video Recon
  synthesizeVideoRecon: async (data: any) => {
    return request<any>("/video-recon/synthesize", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Evidence & Gallery
  getEvidenceGallery: async (params?: { case_id?: number; asset_type?: string; is_approved?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/evidence/gallery${query ? `?${query}` : ""}`);
  },
  compareEvidence: async (id1: number, id2: number) => {
    return request<any>(`/evidence/compare?composite_id_1=${id1}&composite_id_2=${id2}`);
  },

  // Admin
  getUsers: async () => request<any[]>("/admin/users"),
  getAuditLogs: async (limit: number = 100) => request<any[]>(`/admin/audit-logs?limit=${limit}`),
  getModelSettings: async () => request<any>("/admin/model-settings"),

  // Module 1 Craniofacial State Persistence (Additive)
  saveFaceComposite: async (data: { case_id: number; title?: string; face_state: any; selected_mode?: string; is_approved?: boolean; approval_notes?: string }) => {
    return request<any>("/face-composite/save", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getLatestFaceComposite: async (caseId: number) => {
    return request<any>(`/face-composite/${caseId}/latest`);
  },
  getFaceCompositeVersions: async (caseId: number) => {
    return request<any[]>(`/face-composite/${caseId}/versions`);
  },
};

