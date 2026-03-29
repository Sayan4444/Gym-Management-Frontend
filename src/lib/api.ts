export const API_BASE_URL = "http://localhost:8080/api";

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

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

  const data = await response.json();
  return toCamelCase(data);
}

// API Service functions
export const api = {
  // ----- Auth Routes -----
  googleLogin: (data: any) => fetchApi("/auth/google", { method: "POST", body: JSON.stringify(data) }),
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getMe: () => fetchApi("/auth/me"),

  // ----- Gym Routes -----
  addGym: (data: any) => fetchApi("/gym", { method: "POST", body: JSON.stringify(data) }),
  getGyms: () => fetchApi("/gyms"),
  getGym: (identifier: string) => fetchApi(`/gym/${identifier}`),
  updateGym: (identifier: string, data: any) => fetchApi(`/gym/${identifier}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGym: (identifier: string) => fetchApi(`/gym/${identifier}`, { method: "DELETE" }),

  // ----- Membership Routes -----
  getMembershipPlansByGym: (gymId: number | string) => fetchApi(`/gyms/${gymId}/memberships`),
  getMembershipPlans: () => fetchApi("/memberships"),
  createMembershipPlan: (gymId: number | string, data: any) => fetchApi(`/gyms/${gymId}/memberships`, { method: "POST", body: JSON.stringify(data) }),
  updateMembershipPlan: (gymId: number | string, membershipId: number | string, data: any) => fetchApi(`/gyms/${gymId}/memberships/${membershipId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMembershipPlan: (gymId: number | string, membershipId: number | string) => fetchApi(`/gyms/${gymId}/memberships/${membershipId}`, { method: "DELETE" }),

  // ----- User Routes -----
  getUsers: (gymId?: number | string, isPremium?: boolean, role?: string) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (isPremium) params.append("is_premium", "true");
    if (role) params.append("role", role);
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/users${search}`);
  },
  updateProfile: (id: number | string, data: any) => fetchApi(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProfile: (id: number | string) => fetchApi(`/users/${id}`, { method: "DELETE" }),

  // ----- Subscription Routes -----
  assignSubscription: (data: any) => fetchApi("/subscriptions", { method: "POST", body: JSON.stringify(data) }),
  getSubscriptions: (gymId?: number | string, userId?: number | string) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (userId) params.append("user_id", userId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/subscriptions${search}`);
  },
  updateSubscription: (id: number | string, data: any) => fetchApi(`/subscriptions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSubscription: (id: number | string) => fetchApi(`/subscriptions/${id}`, { method: "DELETE" }),

  // ----- Payment Routes -----
  createOrder: (data: any) => fetchApi("/payment/create-order", { method: "POST", body: JSON.stringify(data) }),
  verifyPayment: (data: any) => fetchApi("/payment/verify", { method: "POST", body: JSON.stringify(data) }),

  // ----- Addon Routes -----
  getAddons: (gymId?: number | string) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/addons${search}`);
  },
  createAddon: (data: any) => fetchApi("/addons", { method: "POST", body: JSON.stringify(data) }),
  updateAddon: (id: number | string, data: any) => fetchApi(`/addons/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAddon: (id: number | string) => fetchApi(`/addons/${id}`, { method: "DELETE" }),

  // ----- Workout Plan Routes -----
  createWorkoutPlan: (data: any) => fetchApi("/workout-plan", { method: "POST", body: JSON.stringify(data) }),
  getWorkoutPlans: () => fetchApi("/workout-plan"),
  updateWorkoutPlan: (id: number | string, data: any) => fetchApi(`/workout-plan/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteWorkoutPlan: (id: number | string) => fetchApi(`/workout-plan/${id}`, { method: "DELETE" }),

  // ----- Attendance Routes -----
  getQRToken: () => fetchApi("/attendance/qr"),
  scanQRAttendance: (data: any) => fetchApi("/attendance/qr/scan", { method: "POST", body: JSON.stringify(data) }),
  markManualAttendance: (userId: number | string, data: any) => fetchApi(`/attendance/${userId}`, { method: "POST", body: JSON.stringify(data) }),

  // ----- Legacy/Other Routes (kept to prevent breaking existing code) -----
  submitDemoRequest: (data: {
    fullName: string;
    mobile: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
  }) => fetchApi("/demo-request", { method: "POST", body: JSON.stringify(data) }),
  getDashboardStats: (gymId?: number | string) => {
    const search = gymId ? `?gym_id=${gymId}` : "";
    return fetchApi(`/dashboard/stats${search}`);
  },
  logAttendance: (data: any) => fetchApi("/attendance", { method: "POST", body: JSON.stringify(data) }),
  getPlans: (gymId?: number | string) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/plans${search}`);
  },
  createPlan: (data: any) => fetchApi("/plans", { method: "POST", body: JSON.stringify(data) }),
  updateMember: (id: number, data: any) => fetchApi(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMember: (id: number) => fetchApi(`/members/${id}`, { method: "DELETE" }),
  buyAddon: (data: { user_id: number; addon_id: number }) => fetchApi(`/addons/buy`, { method: "POST", body: JSON.stringify(data) }),
};
