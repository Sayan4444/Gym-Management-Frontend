export const API_BASE_URL = "http://localhost:8080/api";

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API Service functions
export const api = {
  // Public / Unauthenticated
  getGyms: () => fetchApi("/gyms"),
  getGym: (identifier: string) => fetchApi(`/gyms/${identifier}`),
  submitDemoRequest: (data: {
    fullName: string;
    mobile: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
  }) => fetchApi("/demo-request", { method: "POST", body: JSON.stringify(data) }),

  // Auth
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getMe: () => fetchApi("/auth/me"),
  
  // Protected
  getDashboardStats: (gymId?: number) => {
    const search = gymId ? `?gym_id=${gymId}` : "";
    return fetchApi(`/dashboard/stats${search}`);
  },

  getUsers: (gymId?: number, isPremium?: boolean, role?: string) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (isPremium) params.append("is_premium", "true");
    if (role) params.append("role", role);
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/users${search}`);
  },

  updateMember: (id: number, data: any) => 
    fetchApi(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  updateProfile: (data: any) =>
    fetchApi(`/profile`, { method: "PUT", body: JSON.stringify(data) }),

  deleteMember: (id: number) => 
    fetchApi(`/members/${id}`, { method: "DELETE" }),

  getPlans: (gymId?: number) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/plans${search}`);
  },

  createPlan: (data: any) =>
    fetchApi(`/plans`, { method: "POST", body: JSON.stringify(data) }),

  getSubscriptions: (gymId?: number, userId?: number) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (userId) params.append("user_id", userId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/subscriptions${search}`);
  },

  assignSubscription: (data: { user_id: number; plan_id: number }) =>
    fetchApi(`/subscriptions`, { method: "POST", body: JSON.stringify(data) }),

  getAddons: (gymId?: number) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/addons${search}`);
  },

  buyAddon: (data: { user_id: number; addon_id: number }) =>
    fetchApi(`/addons/buy`, { method: "POST", body: JSON.stringify(data) }),

  logAttendance: (data: any) =>
    fetchApi(`/attendance`, { method: "POST", body: JSON.stringify(data) }),
};
