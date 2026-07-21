import { UserAddon } from '../../data/types';
import { fetchApi } from './core';

export interface ScheduleUserAddonPayload {
  scheduledAt: string | null; // ISO 8601 or null to clear
}

export const userAddonApi = {
  // ----- User Addon Routes -----
  createUserAddon: (data: UserAddon) => fetchApi("/user-addons", { method: "POST", body: JSON.stringify(data) }),
  getUserAddons: (gymId?: number, userId?: number) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (userId) params.append("user_id", userId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/user-addons${search}`);
  },
  updateUserAddon: (id: number , data: UserAddon) => fetchApi(`/user-addons/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  scheduleUserAddon: (id: number, payload: ScheduleUserAddonPayload) =>
    fetchApi(`/user-addons/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteUserAddon: (id: number ) => fetchApi(`/user-addons/${id}`, { method: "DELETE" }),
};
