'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { BackButton } from '@/components/BackButton';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EventForm } from '../../_components/event-form';
import { useEvent, useUpdateEvent } from '../../_hooks/use-events';
import { ImagesSection } from '../_components/images-section';
import { ScheduleSection } from '../_components/schedule-section';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: event, isLoading, isError } = useEvent(id);
  const updateEvent = useUpdateEvent(id);

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeaderGroup>
        <PageHeader title="Edit event" />
        <BackButton text="Back" />
      </PageHeaderGroup>

      <LoadingState isLoading={isLoading}>
        {isError || !event ? (
          <ErrorState message="Could not load this event." />
        ) : (
          <div className="flex flex-col gap-10">
            <EventForm
              submitLabel="Save changes"
              isSubmitting={updateEvent.isPending}
              defaultValues={{
                name: event.name,
                description: event.description ?? '',
                location: event.location ?? '',
                category: event.category,
                startDate: event.startDate,
                endDate: event.endDate,
                capacity: event.capacity,
              }}
              onSubmit={(values) => {
                updateEvent.mutate(values, {
                  onSuccess: () => {
                    toast.success('Event updated');
                    router.push(`/events/${id}`);
                  },
                  onError: () => toast.error('Could not update the event'),
                });
              }}
            />

            <ImagesSection eventId={id} images={event.images} />
            <ScheduleSection eventId={id} schedule={event.schedule} />
          </div>
        )}
      </LoadingState>
    </div>
  );
}
