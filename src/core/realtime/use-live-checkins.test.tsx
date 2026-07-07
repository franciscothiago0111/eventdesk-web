import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInRecordedEvent } from '@/shared/types/check-in';
import { createQueryClientWrapper } from '@/test/query-client';
import { useLiveCheckIns } from './use-live-checkins';

const useSocketMock = vi.fn();

vi.mock('./socket-provider', () => ({
  useSocket: () => useSocketMock(),
}));

function createFakeSocket() {
  const listeners = new Map<string, Set<(payload: unknown) => void>>();

  return {
    emit: vi.fn(),
    on: vi.fn((event: string, handler: (payload: unknown) => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)?.add(handler);
    }),
    off: vi.fn((event: string, handler: (payload: unknown) => void) => {
      listeners.get(event)?.delete(handler);
    }),
    trigger(event: string, payload: unknown) {
      listeners.get(event)?.forEach((handler) => handler(payload));
    },
  };
}

const checkInEvent: CheckInRecordedEvent = {
  checkInId: 'check-in-1',
  registrationId: 'registration-1',
  checkedInById: 'staff-1',
  fromOfflineSync: false,
};

describe('useLiveCheckIns', () => {
  beforeEach(() => {
    useSocketMock.mockReset();
  });

  it('joins the event room when an eventId is provided', () => {
    const socket = createFakeSocket();
    useSocketMock.mockReturnValue(socket);

    renderHook(() => useLiveCheckIns('event-1'), {
      wrapper: createQueryClientWrapper(),
    });

    expect(socket.emit).toHaveBeenCalledWith('join-event', 'event-1');
    expect(socket.on).toHaveBeenCalledWith(
      'checkin.recorded',
      expect.any(Function),
    );
  });

  it('does not join a room when eventId is undefined', () => {
    const socket = createFakeSocket();
    useSocketMock.mockReturnValue(socket);

    renderHook(() => useLiveCheckIns(undefined), {
      wrapper: createQueryClientWrapper(),
    });

    expect(socket.emit).not.toHaveBeenCalled();
    expect(socket.on).not.toHaveBeenCalled();
  });

  it('appends check-ins pushed by the server and dedupes by checkInId', async () => {
    const socket = createFakeSocket();
    useSocketMock.mockReturnValue(socket);

    const { result } = renderHook(() => useLiveCheckIns('event-1'), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current).toEqual([]);

    act(() => {
      socket.trigger('checkin.recorded', checkInEvent);
    });

    await waitFor(() => expect(result.current).toHaveLength(1));
    expect(result.current[0]).toMatchObject(checkInEvent);

    act(() => {
      socket.trigger('checkin.recorded', checkInEvent);
    });

    expect(result.current).toHaveLength(1);
  });

  it('stops listening on unmount', () => {
    const socket = createFakeSocket();
    useSocketMock.mockReturnValue(socket);

    const { unmount } = renderHook(() => useLiveCheckIns('event-1'), {
      wrapper: createQueryClientWrapper(),
    });

    unmount();

    expect(socket.off).toHaveBeenCalledWith(
      'checkin.recorded',
      expect.any(Function),
    );
  });
});
