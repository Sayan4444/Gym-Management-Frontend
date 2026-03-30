import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Addon } from "@/data/types";

export function useAddons(gymId?: number) {
  return useQuery<Addon[]>({
    queryKey: ["addons", gymId],
    queryFn: () => api.getAddons(gymId),
  });
}

export function useCreateAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, data }: { gymId: number ; data: Addon }) => api.createAddon(gymId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useUpdateAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, addonId, data }: { gymId: number ; addonId: number ; data: Addon }) => api.updateAddon(gymId, addonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useDeleteAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, addonId }: { gymId: number ; addonId: number }) => api.deleteAddon(gymId, addonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}