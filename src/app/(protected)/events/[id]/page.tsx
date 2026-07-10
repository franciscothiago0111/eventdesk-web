'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Link2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { BackButton } from '@/components/BackButton';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCloseEvent, useEvent, usePublishEvent } from '../_hooks/use-events';
import { EventStatus } from '@/shared/types/event';
import { getGalleryImages, getImageByType } from '@/shared/utils/event-images';
import { eventCategoryLabel } from '@/shared/utils/event-category';
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

  const handleCopyPublicLink = async () => {
    const publicUrl = `${window.location.origin}/e/${id}`;
    await navigator.clipboard.writeText(publicUrl);
    toast.success('Registration link copied to clipboard');
  };

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
              {getImageByType(event.images, 'COVER') && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageByType(event.images, 'COVER')!.url}
                  alt=""
                  className="h-56 w-full rounded-2xl object-cover"
                />
              )}

              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[event.status]}>
                  {event.status}
                </Badge>
                <Badge variant="info">{eventCategoryLabel(event.category)}</Badge>
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

              {event.location && (
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm font-semibold text-neutral-950">Location</h2>
                  <p className="text-sm text-neutral-700">{event.location}</p>
                  <iframe
                    title="Event location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                    className="h-56 w-full rounded-2xl border border-neutral-200"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}

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
                {event.status === 'PUBLISHED' && (
                  <Button
                    variant="secondary"
                    leftIcon={<Link2 className="size-4" />}
                    onClick={handleCopyPublicLink}
                  >
                    Share registration link
                  </Button>
                )}
              </div>

              {event.schedule.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm font-semibold text-neutral-950">Schedule</h2>
                  <ul className="flex flex-col gap-2">
                    {event.schedule.map((item) => (
                      <li key={item.id} className="rounded-lg border border-neutral-200 p-3 text-sm">
                        <p className="font-medium text-neutral-900">{item.title}</p>
                        <p className="text-neutral-500">
                          {new Date(item.startTime).toLocaleString()} –{' '}
                          {new Date(item.endTime).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {getGalleryImages(event.images).length > 0 && (
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm font-semibold text-neutral-950">Gallery</h2>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {getGalleryImages(event.images).map((image) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={image.id}
                        src={image.url}
                        alt={image.caption ?? ''}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <RegistrationsSection eventId={event.id} />
          </div>
        )}
      </LoadingState>
    </div>
  );
}
