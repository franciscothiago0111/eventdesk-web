import { api } from '@/core/api/client';
import { Event, EventStatus } from '@/shared/types/event';
import { Pagination } from '@/shared/types/pagination';

export interface EventPayload {
  name: string;
  description?: string;
  location?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  pass?: string;
  startDate: string;
  endDate: string;
  capacity: number;
}

export interface EventListParams {
  name?: string;
  status?: EventStatus;
  page?: number;
  limit?: number;
}

export const eventsService = {
  list: (params: EventListParams = {}) =>
    api.get<Pagination<Event>>('/events', { ...params }),
  findById: (id: string) => api.get<Event>(`/events/${id}`),
  create: (payload: EventPayload) => api.post<Event>('/events', payload),
  update: (id: string, payload: EventPayload) =>
    api.put<Event>(`/events/${id}`, payload),
  publish: (id: string) => api.patch<Event>(`/events/${id}/publish`),
  close: (id: string) => api.patch<Event>(`/events/${id}/close`),
};
