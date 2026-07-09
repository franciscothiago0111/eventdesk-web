import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EventImageType } from '@/shared/types/event';
import { eventImagesService } from '../_services/event-images.service';

export function useUploadEventImage(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      type,
      caption,
    }: {
      file: File;
      type: EventImageType;
      caption?: string;
    }) => eventImagesService.upload(eventId, file, type, caption),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
}

export function useDeleteEventImage(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) =>
      eventImagesService.remove(eventId, imageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
}
