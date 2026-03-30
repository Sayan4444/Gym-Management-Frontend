import { fetchApi } from './core';

export const addonApi = {
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
};
