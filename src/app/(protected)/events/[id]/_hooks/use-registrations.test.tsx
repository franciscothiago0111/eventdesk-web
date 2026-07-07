import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createQueryClientWrapper } from '@/test/query-client';
import { Registration } from '@/shared/types/registration';
import { useRegistrations } from './use-registrations';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const registration: Registration = {
  id: 'registration-1',
  eventId: 'event-1',
  attendeeName: 'Ada Lovelace',
  attendeeEmail: 'ada@example.com',
  checkInCode: 'ABC123',
  status: 'CONFIRMED',
};

describe('useRegistrations', () => {
  it('returns the unwrapped list of registrations for an event', async () => {
    server.use(
      http.get(`${apiUrl}/events/event-1/registrations`, () =>
        HttpResponse.json({
          success: true,
          message: 'Registrations found',
          payload: [registration],
        }),
      ),
    );

    const { result } = renderHook(() => useRegistrations('event-1'), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([registration]);
  });

  it('does not fetch when the event id is empty', () => {
    const { result } = renderHook(() => useRegistrations(''), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });
});
