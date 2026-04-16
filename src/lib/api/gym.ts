import { Gym } from '../../data/types';
import { UpdateGymPayload } from '../../hooks/apis/useGym';
import { fetchApi } from './core';

export const gymApi = {
  // ----- Gym Routes -----
  addGym: (data: Gym) => fetchApi("/gym", { method: "POST", body: JSON.stringify(data) }),
  getGyms: () => fetchApi("/gyms"),
  getGymIDFromDomain: (domainName: string) => fetchApi(`/gym/domain/${domainName}`),
  getGym: (id: number, includes?: string) => {
    const url = includes
      ? `/gym/${id}?include=${includes}`
      : `/gym/${id}`;
    return fetchApi(url);
  },
  updateGym: (id: number, data: UpdateGymPayload) => fetchApi(`/gym/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGym: (id: number) => fetchApi(`/gym/${id}`, { method: "DELETE" }),
};
