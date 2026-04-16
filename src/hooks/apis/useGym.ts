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

export function useGymIDFromDomain(domainName: string) {
  return useQuery<{id: number}>({
    queryKey: ["gym-id", domainName],
    queryFn: () => api.getGymIDFromDomain(domainName),
    enabled: !!domainName,
  });
}

export function useGym(id?: number, includes?: string) {
  return useQuery<Gym>({
    queryKey: ["gym", id, includes],
    queryFn: () => id ? api.getGym(id, includes) : Promise.reject("No gym ID"),
    enabled: !!id,
  });
}

export interface UpdateGymPayload {
    name: string;
    slug: string;
    address: string;
    whatsapp: string;
    phone: string;
    email: string;
}

export function useUpdateGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGymPayload }) => api.updateGym(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
      queryClient.invalidateQueries({ queryKey: ["gym", variables.id] });
    },
  });
}

export function useDeleteGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteGym(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
    },
  });
}