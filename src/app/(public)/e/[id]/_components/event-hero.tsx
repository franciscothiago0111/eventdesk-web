import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PublicEvent } from '@/shared/types/event';
import { getImageByType } from '@/shared/utils/event-images';
import { eventCategoryLabel } from '@/shared/utils/event-category';
import { formatDateRange } from '@/shared/utils/date';

interface EventHeroProps {
  event: PublicEvent;
  spotsLeft: number;
}

export function EventHero({ event, spotsLeft }: EventHeroProps) {
  const coverImage = getImageByType(event.images, 'COVER');
  const profileImage = getImageByType(event.images, 'PROFILE');

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="h-40 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-56">
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage.url}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {profileImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileImage.url}
            alt=""
            className="absolute -bottom-8 left-5 h-16 w-16 rounded-full border-4 border-white object-cover shadow-md sm:h-20 sm:w-20"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 pt-6">
        <Badge variant="info" className="w-fit">
          {eventCategoryLabel(event.category)}
        </Badge>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {event.name}
        </h1>
        <div className="flex flex-col gap-1.5 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {formatDateRange(event.startDate, event.endDate)}
          </span>
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              {event.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 shrink-0" />
            {spotsLeft} of {event.capacity} spots left
          </span>
        </div>
      </div>
    </div>
  );
}
