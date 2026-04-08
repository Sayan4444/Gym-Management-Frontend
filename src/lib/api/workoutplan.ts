import { fetchApi } from './core';

export interface CreateWorkoutPlanPayload {
  member_id: number;
  title: string;
  exercises: { name: string }[];
}

export interface UpdateWorkoutPlanPayload {
  title?: string;
  exercises: { name: string }[];
}

export const workoutPlanApi = {
  // ----- Workout Plan Routes -----
  createWorkoutPlan: (data: CreateWorkoutPlanPayload) =>
    fetchApi('/workout-plan', { method: 'POST', body: JSON.stringify(data) }),

  getWorkoutPlans: (params?: { member_id?: number; trainer_id?: number }) => {
    const qs = new URLSearchParams();
    if (params?.member_id) qs.append('member_id', params.member_id.toString());
    if (params?.trainer_id) qs.append('trainer_id', params.trainer_id.toString());
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return fetchApi(`/workout-plan${query}`);
  },

  updateWorkoutPlan: (id: number, data: UpdateWorkoutPlanPayload) =>
    fetchApi(`/workout-plan/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteWorkoutPlan: (id: number) =>
    fetchApi(`/workout-plan/${id}`, { method: 'DELETE' }),
};
