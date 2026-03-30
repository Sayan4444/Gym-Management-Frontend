import { Subscription } from '../../data/types';
import { fetchApi } from './core';

export const subscriptionApi = {
  // ----- Subscription Routes -----
  assignSubscription: (data: Subscription) => fetchApi("/subscriptions", { method: "POST", body: JSON.stringify(data) }),
  getSubscriptions: (gymId?: number, userId?: number) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (userId) params.append("user_id", userId.toString());
    const search = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/subscriptions${search}`);
  },
  updateSubscription: (id: number , data: Subscription) => fetchApi(`/subscriptions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSubscription: (id: number ) => fetchApi(`/subscriptions/${id}`, { method: "DELETE" }),
};
