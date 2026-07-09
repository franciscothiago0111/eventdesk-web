export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';

export type EventCategory =
  | 'CONFERENCE'
  | 'WORKSHOP'
  | 'MEETUP'
  | 'HACKATHON'
  | 'WEBINAR'
  | 'TRAINING'
  | 'OTHER';

export type EventImageType = 'PROFILE' | 'COVER' | 'GALLERY';

export interface EventImage {
  id: string;
  url: string;
  type: EventImageType;
  caption: string | null;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
}

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  description: string | null;
  location: string | null;
  category: EventCategory;
  hasPass: boolean;
  startDate: string;
  endDate: string;
  capacity: number;
  registered: number;
  status: EventStatus;
  images: EventImage[];
  schedule: ScheduleItem[];
}

export interface PublicEvent {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  category: EventCategory;
  requiresPass: boolean;
  startDate: string;
  endDate: string;
  capacity: number;
  registered: number;
  status: EventStatus;
  images: EventImage[];
  schedule: ScheduleItem[];
}
