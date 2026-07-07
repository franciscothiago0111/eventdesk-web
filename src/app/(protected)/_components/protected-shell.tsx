'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/core/hooks/use-auth';
import { SocketProvider } from '@/core/realtime/socket-provider';
import { useSidebarState } from '../_hooks/use-sidebar-state';
import { DashboardLoadingState } from './dashboard-loading-state';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const { isSidebarOpen, toggleSidebar, closeSidebarOnMobile } = useSidebarState();
  // useAuth.persist reads localStorage, which doesn't exist during SSR —
  // guard against it being unavailable on the server render pass.
  const [hasHydrated, setHasHydrated] = useState(
    () => useAuth.persist?.hasHydrated() ?? false,
  );

  useEffect(() => {
    return useAuth.persist?.onFinishHydration(() => setHasHydrated(true));
  }, []);

  useEffect(() => {
    // Read the store directly instead of trusting the `user` selector value
    // closed over by this effect — `hasHydrated` (local state, flipped via
    // the onFinishHydration callback) and the `user` selector's re-render
    // are two separate subscriptions and aren't guaranteed to land in the
    // same batch, so `user` here can still be a stale `null` from before
    // rehydration finished, firing a redirect even though the store already
    // has a valid session.
    if (hasHydrated && !useAuth.getState().user) {
      router.replace('/login');
    }
  }, [hasHydrated, router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!hasHydrated || !user) {
    return <DashboardLoadingState />;
  }

  return (
    <SocketProvider>
      <div className="min-h-screen overflow-x-hidden bg-neutral-white">
        <div className="flex min-h-screen">
          <Sidebar
            user={user}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            onLinkClick={closeSidebarOnMobile}
            onLogout={handleLogout}
          />

          <div
            className={cn(
              'flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300',
              isSidebarOpen ? 'md:pl-52 lg:pl-63' : 'md:pl-16 lg:pl-18',
            )}
          >
            <Navbar user={user} onLogout={handleLogout} />

            <main className="flex-1 px-4 py-4 md:px-4 md:py-4 xl:px-6 xl:py-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}
