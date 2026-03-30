import { fetchApi } from './core';

export const workoutPlanApi = {
  // ----- Workout Plan Routes -----
  createWorkoutPlan: (data: any) => fetchApi("/workout-plan", { method: "POST", body: JSON.stringify(data) }),
  getWorkoutPlans: () => fetchApi("/workout-plan"),
  updateWorkoutPlan: (id: number | string, data: any) => fetchApi(`/workout-plan/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteWorkoutPlan: (id: number | string) => fetchApi(`/workout-plan/${id}`, { method: "DELETE" }),
};
