'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePersistedFilters } from '@/core/hooks/use-persisted-filters';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Paginate } from '@/components/Pagination';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmpty,
  TableHead,
  TableHeadCell,
  TableRow,
  TableScrollArea,
} from '@/components/ui/Table';
import { useEvents } from '../_hooks/use-events';
import type { EventListParams } from '../_services/events.service';
import { EventStatus } from '@/shared/types/event';

const statusVariant: Record<EventStatus, string> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
  CLOSED: 'info',
  CANCELLED: 'error',
};

const EVENTS_FILTER_KEYS = ['name', 'status'];

export function EventsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  usePersistedFilters('events-filters', EVENTS_FILTER_KEYS);

  const filters: EventListParams = {
    name: searchParams.get('name') || undefined,
    status: (searchParams.get('status') as EventStatus) || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: 10,
  };

  const { data, isLoading, isError } = useEvents(filters);
  const events = data?.data ?? [];

  return (
    <LoadingState isLoading={isLoading}>
      {isError ? (
        <ErrorState message="Could not load events." />
      ) : (
        <div className="flex flex-col gap-4">
          <TableContainer>
            <TableScrollArea>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell align="right">Capacity</TableHeadCell>
                    <TableHeadCell>Starts</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.length === 0 ? (
                    <TableEmpty colSpan={4} message="No events yet." />
                  ) : (
                    events.map((event) => (
                      <TableRow
                        key={event.id}
                        hoverable
                        onClick={() => router.push(`/events/${event.id}`)}
                      >
                        <TableCell>{event.name}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[event.status]}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell align="right">
                          {event.registered} / {event.capacity}
                        </TableCell>
                        <TableCell>
                          {new Date(event.startDate).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableScrollArea>
          </TableContainer>

          <Paginate
            perPage={data ? Math.ceil(data.total / data.limit) : undefined}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('page', String(page));
              router.push(`?${params.toString()}`);
            }}
            totalRegisters={data?.total}
            currentPage={data?.currentPage}
            register={data?.data.length}
            registersPrePage={data?.limit}
            itemLabel="events"
          />
        </div>
      )}
    </LoadingState>
  );
}
