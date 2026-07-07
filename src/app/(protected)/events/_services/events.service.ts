import { api } from '@/core/api/client';
import { Event } from '@/shared/types/event';

export interface EventPayload {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  capacity: number;
}

export const eventsService = {
  list: () => api.get<Event[]>('/events'),
  findById: (id: string) => api.get<Event>(`/events/${id}`),
  create: (payload: EventPayload) => api.post<Event>('/events', payload),
  update: (id: string, payload: EventPayload) =>
    api.put<Event>(`/events/${id}`, payload),
  publish: (id: string) => api.patch<Event>(`/events/${id}/publish`),
  close: (id: string) => api.patch<Event>(`/events/${id}/close`),
};
