'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { BackButton } from '@/components/BackButton';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCloseEvent, useEvent, usePublishEvent } from '../_hooks/use-events';
import { EventStatus } from '@/shared/types/event';
import { RegistrationsSection } from './_components/registrations-section';

const statusVariant: Record<EventStatus, string> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
  CLOSED: 'info',
  CANCELLED: 'error',
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: event, isLoading, isError } = useEvent(id);
  const publishEvent = usePublishEvent(id);
  const closeEvent = useCloseEvent(id);

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeaderGroup>
        <PageHeader title={event?.name ?? 'Event'} />
        <BackButton text="Back" />
      </PageHeaderGroup>

      <LoadingState isLoading={isLoading}>
        {isError || !event ? (
          <ErrorState message="Could not load this event." />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[event.status]}>
                  {event.status}
                </Badge>
                <span className="text-sm text-neutral-600">
                  {event.registered} / {event.capacity} registered
                </span>
              </div>

              {event.description && (
                <p className="text-sm text-neutral-700">{event.description}</p>
              )}

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-neutral-500">Starts</dt>
                  <dd>{new Date(event.startDate).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Ends</dt>
                  <dd>{new Date(event.endDate).toLocaleString()}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-3">
                {event.status === 'DRAFT' && (
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/events/${event.id}/edit`)}
                  >
                    Edit
                  </Button>
                )}
                {event.status === 'DRAFT' && (
                  <Button
                    isLoading={publishEvent.isPending}
                    onClick={() =>
                      publishEvent.mutate(undefined, {
                        onSuccess: () => toast.success('Event published'),
                        onError: () => toast.error('Could not publish the event'),
                      })
                    }
                  >
                    Publish
                  </Button>
                )}
                {event.status === 'PUBLISHED' && (
                  <Button
                    variant="danger"
                    isLoading={closeEvent.isPending}
                    onClick={() =>
                      closeEvent.mutate(undefined, {
                        onSuccess: () => toast.success('Event closed'),
                        onError: () => toast.error('Could not close the event'),
                      })
                    }
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>

            <RegistrationsSection eventId={event.id} />
          </div>
        )}
      </LoadingState>
    </div>
  );
}
