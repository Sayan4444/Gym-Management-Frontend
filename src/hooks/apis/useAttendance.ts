import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useQRToken() {
  return useQuery({
    queryKey: ["qr-token"],
    queryFn: api.getQRToken,
  });
}

export function useScanQRAttendance() {
  return useMutation({
    mutationFn: (data: any) => api.scanQRAttendance(data),
  });
}

export function useMarkManualAttendance() {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number | string; data: any }) => api.markManualAttendance(userId, data),
  });
}

export function useLogAttendance() {
  return useMutation({
    mutationFn: (data: any) => api.logAttendance(data),
  });
}
