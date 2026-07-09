'use client';

import { CSVDownloadButton } from '@/components/CSVDownloadButton';
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
import { useCSVDownload } from '@/core/hooks/use-csv-download';
import { useLiveCheckIns } from '@/core/realtime/use-live-checkins';
import { useLiveRegistrations } from '@/core/realtime/use-live-registrations';
import { useRegistrations } from '../_hooks/use-registrations';
import { CheckInBadge } from './check-in-badge';

interface RegistrationsSectionProps {
  eventId: string;
}

export function RegistrationsSection({ eventId }: RegistrationsSectionProps) {
  const { data: registrations, isLoading, isError } = useRegistrations(eventId);
  const liveCheckIns = useLiveCheckIns(eventId);
  useLiveRegistrations(eventId);
  const downloadCSV = useCSVDownload<{
    name: string;
    email: string;
    status: string;
    checkInCode: string;
  }>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-950">Registrations</h2>
        <CSVDownloadButton
          label="Export CSV"
          disabled={!registrations || registrations.length === 0}
          onClick={() =>
            downloadCSV(
              (registrations ?? []).map((registration) => ({
                name: registration.attendeeName,
                email: registration.attendeeEmail,
                status: registration.status,
                checkInCode: registration.checkInCode,
              })),
              'registrations.csv',
            )
          }
        />
      </div>

      <LoadingState isLoading={isLoading}>
        {isError ? (
          <ErrorState message="Could not load registrations." />
        ) : (
          <TableContainer>
            <TableScrollArea>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Attendee</TableHeadCell>
                    <TableHeadCell>Email</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Check-in</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!registrations || registrations.length === 0 ? (
                    <TableEmpty colSpan={4} message="No registrations yet." />
                  ) : (
                    registrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>{registration.attendeeName}</TableCell>
                        <TableCell>{registration.attendeeEmail}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              registration.status === 'CONFIRMED'
                                ? 'success'
                                : 'error'
                            }
                          >
                            {registration.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <CheckInBadge
                            registrationId={registration.id}
                            liveCheckIns={liveCheckIns}
                          />
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
