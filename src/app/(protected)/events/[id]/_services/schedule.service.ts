import { api } from '@/core/api/client';
import { ScheduleItem } from '@/shared/types/event';

export interface ScheduleItemPayload {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export const scheduleService = {
  create: (eventId: string, payload: ScheduleItemPayload) =>
    api.post<ScheduleItem>(`/events/${eventId}/schedule`, payload),
  update: (eventId: string, itemId: string, payload: ScheduleItemPayload) =>
    api.put<ScheduleItem>(`/events/${eventId}/schedule/${itemId}`, payload),
  remove: (eventId: string, itemId: string) =>
    api.delete<null>(`/events/${eventId}/schedule/${itemId}`),
};
