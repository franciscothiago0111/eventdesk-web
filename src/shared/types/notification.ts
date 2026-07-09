export type NotificationType = 'REGISTRATION_CONFIRMED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  read: boolean;
  createdAt: string;
}
