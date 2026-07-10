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
import { KpiCard } from './_components/kpi-card';
import { EventStatusChart } from './_components/event-status-chart';
import { EventCategoryChart } from './_components/event-category-chart';
import { UpcomingEventsList } from './_components/upcoming-events-list';
import { useDashboardStats } from './_hooks/use-dashboard-stats';

export default function DashboardPage() {
  const user = useAuth((state) => state.user);
  const { data: events, isLoading: eventsLoading, isError: eventsError } =
    useEvents({ limit: 100 });
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useDashboardStats();

  const eventList = events?.data ?? [];
  const activeEvent = eventList.find((event) => event.status === 'PUBLISHED');
  const liveCheckIns = useLiveCheckIns(activeEvent?.id);

  const isLoading = eventsLoading || statsLoading;
  const isError = eventsError || statsError;

  const utilization =
    stats && stats.totalCapacity > 0
      ? Math.round((stats.totalRegistered / stats.totalCapacity) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeader
        title={`Welcome, ${user?.name ?? ''}`}
        subtitle="Your events at a glance"
      />

      <LoadingState isLoading={isLoading}>
        {isError || !stats ? (
          <ErrorState message="Could not load dashboard data." />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <KpiCard
                accent="bg-primary-main"
                label="Total events"
                value={stats.totalEvents}
                sub={`${stats.eventsByStatus.PUBLISHED} published`}
              />
              <KpiCard
                accent="bg-success-main"
                label="Registered attendees"
                value={stats.totalRegistered}
                sub={`${utilization}% of total capacity`}
              />
              <KpiCard
                accent="bg-secondary-main"
                label="Capacity utilization"
                value={`${utilization}%`}
                sub={`${stats.totalRegistered} / ${stats.totalCapacity} seats filled`}
              />
              <KpiCard
                accent="bg-neutral-700"
                label="Total check-ins"
                value={stats.totalCheckIns}
                sub="all-time, across every event"
              />
              <KpiCard
                accent="bg-neutral-500"
                label="Live check-ins"
                value={liveCheckIns.length}
                sub={
                  activeEvent
                    ? `for ${activeEvent.name}, since this page opened`
                    : 'No published event right now'
                }
              />
            </div>

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



            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="Events by status" padding="lg">
                <EventStatusChart counts={stats.eventsByStatus} />
              </Card>

              <Card title="Events by category" padding="lg">
                <EventCategoryChart counts={stats.eventsByCategory} />
              </Card>

              <Card title="Upcoming events" padding="lg">
                <UpcomingEventsList events={eventList} />
              </Card>
            </div>

            <Card padding="lg">
              <CheckInTrendChart checkIns={liveCheckIns} />
            </Card>
          </div>
        )}
      </LoadingState>
    </div>
  );
}
