import { fetchApi } from './core';
import { WorkoutPlan } from '@/data/types';

export const workoutPlanApi = {
  // ----- Workout Plan Routes -----
  createWorkoutPlan: (data: WorkoutPlan) => fetchApi("/workout-plan", { method: "POST", body: JSON.stringify(data) }),
  getWorkoutPlans: () => fetchApi("/workout-plan"),
  updateWorkoutPlan: (id: number, data: WorkoutPlan) => fetchApi(`/workout-plan/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteWorkoutPlan: (id: number ) => fetchApi(`/workout-plan/${id}`, { method: "DELETE" }),
};
