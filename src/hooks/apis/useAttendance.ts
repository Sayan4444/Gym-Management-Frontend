import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useQRToken() {
  return useQuery({
    queryKey: ["qr-token"],
    queryFn: api.getQRToken,
  });
}

export function useScanQRAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.scanQRAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useMarkManualAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number | string; data: any }) => api.markManualAttendance(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useLogAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.logAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
