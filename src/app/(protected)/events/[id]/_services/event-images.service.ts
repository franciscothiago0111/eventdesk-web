import { api } from '@/core/api/client';
import { EventImage, EventImageType } from '@/shared/types/event';

export const eventImagesService = {
  upload: (eventId: string, file: File, type: EventImageType, caption?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (caption) formData.append('caption', caption);
    return api.post<EventImage>(`/events/${eventId}/images`, formData);
  },
  remove: (eventId: string, imageId: string) =>
    api.delete<null>(`/events/${eventId}/images/${imageId}`),
};
