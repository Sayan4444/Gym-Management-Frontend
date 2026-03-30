import { fetchApi } from './core';

export const gymApi = {
  // ----- Gym Routes -----
  addGym: (data: any) => fetchApi("/gym", { method: "POST", body: JSON.stringify(data) }),
  getGyms: () => fetchApi("/gyms"),
  getGym: (identifier: string) => fetchApi(`/gym/${identifier}`),
  updateGym: (identifier: string, data: any) => fetchApi(`/gym/${identifier}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGym: (identifier: string) => fetchApi(`/gym/${identifier}`, { method: "DELETE" }),
};
