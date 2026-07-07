import { Badge } from '@/components/ui/Badge';
import { LiveCheckIn } from '@/core/realtime/use-live-checkins';

interface CheckInBadgeProps {
  registrationId: string;
  liveCheckIns: LiveCheckIn[];
}

export function CheckInBadge({ registrationId, liveCheckIns }: CheckInBadgeProps) {
  const isCheckedIn = liveCheckIns.some(
    (checkIn) => checkIn.registrationId === registrationId,
  );

  return (
    <Badge variant={isCheckedIn ? 'success' : 'default'}>
      {isCheckedIn ? 'Checked in' : 'Not checked in'}
    </Badge>
  );
}
