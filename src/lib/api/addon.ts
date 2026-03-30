import { fetchApi } from './core';
import { Addon } from '../../data/types';

export const addonApi = {
  // ----- Addon Routes -----
    getAddonsByGym: (gymId: number ) => fetchApi(`/gyms/${gymId}/addons`),
    getAddons: (gymId?: number) => fetchApi(gymId ? `/addons?gym_id=${gymId}` : "/addons"),
    createAddon: (gymId: number , data: Addon) => fetchApi(`/gyms/${gymId}/addons`, { method: "POST", body: JSON.stringify(data) }),
    updateAddon: (gymId: number , addonId: number , data: Addon) => fetchApi(`/gyms/${gymId}/addons/${addonId}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteAddon: (gymId: number , addonId: number ) => fetchApi(`/gyms/${gymId}/addons/${addonId}`, { method: "DELETE" }),
};
