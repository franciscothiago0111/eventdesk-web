'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { ActionButton } from '@/components/ActionButton';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
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
import { useEvents } from './_hooks/use-events';
import { EventStatus } from '@/shared/types/event';

const statusVariant: Record<EventStatus, string> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
  CLOSED: 'info',
  CANCELLED: 'error',
};

export default function EventsPage() {
  const router = useRouter();
  const { data: events, isLoading, isError } = useEvents();

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeaderGroup>
        <PageHeader title="Events" subtitle="Manage your events" />
        <ActionButton action="create" href="/events/new" label="New event" />
      </PageHeaderGroup>

      <LoadingState isLoading={isLoading}>
        {isError ? (
          <ErrorState message="Could not load events." />
        ) : (
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
                  {!events || events.length === 0 ? (
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
        )}
      </LoadingState>
    </div>
  );
}
