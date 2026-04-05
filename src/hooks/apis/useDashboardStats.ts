import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DashboardStatsResponse {
  totalMembers: number;
  todaysAttendance: number;
  activeMemberships: number;
  expiringSoon: number;
  totalRevenue: number;
  weeklyAttendance: { day: string, count: number }[];
  monthlyRevenue: { month: string, revenue: number }[];
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
