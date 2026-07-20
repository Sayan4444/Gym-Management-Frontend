import { fetchApi } from './core';
import { Addon } from '../../data/types';

export const addonApi = {
  // ----- Addon Routes -----
    getAddonsByGym: (gymId: number ) => fetchApi(`/gyms/${gymId}/addons`),
    getAddons: (gymId?: number) => fetchApi(gymId ? `/addons?gym_id=${gymId}` : "/addons"),
    createAddon: (data: Addon) => fetchApi("/gyms/addons", { method: "POST", body: JSON.stringify(data) }),
    updateAddon: (addonId: number, data: Addon) => fetchApi(`/gyms/addons/${addonId}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteAddon: (addonId: number) => fetchApi(`/gyms/addons/${addonId}`, { method: "DELETE" }),
};
