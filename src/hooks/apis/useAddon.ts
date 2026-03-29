import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Addon } from "@/data/types";

export function useAddons(gymId?: number | string) {
  return useQuery<Addon[]>({
    queryKey: ["addons", gymId],
    queryFn: () => api.getAddons(gymId),
  });
}

export function useCreateAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createAddon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useUpdateAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) => api.updateAddon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useDeleteAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteAddon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useBuyAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { user_id: number; addon_id: number }) => api.buyAddon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}
