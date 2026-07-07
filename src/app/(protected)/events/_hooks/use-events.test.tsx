import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createQueryClientWrapper } from '@/test/query-client';
import { Event } from '@/shared/types/event';
import { useCreateEvent, useEvents } from './use-events';
import { EventPayload } from '../_services/events.service';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const event: Event = {
  id: 'event-1',
  organizerId: 'organizer-1',
  name: 'Conference',
  description: 'A great conference',
  location: null,
  profileImageUrl: null,
  coverImageUrl: null,
  hasPass: false,
  startDate: '2026-08-01T09:00:00.000Z',
  endDate: '2026-08-02T09:00:00.000Z',
  capacity: 100,
  registered: 0,
  status: 'DRAFT',
};

describe('useEvents', () => {
  it('returns the unwrapped paginated list of events', async () => {
    const payload = {
      data: [event],
      total: 1,
      currentPage: 1,
      perPage: 10,
      limit: 10,
    };

    server.use(
      http.get(`${apiUrl}/events`, () =>
        HttpResponse.json({
          success: true,
          message: 'Events found',
          payload,
        }),
      ),
    );

    const { result } = renderHook(() => useEvents(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(payload);
  });

  it('surfaces an error state when the request fails', async () => {
    server.use(
      http.get(`${apiUrl}/events`, () =>
        HttpResponse.json(
          { message: 'Unauthorized' },
          { status: 401 },
        ),
      ),
    );

    const { result } = renderHook(() => useEvents(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCreateEvent', () => {
  it('posts the payload and returns the created event', async () => {
    const payload: EventPayload = {
      name: event.name,
      description: event.description ?? undefined,
      startDate: event.startDate,
      endDate: event.endDate,
      capacity: event.capacity,
    };

    server.use(
      http.post(`${apiUrl}/events`, async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual(payload);
        return HttpResponse.json({
          success: true,
          message: 'Event created',
          payload: event,
        });
      }),
    );

    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: createQueryClientWrapper(),
    });

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(event);
  });
});
