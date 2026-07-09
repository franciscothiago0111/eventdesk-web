export type RegistrationStatus = 'CONFIRMED' | 'CANCELLED';

export interface Registration {
  id: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  checkInCode: string;
  status: RegistrationStatus;
}

// Payload emitted by the `registration.confirmed` socket event when a guest
// confirms via the public registration page.
export interface RegistrationConfirmedEvent {
  registrationId: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
}
