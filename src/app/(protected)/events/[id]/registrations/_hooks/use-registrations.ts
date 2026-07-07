import { useQuery } from '@tanstack/react-query';
import { registrationsService } from '../_services/registrations.service';

export function useRegistrations(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId, 'registrations'],
    queryFn: () => registrationsService.listByEvent(eventId),
    enabled: Boolean(eventId),
  });
}
