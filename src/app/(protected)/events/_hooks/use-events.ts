import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsService, EventPayload } from '../_services/events.service';

const eventsKey = ['events'] as const;
const eventKey = (id: string) => ['events', id] as const;

export function useEvents() {
  return useQuery({ queryKey: eventsKey, queryFn: eventsService.list });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKey(id),
    queryFn: () => eventsService.findById(id),
    enabled: Boolean(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventPayload) => eventsService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKey });
    },
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventPayload) => eventsService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKey });
      void queryClient.invalidateQueries({ queryKey: eventKey(id) });
    },
  });
}

export function usePublishEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => eventsService.publish(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKey });
      void queryClient.invalidateQueries({ queryKey: eventKey(id) });
    },
  });
}

export function useCloseEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => eventsService.close(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventsKey });
      void queryClient.invalidateQueries({ queryKey: eventKey(id) });
    },
  });
}
