import { User } from '../../data/types';
import { fetchApi } from './core';

export const userApi = {
  // ----- User Routes -----
  getUsers: (gymId?: number , isPremium?: boolean, role?: string) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (isPremium) params.append("is_premium", "true");
    if (role) params.append("role", role);
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/users${search}`);
  },
  updateProfile: (id: number , data: User) => fetchApi(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProfile: (id: number ) => fetchApi(`/users/${id}`, { method: "DELETE" }),
};
