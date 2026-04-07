import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/data/types";

export function useUsers({ gymId, trainerId, isPremium, role, search, subscriptionStatus, include }: { gymId?: number, trainerId?: number, isPremium?: boolean, role?: string, search?: string, subscriptionStatus?: string, include?: string } = {}) {
  return useQuery<{ count: number, users: User[] }>({
    queryKey: ["users", gymId, trainerId, isPremium, role, search, subscriptionStatus, include],
    queryFn: () => api.getUsers(gymId, trainerId, isPremium, role, search, subscriptionStatus, include),
  });
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  medicalConditions?: string;
  gymId?: number | null;
  subscriptionId?: number | null;
  trainerId?: number | null;
  workoutPlanId?: number | null;
  role?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProfilePayload }) => api.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
