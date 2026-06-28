import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DashboardSummaryStatsResponse {
  totalMembers: number;
  activeMemberships: number;
  totalRevenue: number;
}

export interface DashboardStatsResponse extends DashboardSummaryStatsResponse {
  todaysAttendance: number;
  expiringSoon: number;
  currentMonthRevenue: number;
  activeMembershipChangePercent: number;
  attendanceChangePercent: number;
  weeklyAttendance: { day: string, count: number }[];
  monthlyRevenue: { month: string, revenue: number }[];
  activeMembersTrend: { month: string, count: number }[];
  membershipStatus: { name: string, value: number }[];
}

export type SuperAdminDashboardStatsResponse = DashboardSummaryStatsResponse;

export function useSuperAdminDashboardStats() {
  return useQuery<SuperAdminDashboardStatsResponse>({
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
