import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createWorkoutPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
  });
}

export function useWorkoutPlans() {
  return useQuery({
    queryKey: ["workout-plans"],
    queryFn: api.getWorkoutPlans,
  });
}

export function useUpdateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) => api.updateWorkoutPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
  });
}

export function useDeleteWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteWorkoutPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
  });
}
