'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/hooks/use-auth';
import { SocketProvider } from '@/core/realtime/socket-provider';

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
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

  if (!hasHydrated || !user) {
    return null;
  }

  return (
    <SocketProvider>
      <div className="flex min-h-screen flex-col">
        <nav className="flex items-center justify-between border-b border-neutral-200 px-8 py-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-neutral-950">eventdesk</span>
            <Link href="/dashboard" className="text-sm text-neutral-700 hover:text-primary-main">
              Dashboard
            </Link>
            <Link href="/events" className="text-sm text-neutral-700 hover:text-primary-main">
              Events
            </Link>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="text-sm text-neutral-700 hover:text-primary-main"
          >
            Sign out
          </button>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </SocketProvider>
  );
}
