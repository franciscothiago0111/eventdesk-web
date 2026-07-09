'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from '@/core/hooks/use-notifications';
import { getNotificationLink } from '@/core/utils/notification-link';
import type { Notification } from '@/shared/types/notification';

export function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [], isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAsRead = useMarkNotificationAsRead();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }

    const link = getNotificationLink(notification);
    if (link) {
      router.push(link);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
          isOpen
            ? 'border-primary-main bg-primary-light text-primary-main'
            : 'border-neutral-200 bg-neutral-white text-neutral-700 hover:bg-neutral-100',
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-feedback-error-main text-xs font-bold text-neutral-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-200 bg-neutral-white shadow-2xl">
          <div className="border-b border-neutral-200 p-4">
            <h3 className="text-sm font-bold text-neutral-950">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-neutral-600">
                {unreadCount} unread
              </p>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-main" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="mx-auto h-8 w-8 text-neutral-300" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'flex w-full flex-col gap-1 p-4 text-left transition-colors hover:bg-neutral-100',
                      !notification.read && 'bg-primary-light/40',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-2 w-2 shrink-0 rounded-full',
                          !notification.read
                            ? 'bg-primary-main'
                            : 'bg-transparent',
                        )}
                      />
                      <p className="text-sm font-semibold text-neutral-950">
                        {notification.title}
                      </p>
                    </div>
                    <p className="pl-4 text-sm text-neutral-700">
                      {notification.message}
                    </p>
                    <p className="pl-4 text-xs text-neutral-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 px-4 py-3 text-right">
            <button
              type="button"
              onClick={() => {
                router.push('/notifications');
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-primary-main hover:text-primary-darker"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
