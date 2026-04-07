import { User } from '../../data/types';
import { UpdateProfilePayload } from '../../hooks/apis/useUser';
import { fetchApi } from './core';

export const userApi = {
  // ----- User Routes -----
  getUsers: (gymId?: number, trainerId?:number,isPremium?: boolean, role?: string, search?: string, subscriptionStatus?: string, include?: string) => {
    const params = new URLSearchParams();
    if (gymId) params.append("gym_id", gymId.toString());
    if (trainerId) params.append("trainer_id", trainerId.toString());
    if (isPremium) params.append("is_premium", "true");
    if (role) params.append("role", role);
    if (search) params.append("search", search);
    if (subscriptionStatus) params.append("subscription_status", subscriptionStatus);
    if (include) params.append("include", include);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return fetchApi(`/users${qs}`);
  },
  updateProfile: (id: number, data: UpdateProfilePayload) => fetchApi(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProfile: (id: number ) => fetchApi(`/users/${id}`, { method: "DELETE" }),
};
