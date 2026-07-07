'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Persists list filter state in sessionStorage so that when a user navigates
// to a detail page and returns (or refreshes the detail page and goes back),
// their filters are automatically restored to the list URL.
export function usePersistedFilters(storageKey: string, filterKeys: string[]): void {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Prevent the save effect from firing while we are mid-restore.
  const isRestoringRef = useRef(false);

  useEffect(() => {
    const hasFiltersInURL = filterKeys.some((key) => searchParams.get(key));
    if (hasFiltersInURL) return;

    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return;

    let filters: Record<string, string>;
    try {
      filters = JSON.parse(stored) as Record<string, string>;
    } catch {
      sessionStorage.removeItem(storageKey);
      return;
    }

    const hasStoredFilters = Object.values(filters).some((v) => v);
    if (!hasStoredFilters) return;

    isRestoringRef.current = true;

    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`);

    const timer = setTimeout(() => {
      isRestoringRef.current = false;
    }, 150);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty – run only on mount

  useEffect(() => {
    if (isRestoringRef.current) return;

    const currentFilters: Record<string, string> = {};
    let hasAnyFilter = false;

    for (const key of filterKeys) {
      const value = searchParams.get(key);
      if (value) {
        currentFilters[key] = value;
        hasAnyFilter = true;
      }
    }

    if (hasAnyFilter) {
      sessionStorage.setItem(storageKey, JSON.stringify(currentFilters));
    } else {
      sessionStorage.removeItem(storageKey);
    }
  }, [searchParams, filterKeys, storageKey]);
}
