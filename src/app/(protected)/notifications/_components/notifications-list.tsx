'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SkeletonList } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  useMarkNotificationAsRead,
  useNotifications,
} from '@/core/hooks/use-notifications';
import { getNotificationLink } from '@/core/utils/notification-link';
import type { Notification } from '@/shared/types/notification';

function NotificationCard({ notification }: { notification: Notification }) {
  const router = useRouter();
  const markAsRead = useMarkNotificationAsRead();
  const link = getNotificationLink(notification);

  const handleClick = () => {
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 transition-colors',
        link && 'cursor-pointer hover:bg-neutral-100',
        !notification.read && 'bg-primary-light/40',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'h-2 w-2 shrink-0 rounded-full',
            !notification.read ? 'bg-primary-main' : 'bg-transparent',
          )}
        />
        <h4 className="text-sm font-semibold text-neutral-950">
          {notification.title}
        </h4>
      </div>
      <div className="pl-4">
        <p className="mt-1 text-sm text-neutral-700">{notification.message}</p>
        <p className="mt-2 text-xs text-neutral-500">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function NotificationsFeed({ onlyUnread }: { onlyUnread: boolean }) {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();

  if (isLoading) return <SkeletonList count={6} />;

  if (isError) {
    return (
      <div className="space-y-3">
        <ErrorState message="Could not load notifications." showBackButton={false} />
        <div className="text-center">
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-sm font-semibold text-primary-main hover:text-primary-darker"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const filtered = onlyUnread
    ? (notifications ?? []).filter((n) => !n.read)
    : (notifications ?? []);

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-neutral-500">
        No notifications found.
      </p>
    );
  }

  return (
    <div className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-white">
      {filtered.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

export function NotificationsList() {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-4">
        <NotificationsFeed onlyUnread={false} />
      </TabsContent>

      <TabsContent value="unread" className="mt-4">
        <NotificationsFeed onlyUnread />
      </TabsContent>
    </Tabs>
  );
}
