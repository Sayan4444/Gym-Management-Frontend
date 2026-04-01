import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DashboardStatsResponse {
    total_members: number;
    todays_attendance: number;
    active_memberships: number;
    expiring_soon: number;
    total_revenue: number;
    weekly_attendance: { day: string, count: number }[];
    monthly_revenue: { month: string, revenue: number }[];
}

export function useSuperAdminDashboardStats() {
  return useQuery<DashboardStatsResponse>({
    queryKey: ["superAdminDashboardStats"],
    queryFn: api.getSuperAdminDashboardStats,
  });
}

export function useAdminDashboardStats() {
  return useQuery<DashboardStatsResponse>({
    queryKey: ["adminDashboardStats"],
    queryFn: api.getAdminDashboardStats,
  });
}
