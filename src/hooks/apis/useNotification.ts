import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Notification } from "@/data/types";

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  nextCursor: string;
}

type NotificationCache = InfiniteData<NotificationListResponse, string>;
type NotificationCacheUpdater = (notification: Notification) => Notification;

const notificationQueryKey = ["notifications"] as const;

export function useNotifications() {
  return useInfiniteQuery<NotificationListResponse, Error, NotificationCache, typeof notificationQueryKey, string>({
    queryKey: notificationQueryKey,
    queryFn: ({ pageParam }) => api.getNotifications(50, pageParam || undefined),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

type NotificationMutationContext = {
  previous: Array<[QueryKey, NotificationCache | undefined]>;
};

function snapshotNotifications(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.getQueriesData<NotificationCache>({ queryKey: notificationQueryKey });
}

function restoreNotifications(
  queryClient: ReturnType<typeof useQueryClient>,
  context: NotificationMutationContext | undefined,
) {
  context?.previous.forEach(([key, value]) => queryClient.setQueryData(key, value));
}

function updateNotificationCache(
  current: NotificationCache | undefined,
  notificationID: number,
  updater: NotificationCacheUpdater,
  unreadDelta: number,
) {
  if (!current) return current;
  const currentUnreadCount = current.pages[0]?.unreadCount ?? 0;
  const unreadCount = Math.max(0, currentUnreadCount + unreadDelta);
  return {
    ...current,
    pages: current.pages.map((page) => ({
      ...page,
      unreadCount,
      notifications: page.notifications.map((notification) =>
        notification.id === notificationID ? updater(notification) : notification,
      ),
    })),
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number, NotificationMutationContext>({
    mutationFn: api.markNotificationRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      const previous = snapshotNotifications(queryClient);
      const current = queryClient.getQueryData<NotificationCache>(notificationQueryKey);
      const target = current?.pages.flatMap((page) => page.notifications).find((notification) => notification.id === id);
      const readAt = new Date().toISOString();
      queryClient.setQueryData<NotificationCache>(
        notificationQueryKey,
        (cache) => updateNotificationCache(cache, id, (notification) => ({ ...notification, readAt }), target && !target.readAt ? -1 : 0),
      );
      return { previous };
    },
    onError: (_error, _id, context) => restoreNotifications(queryClient, context),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationQueryKey }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, void, NotificationMutationContext>({
    mutationFn: api.markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      const previous = snapshotNotifications(queryClient);
      const readAt = new Date().toISOString();
      queryClient.setQueryData<NotificationCache>(notificationQueryKey, (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                unreadCount: 0,
                notifications: page.notifications.map((notification) => ({
                  ...notification,
                  readAt: notification.readAt || readAt,
                })),
              })),
            }
          : current,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => restoreNotifications(queryClient, context),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationQueryKey }),
  });
}

export function useDismissNotification() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number, NotificationMutationContext>({
    mutationFn: api.dismissNotification,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      const previous = snapshotNotifications(queryClient);
      const current = queryClient.getQueryData<NotificationCache>(notificationQueryKey);
      const target = current?.pages.flatMap((page) => page.notifications).find((notification) => notification.id === id);
      const currentUnreadCount = current?.pages[0]?.unreadCount ?? 0;
      const unreadCount = Math.max(0, currentUnreadCount - (target && !target.readAt ? 1 : 0));
      queryClient.setQueryData<NotificationCache>(notificationQueryKey, (cache) =>
        cache
          ? {
              ...cache,
              pages: cache.pages.map((page) => ({
                ...page,
                unreadCount,
                notifications: page.notifications.filter((notification) => notification.id !== id),
              })),
            }
          : cache,
      );
      return { previous };
    },
    onError: (_error, _id, context) => restoreNotifications(queryClient, context),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationQueryKey }),
  });
}

export function useDismissAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, void, NotificationMutationContext>({
    mutationFn: api.dismissAllNotifications,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      const previous = snapshotNotifications(queryClient);
      queryClient.setQueryData<NotificationCache>(notificationQueryKey, (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) => ({
                ...page,
                notifications: [],
                unreadCount: 0,
                nextCursor: "",
              })),
            }
          : current,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => restoreNotifications(queryClient, context),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationQueryKey }),
  });
}
