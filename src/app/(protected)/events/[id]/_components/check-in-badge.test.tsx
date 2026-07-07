import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiveCheckIn } from '@/core/realtime/use-live-checkins';
import { CheckInBadge } from './check-in-badge';

const liveCheckIn: LiveCheckIn = {
  checkInId: 'check-in-1',
  registrationId: 'registration-1',
  checkedInById: 'staff-1',
  fromOfflineSync: false,
  receivedAt: '2026-07-07T10:00:00.000Z',
};

describe('CheckInBadge', () => {
  it('shows "Checked in" when the registration id is in liveCheckIns', () => {
    render(
      <CheckInBadge
        registrationId="registration-1"
        liveCheckIns={[liveCheckIn]}
      />,
    );

    expect(screen.getByText('Checked in')).toBeInTheDocument();
  });

  it('shows "Not checked in" when the registration id is absent', () => {
    render(<CheckInBadge registrationId="registration-2" liveCheckIns={[liveCheckIn]} />);

    expect(screen.getByText('Not checked in')).toBeInTheDocument();
  });

  it('shows "Not checked in" when liveCheckIns is empty', () => {
    render(<CheckInBadge registrationId="registration-1" liveCheckIns={[]} />);

    expect(screen.getByText('Not checked in')).toBeInTheDocument();
  });
});
