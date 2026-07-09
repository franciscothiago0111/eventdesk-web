import { EventCategory } from '@/shared/types/event';

export const eventCategoryOptions: Array<{ value: EventCategory; label: string }> = [
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'MEETUP', label: 'Meetup' },
  { value: 'HACKATHON', label: 'Hackathon' },
  { value: 'WEBINAR', label: 'Webinar' },
  { value: 'TRAINING', label: 'Training' },
  { value: 'OTHER', label: 'Other' },
];

export function eventCategoryLabel(category: EventCategory): string {
  return (
    eventCategoryOptions.find((option) => option.value === category)?.label ??
    category
  );
}
