'use client';

import { PageHeader } from '@/components/PageHeader';
import { NotificationsList } from './_components/notifications-list';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeader
        title="Notifications"
        subtitle="Keep track of activity across your events."
      />

      <NotificationsList />
    </div>
  );
}
