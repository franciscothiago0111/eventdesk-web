import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './socket-provider';

// Keeps the registrations table and the event's registered/capacity count
// live when a guest confirms via the public registration page.
export function useLiveRegistrations(eventId: string | undefined) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !eventId) return;

    socket.emit('join-event', eventId);

    const handleRegistrationConfirmed = () => {
      void queryClient.invalidateQueries({
        queryKey: ['events', eventId, 'registrations'],
      });
      void queryClient.invalidateQueries({ queryKey: ['events'] });
    };

    socket.on('registration.confirmed', handleRegistrationConfirmed);

    return () => {
      socket.off('registration.confirmed', handleRegistrationConfirmed);
    };
  }, [socket, eventId, queryClient]);
}
