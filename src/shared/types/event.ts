export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  description: string | null;
  location: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  hasPass: boolean;
  startDate: string;
  endDate: string;
  capacity: number;
  registered: number;
  status: EventStatus;
}

export interface PublicEvent {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  requiresPass: boolean;
  startDate: string;
  endDate: string;
  capacity: number;
  registered: number;
  status: EventStatus;
}
