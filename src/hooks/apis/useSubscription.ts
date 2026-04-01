import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Subscription } from "@/data/types";

export function useAssignSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Subscription) => api.assignSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useSubscriptions(gymId?: number, userId?: number) {
  return useQuery<{ count: number; subscriptions: Subscription[] }>({
    queryKey: ["subscriptions", gymId, userId],
    queryFn: () => api.getSubscriptions(gymId, userId),
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Subscription }) => api.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}
