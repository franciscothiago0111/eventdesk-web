import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService, ScheduleItemPayload } from '../_services/schedule.service';

export function useCreateScheduleItem(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScheduleItemPayload) =>
      scheduleService.create(eventId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
}

export function useUpdateScheduleItem(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: ScheduleItemPayload;
    }) => scheduleService.update(eventId, itemId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
}

export function useDeleteScheduleItem(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => scheduleService.remove(eventId, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
}
