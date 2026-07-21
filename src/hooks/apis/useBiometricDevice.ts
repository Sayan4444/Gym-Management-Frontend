import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface BiometricDevice {
  id: number;
  gymId: number;
  deviceKey: string;
}

export interface BiometricSnapshot {
  id: string;
  deviceId: number;
  gymId: number;
  status: "pending" | "completed" | "failed" | "timed_out";
  requestedAt: string;
  completedAt?: string;
  capturedAt?: string;
  deviceTime: string;
  serverTime?: string;
  clockDriftSeconds: number;
  deviceName: string;
  serialNumber: string;
  userCount: number;
  enabledUserCount: number;
  disabledUserCount: number;
  unmappedUserCount: number;
  mismatchedUserCount: number;
  missingUserCount: number;
  errorCode?: string;
  errorMessage?: string;
}

export interface BiometricSnapshotUser {
  id: number;
  snapshotId: string;
  deviceUserId: string;
  deviceName: string;
  enabled: boolean;
  hasPassword: boolean;
  hasCard: boolean;
  biometricCount: number;
  presentOnDevice: boolean;
  applicationUserId?: number;
  applicationUserName?: string;
  expectedEnabled?: boolean;
  syncState: string;
}

export interface BiometricSnapshotLog {
  id: number;
  snapshotId: string;
  machineNo: string;
  deviceType: number;
  deviceUserId: string;
  deviceUserName?: string;
  applicationUserId?: number;
  applicationUserName?: string;
  verifyType: string;
  verifyMode: string;
  occurredAt: string;
}

export interface BiometricDeviceResponse {
  device: BiometricDevice;
  snapshot: BiometricSnapshot | null;
  latestAttempt: BiometricSnapshot | null;
  refreshPolicy: { cooldownSeconds: number; timeoutSeconds: number; automaticRefresh: boolean };
}

export interface BiometricRefreshResponse {
  refresh: BiometricSnapshot;
}

export function useBiometricDevice() {
  return useQuery<BiometricDeviceResponse>({
    queryKey: ["biometricDevice"],
    queryFn: api.getBiometricDevice,
  });
}

export function useRefreshBiometricDevice() {
  const queryClient = useQueryClient();
  return useMutation<{ refreshId: string; status: string; pollAfterMs: number }>({
    mutationFn: api.refreshBiometricDevice,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["biometricDevice"] }),
  });
}

export function useBiometricRefresh(refreshId?: string) {
  return useQuery<BiometricRefreshResponse>({
    queryKey: ["biometricDeviceRefresh", refreshId],
    queryFn: () => api.getBiometricRefresh(refreshId as string),
    enabled: Boolean(refreshId),
    refetchInterval: refreshId ? 1000 : false,
  });
}

export function useBiometricSnapshotUsers(
  snapshotId: string | undefined,
  params: { search?: string; view: "device" | "issues"; accessState?: string; page: number; pageSize: number },
) {
  return useQuery<{ users: BiometricSnapshotUser[]; count: number; page: number; pageSize: number; totalPages: number }>({
    queryKey: ["biometricSnapshotUsers", snapshotId, params],
    queryFn: () => api.getBiometricSnapshotUsers(snapshotId as string, params),
    enabled: Boolean(snapshotId),
  });
}

export function useBiometricSnapshotLogs(
  snapshotId: string | undefined,
  params: { search?: string; page: number; pageSize: number },
) {
  return useQuery<{ logs: BiometricSnapshotLog[]; count: number; page: number; pageSize: number; totalPages: number }>({
    queryKey: ["biometricSnapshotLogs", snapshotId, params],
    queryFn: () => api.getBiometricSnapshotLogs(snapshotId as string, params),
    enabled: Boolean(snapshotId),
  });
}
