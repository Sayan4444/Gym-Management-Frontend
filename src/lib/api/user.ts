import { fetchApi } from './core';

export const userApi = {
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
};
