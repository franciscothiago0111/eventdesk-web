import { api } from '@/core/api/client';
import { PublicEvent } from '@/shared/types/event';
import { Registration } from '@/shared/types/registration';

export interface PublicRegistrationPayload {
  attendeeName: string;
  attendeeEmail: string;
  pass?: string;
}

export const publicEventsService = {
  findById: (id: string) => api.get<PublicEvent>(`/public/events/${id}`),
  register: (id: string, payload: PublicRegistrationPayload) =>
    api.post<Registration>(`/public/events/${id}/registrations`, payload),
};
