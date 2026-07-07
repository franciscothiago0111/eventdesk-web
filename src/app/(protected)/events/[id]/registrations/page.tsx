'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { BackButton } from '@/components/BackButton';
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
import { useRegistrations } from './_hooks/use-registrations';
import { CheckInBadge } from './_components/check-in-badge';

export default function RegistrationsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: registrations, isLoading, isError } = useRegistrations(id);
  const liveCheckIns = useLiveCheckIns(id);
  const downloadCSV = useCSVDownload<{
    name: string;
    email: string;
    status: string;
    checkInCode: string;
  }>();

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeaderGroup>
        <PageHeader title="Registrations" subtitle="Attendees for this event" />
        <div className="flex gap-3">
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
          <BackButton text="Back" />
        </div>
      </PageHeaderGroup>

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
