import { api } from '@/core/api/client';
import { Registration } from '@/shared/types/registration';

export const registrationsService = {
  listByEvent: (eventId: string) =>
    api.get<Registration[]>(`/events/${eventId}/registrations`),
};
