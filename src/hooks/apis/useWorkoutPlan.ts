import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { WorkoutPlan } from "@/data/types";

export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkoutPlan) => api.createWorkoutPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
  });
}

export function useWorkoutPlans(params?: { member_id?: number; trainer_id?: number }) {
  return useQuery<{ count: number; plans: WorkoutPlan[] }>({
    queryKey: ["workout-plans", params],
    queryFn: () => api.getWorkoutPlans(params),
  });
}

export function useUpdateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number ; data: WorkoutPlan }) => api.updateWorkoutPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
  });
}

export function useDeleteWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number ) => api.deleteWorkoutPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
  });
}
