'use client';

import { PageHeader } from '@/components/PageHeader';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/core/hooks/use-auth';
import { useLiveCheckIns } from '@/core/realtime/use-live-checkins';
import { useEvents } from '../events/_hooks/use-events';
import { CapacityBar } from './_components/capacity-bar';
import { CheckInTrendChart } from './_components/check-in-trend-chart';

export default function DashboardPage() {
  const user = useAuth((state) => state.user);
  const { data: events, isLoading, isError } = useEvents();

  const activeEvent = events?.find((event) => event.status === 'PUBLISHED');
  const liveCheckIns = useLiveCheckIns(activeEvent?.id);

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeader
        title={`Welcome, ${user?.name ?? ''}`}
        subtitle="Your events at a glance"
      />

      <LoadingState isLoading={isLoading}>
        {isError ? (
          <ErrorState message="Could not load dashboard data." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card title="Total events" padding="lg">
              <p className="text-3xl font-bold text-neutral-950">
                {events?.length ?? 0}
              </p>
            </Card>

            <Card title="Active event capacity" padding="lg">
              {activeEvent ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-950">
                    {activeEvent.name}
                  </p>
                  <CapacityBar
                    registered={activeEvent.registered}
                    capacity={activeEvent.capacity}
                  />
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  No published event right now.
                </p>
              )}
            </Card>

            <Card title="Live check-ins" padding="lg">
              <p className="text-3xl font-bold text-neutral-950">
                {liveCheckIns.length}
              </p>
              <p className="text-sm text-neutral-500">
                {activeEvent
                  ? `for ${activeEvent.name}, since this page opened`
                  : 'No published event right now.'}
              </p>
            </Card>

            <Card padding="lg" className="md:col-span-2 lg:col-span-3">
              <CheckInTrendChart checkIns={liveCheckIns} />
            </Card>
          </div>
        )}
      </LoadingState>
    </div>
  );
}
