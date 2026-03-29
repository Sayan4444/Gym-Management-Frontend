import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MembershipPlan } from "@/data/types";

export function useMembershipPlansByGym(gymId?: number | string) {
  return useQuery<MembershipPlan[]>({
    queryKey: ["membership-plans", gymId],
    queryFn: () => gymId ? api.getMembershipPlansByGym(gymId) : Promise.reject("No gymId"),
    enabled: !!gymId,
  });
}

export function useMembershipPlans() {
  return useQuery<MembershipPlan[]>({
    queryKey: ["membership-plans"],
    queryFn: api.getMembershipPlans,
  });
}

export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, data }: { gymId: number | string; data: any }) => api.createMembershipPlan(gymId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useUpdateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, membershipId, data }: { gymId: number | string; membershipId: number | string; data: any }) => api.updateMembershipPlan(gymId, membershipId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId, membershipId }: { gymId: number | string; membershipId: number | string }) => api.deleteMembershipPlan(gymId, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function usePlans(gymId?: number | string) {
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
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
    },
  });
}
