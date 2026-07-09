import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/core/services/notifications.service';
import { useSocket } from '@/core/realtime/socket-provider';
import { Notification } from '@/shared/types/notification';

const notificationsKey = ['notifications'] as const;
const unreadCountKey = ['notifications', 'unread-count'] as const;

export function useNotifications() {
  return useQuery({
    queryKey: notificationsKey,
    queryFn: () => notificationsService.list(),
  });
}

export function useUnreadNotificationCount() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: unreadCountKey,
    queryFn: () => notificationsService.unreadCount(),
    select: (data) => data.count,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      queryClient.setQueryData<Notification[]>(
        notificationsKey,
        (previous = []) =>
          previous.some((n) => n.id === notification.id)
            ? previous
            : [notification, ...previous],
      );
      queryClient.setQueryData<{ count: number }>(unreadCountKey, (previous) => ({
        count: (previous?.count ?? 0) + 1,
      }));
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, queryClient]);

  return query;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKey });
      void queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });
}
