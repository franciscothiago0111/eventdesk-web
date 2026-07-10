import { Badge } from '@/components/ui/Badge';
import { Event, EventStatus } from '@/shared/types/event';
import { getImageByType } from '@/shared/utils/event-images';
import { eventCategoryLabel } from '@/shared/utils/event-category';

const statusVariant: Record<EventStatus, string> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
  CLOSED: 'info',
  CANCELLED: 'error',
};

interface EventOverviewProps {
  event: Event;
}

export function EventOverview({ event }: EventOverviewProps) {
  const coverImage = getImageByType(event.images, 'COVER');

  return (
    <div className="flex flex-col gap-6">
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage.url}
          alt=""
          className="h-56 w-full rounded-2xl object-cover"
        />
      )}

      <div className="flex items-center gap-3">
        <Badge variant={statusVariant[event.status]}>{event.status}</Badge>
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
    </div>
  );
}
