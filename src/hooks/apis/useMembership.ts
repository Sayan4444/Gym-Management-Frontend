import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MembershipPlan } from "@/data/types";

export function useMembershipPlansByGym(gymId?: number) {
  return useQuery<{count:number,memberships:MembershipPlan[]}>({
    queryKey: ["membership-plans", gymId],
    queryFn: () => gymId ? api.getMembershipPlansByGym(gymId) : Promise.reject("No gymId"),
    enabled: !!gymId,
  });
}

export function useMembershipPlans(gymId?: number) {
  return useQuery<{count:number,memberships:MembershipPlan[]}>({
    queryKey: ["membership-plans", gymId],
    queryFn: () => api.getMembershipPlans(gymId),
  });
}

export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, data }: { gymId: number ; data: MembershipPlan }) => api.createMembershipPlan(gymId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
    },
  });
}

export interface UpdateMembershipPayload {
  name?: string;
  price?: number;
  durationMonths?: number;
  isActive?: boolean;
  planIcon?: string;
}

export function useUpdateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, membershipId, data }: { gymId: number; membershipId: number; data: UpdateMembershipPayload }) => api.updateMembershipPlan(gymId, membershipId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
    },
  });
}

export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, membershipId }: { gymId: number ; membershipId: number }) => api.deleteMembershipPlan(gymId, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
    },
  });
}

// ---------- Plan Addon Hooks ----------

export function useAddPlanAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, membershipId, addonId, frequency }: { gymId: number; membershipId: number; addonId: number; frequency: number }) =>
      api.addPlanAddon(gymId, membershipId, { addon_id: addonId, frequency }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
    },
  });
}

export function useUpdatePlanAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, membershipId, planAddonId, frequency }: { gymId: number; membershipId: number; planAddonId: number; frequency: number }) =>
      api.updatePlanAddon(gymId, membershipId, planAddonId, { frequency }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
    },
  });
}

export function useRemovePlanAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, membershipId, planAddonId }: { gymId: number; membershipId: number; planAddonId: number }) =>
      api.removePlanAddon(gymId, membershipId, planAddonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
    },
  });
}