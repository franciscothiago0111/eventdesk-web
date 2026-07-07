import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from './socket-provider';
import { CheckInRecordedEvent } from '@/shared/types/check-in';

export interface LiveCheckIn extends CheckInRecordedEvent {
  receivedAt: string;
}

const liveCheckInsKey = (eventId: string) =>
  ['events', eventId, 'live-check-ins'] as const;

// Client-only cache entry — never fetched from the server, just accumulated
// from the `checkin.recorded` socket stream for as long as the tab is open.
export function useLiveCheckIns(eventId: string | undefined) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data } = useQuery<LiveCheckIn[]>({
    queryKey: liveCheckInsKey(eventId ?? ''),
    queryFn: () => Promise.resolve([]),
    enabled: false,
    initialData: [],
  });

  useEffect(() => {
    if (!socket || !eventId) return;

    socket.emit('join-event', eventId);

    const handleCheckInRecorded = (payload: CheckInRecordedEvent) => {
      queryClient.setQueryData<LiveCheckIn[]>(
        liveCheckInsKey(eventId),
        (previous = []) =>
          previous.some((entry) => entry.checkInId === payload.checkInId)
            ? previous
            : [...previous, { ...payload, receivedAt: new Date().toISOString() }],
      );
      void queryClient.invalidateQueries({ queryKey: ['events'] });
    };

    socket.on('checkin.recorded', handleCheckInRecorded);

    return () => {
      socket.off('checkin.recorded', handleCheckInRecorded);
    };
  }, [socket, eventId, queryClient]);

  return data ?? [];
}
