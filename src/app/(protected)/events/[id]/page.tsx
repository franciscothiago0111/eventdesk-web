'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { useEvent } from '../_hooks/use-events';
import { EventOverview } from './_components/event-overview';
import { EventActions } from './_components/event-actions';
import { ScheduleSection } from './_components/schedule-section';
import { EventGalleryGrid } from './_components/event-gallery-grid';
import { RegistrationsSection } from './_components/registrations-section';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = useEvent(id);

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumb
        items={[
          { label: 'Events', href: '/events' },
          { label: event?.name ?? 'Event' },
        ]}
      />

      <PageHeaderGroup>
        <PageHeader title={event?.name ?? 'Event'} />
      </PageHeaderGroup>

      <LoadingState isLoading={isLoading}>
        {isError || !event ? (
          <ErrorState message="Could not load this event." />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 max-w-2xl">
              <EventOverview event={event} />
              <EventActions event={event} />
              <ScheduleSection
                eventId={event.id}
                schedule={event.schedule}
                eventStartDate={event.startDate}
                eventEndDate={event.endDate}
              />
              <EventGalleryGrid images={event.images} />
            </div>

            <RegistrationsSection eventId={event.id} />
          </div>
        )}
      </LoadingState>
    </div>
  );
}
