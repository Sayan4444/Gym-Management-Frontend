import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Gym } from "@/data/types";

export function useAddGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addGym(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
    },
  });
}

export function useGyms() {
  return useQuery<Gym[]>({
    queryKey: ["gyms"],
    queryFn: api.getGyms,
  });
}

export function useGym(identifier?: string) {
  return useQuery<Gym>({
    queryKey: ["gym", identifier],
    queryFn: () => identifier ? api.getGym(identifier) : Promise.reject("No identifier"),
    enabled: !!identifier,
  });
}

export function useUpdateGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ identifier, data }: { identifier: string; data: any }) => api.updateGym(identifier, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
      queryClient.invalidateQueries({ queryKey: ["gym", variables.identifier] });
    },
  });
}

export function useDeleteGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (identifier: string) => api.deleteGym(identifier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
    },
  });
}

export function useDashboardStats(gymId?: number | string) {
  return useQuery({
    queryKey: ["dashboard-stats", gymId],
    queryFn: () => api.getDashboardStats(gymId),
  });
}
