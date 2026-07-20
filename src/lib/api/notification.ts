import { fetchApi } from "./core";

export const notificationApi = {
  getNotifications: (limit = 50, cursor?: string) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set("cursor", cursor);
    return fetchApi(`/notifications?${params.toString()}`);
  },
  markNotificationRead: (id: number) => fetchApi(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => fetchApi("/notifications/read-all", { method: "PATCH" }),
  dismissNotification: (id: number) => fetchApi(`/notifications/${id}/dismiss`, { method: "PATCH" }),
  dismissAllNotifications: () => fetchApi("/notifications/dismiss-all", { method: "PATCH" }),
};
