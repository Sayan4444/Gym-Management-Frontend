import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Gym } from "@/data/types";

export function useAddGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Gym) => api.addGym(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
    },
  });
}

export function useGyms() {
  return useQuery<{ count: number, gyms: Gym[] }>({
    queryKey: ["gyms"],
    queryFn: api.getGyms,
  });
}

export function useGym(identifier?: number | string) {
  return useQuery<Gym>({
    queryKey: ["gym", identifier],
    queryFn: () => identifier ? api.getGym(identifier) : Promise.reject("No identifier"),
    enabled: !!identifier,
  });
}

export function useUpdateGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ identifier, data }: { identifier: number | string; data: Gym }) => api.updateGym(identifier, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
      queryClient.invalidateQueries({ queryKey: ["gym", variables.identifier] });
    },
  });
}

export function useDeleteGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (identifier: number | string) => api.deleteGym(identifier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
    },
  });
}