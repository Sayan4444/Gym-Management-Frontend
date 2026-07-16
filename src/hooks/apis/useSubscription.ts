import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Subscription } from "@/data/types";

export interface AssignSubscriptionPayload {
  userId: number;
  planId: number;
}

export interface UpdateSubscriptionPayload {
  planId?: number;
  status?: "Paused" | "Cancelled" | "";
}

function invalidateAccessQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  queryClient.invalidateQueries({ queryKey: ["users"] });
  queryClient.invalidateQueries({ queryKey: ["me"] });
  queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
}

export function useAssignSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignSubscriptionPayload) => api.assignSubscription(data),
    onSuccess: () => {
      invalidateAccessQueries(queryClient);
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
    mutationFn: ({ id, data }: { id: number; data: UpdateSubscriptionPayload }) => api.updateSubscription(id, data),
    onSuccess: () => {
      invalidateAccessQueries(queryClient);
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteSubscription(id),
    onSuccess: () => {
      invalidateAccessQueries(queryClient);
    },
  });
}
