export type RegistrationStatus = 'CONFIRMED' | 'CANCELLED';

export interface Registration {
  id: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  checkInCode: string;
  status: RegistrationStatus;
}
