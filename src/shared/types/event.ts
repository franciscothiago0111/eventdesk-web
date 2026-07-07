export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  capacity: number;
  registered: number;
  status: EventStatus;
}
