import { Gym } from '../../data/types';
import { UpdateGymPayload } from '../../hooks/apis/useGym';
import { fetchApi } from './core';

export const gymApi = {
  // ----- Gym Routes -----
  addGym: (data: Gym) => fetchApi("/gym", { method: "POST", body: JSON.stringify(data) }),
  getGyms: () => fetchApi("/gyms"),
  getGym: (identifier: number | string, includes?: string) => {
    const url = includes
      ? `/gym/${identifier}?include=${includes}`
      : `/gym/${identifier}`;
    return fetchApi(url);
  },
  updateGym: (identifier: number | string, data: UpdateGymPayload) => fetchApi(`/gym/${identifier}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGym: (identifier: number | string) => fetchApi(`/gym/${identifier}`, { method: "DELETE" }),
};
