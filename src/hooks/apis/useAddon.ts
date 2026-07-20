import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Addon } from "@/data/types";

export function useAddons(gymId?: number) {
  return useQuery<{ count: number; addons: Addon[] }>({
    queryKey: ["addons", gymId],
    queryFn: () => api.getAddons(gymId),
  });
}

export function useCreateAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Addon }) => api.createAddon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useUpdateAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addonId, data }: { addonId: number; data: Addon }) => api.updateAddon(addonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useDeleteAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addonId }: { addonId: number }) => api.deleteAddon(addonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}
