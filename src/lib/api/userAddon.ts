import { UserAddon } from '../../data/types';
import { fetchApi } from './core';

export const userAddonApi = {
  // ----- User Addon Routes -----
  assignUserAddon: (data: UserAddon) => fetchApi("/user-addons", { method: "POST", body: JSON.stringify(data) }),
  getUserAddons: (gymId?: number, userId?: number) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (userId) params.append("user_id", userId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/user-addons${search}`);
  },
  updateUserAddon: (id: number , data: UserAddon) => fetchApi(`/user-addons/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUserAddon: (id: number ) => fetchApi(`/user-addons/${id}`, { method: "DELETE" }),
};
