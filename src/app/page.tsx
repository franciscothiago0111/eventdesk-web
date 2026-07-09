'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(
    () => useAuth.persist?.hasHydrated() ?? false,
  );

  useEffect(() => {
    return useAuth.persist?.onFinishHydration(() => setHasHydrated(true));
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(useAuth.getState().user ? '/dashboard' : '/login');
  }, [hasHydrated, router]);

  return null;
}
