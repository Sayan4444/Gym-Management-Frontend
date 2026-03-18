import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Gym, User, MembershipPlan, Subscription, Addon } from "@/data/types";

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

export function useDashboardStats(gymId?: number) {
  return useQuery({
    queryKey: ["dashboard-stats", gymId],
    queryFn: () => api.getDashboardStats(gymId),
  });
}

export function useUsers(gymId?: number, isPremium?: boolean, role?: string) {
  return useQuery<User[]>({
    queryKey: ["users", gymId, isPremium, role],
    queryFn: () => api.getUsers(gymId, isPremium, role),
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => api.updateMember(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function usePlans(gymId?: number) {
  return useQuery<MembershipPlan[]>({
    queryKey: ["plans", gymId],
    queryFn: () => api.getPlans(gymId),
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MembershipPlan, "id" | "createdAt" | "updatedAt">) => api.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useSubscriptions(gymId?: number, userId?: number) {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions", gymId, userId],
    queryFn: () => api.getSubscriptions(gymId, userId),
  });
}

export function useAssignSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { user_id: number; plan_id: number }) => api.assignSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useAddons(gymId?: number) {
  return useQuery<Addon[]>({
    queryKey: ["addons", gymId],
    queryFn: () => api.getAddons(gymId),
  });
}

export function useBuyAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { user_id: number; addon_id: number }) => api.buyAddon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addons"] });
      // potentially invalidate payments or user info
    },
  });
}
