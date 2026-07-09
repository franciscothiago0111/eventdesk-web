import { api } from '@/core/api/client';
import { Notification } from '@/shared/types/notification';

export const notificationsService = {
  list: () => api.get<Notification[]>('/notifications'),
  unreadCount: () => api.get<{ count: number }>('/notifications/unread-count'),
  markAsRead: (id: string) =>
    api.patch<Notification>(`/notifications/${id}/read`),
};
