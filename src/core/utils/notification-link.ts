import { Notification } from '@/shared/types/notification';

export function getNotificationLink(notification: Notification): string | null {
  if (notification.entityType === 'EVENT' && notification.entityId) {
    return `/events/${notification.entityId}`;
  }
  return null;
}
