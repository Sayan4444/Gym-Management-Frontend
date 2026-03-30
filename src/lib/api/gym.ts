import { Gym } from '../../data/types';
import { fetchApi } from './core';

export const gymApi = {
  // ----- Gym Routes -----
  addGym: (data: Gym) => fetchApi("/gym", { method: "POST", body: JSON.stringify(data) }),
  getGyms: () => fetchApi("/gyms"),
  getGym: (identifier: number | string) => fetchApi(`/gym/${identifier}`),
  updateGym: (identifier: number | string, data: Gym) => fetchApi(`/gym/${identifier}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGym: (identifier: number | string) => fetchApi(`/gym/${identifier}`, { method: "DELETE" }),
};
