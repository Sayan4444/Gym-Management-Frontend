import { fetchApi } from "./core";

export const biometricDeviceApi = {
  getBiometricDevice: () => fetchApi("/biometric-devices/current"),
  refreshBiometricDevice: () => fetchApi("/biometric-devices/current/refresh", { method: "POST" }),
  getBiometricRefresh: (refreshId: string) => fetchApi(`/biometric-devices/current/refreshes/${refreshId}`),
  getBiometricSnapshotUsers: (
    snapshotId: string,
    params: { search?: string; view?: "device" | "issues"; accessState?: string; page?: number; pageSize?: number },
  ) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.view) query.set("view", params.view);
    if (params.accessState) query.set("access_state", params.accessState);
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("page_size", String(params.pageSize));
    return fetchApi(`/biometric-devices/current/snapshots/${snapshotId}/users?${query.toString()}`);
  },
  getBiometricSnapshotLogs: (snapshotId: string, params: { search?: string; page?: number; pageSize?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("page_size", String(params.pageSize));
    return fetchApi(`/biometric-devices/current/snapshots/${snapshotId}/logs?${query.toString()}`);
  },
};
