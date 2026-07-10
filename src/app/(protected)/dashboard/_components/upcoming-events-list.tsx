import type { Event } from '@/shared/types/event';
import { formatDateRange } from '@/shared/utils/date';

interface UpcomingEventsListProps {
  events: Event[];
}

export function UpcomingEventsList({ events }: UpcomingEventsListProps) {
  const upcoming = events
    .filter(
      (event) =>
        event.status === 'PUBLISHED' && new Date(event.startDate) >= new Date(),
    )
    .sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 5);

  if (upcoming.length === 0) {
    return <p className="text-sm text-neutral-500">No upcoming events.</p>;
  }

  return (
    <div className="divide-y divide-neutral-100">
      {upcoming.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-950">
              {event.name}
            </p>
            <p className="text-xs text-neutral-500">
              {formatDateRange(event.startDate, event.endDate)}
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold text-neutral-600">
            {event.registered}/{event.capacity}
          </span>
        </div>
      ))}
    </div>
  );
}
