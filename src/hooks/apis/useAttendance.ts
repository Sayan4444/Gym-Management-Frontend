import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Attendance } from "../../data/types";

export function useQRToken() {
  return useQuery<{ token: string,expiresAt: string }>({
    queryKey: ["qr-token"],
    queryFn: api.getQRToken,
  });
}

export function useAttendance(params?: { date?: string; user_id?: number; gym_id?: number; search?: string }) {
  return useQuery<{ count: number; attendance: (Attendance & { userName: string })[] }>({
    queryKey: ["attendance", params],
    queryFn: () => api.getAttendance(params),
  });
}

export interface ScanQRAttendancePayload { scannedToken: string }
export interface ScanQRAttendanceResponse {
  attendance:Attendance,
  message:string
}

export function useScanQRAttendance() {
  const queryClient = useQueryClient();
  return useMutation<ScanQRAttendanceResponse, Error, ScanQRAttendancePayload >({
    mutationFn: (data: ScanQRAttendancePayload) => api.scanQRAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useMarkManualAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: number }) => api.markManualAttendance(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}