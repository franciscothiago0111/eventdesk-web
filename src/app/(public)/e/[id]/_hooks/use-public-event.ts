import { useMutation, useQuery } from '@tanstack/react-query';
import {
  publicEventsService,
  PublicRegistrationPayload,
} from '../_services/public-events.service';

export function usePublicEvent(id: string) {
  return useQuery({
    queryKey: ['public-events', id] as const,
    queryFn: () => publicEventsService.findById(id),
    enabled: Boolean(id),
    retry: false,
  });
}

export function usePublicRegistration(id: string) {
  return useMutation({
    mutationFn: (payload: PublicRegistrationPayload) =>
      publicEventsService.register(id, payload),
  });
}
