import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Registration } from '@/shared/types/registration';
import { LiveCheckIn } from '@/core/realtime/use-live-checkins';
import RegistrationsPage from './page';

const useRegistrationsMock = vi.fn();
const useLiveCheckInsMock = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'event-1' }),
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

vi.mock('./_hooks/use-registrations', () => ({
  useRegistrations: () => useRegistrationsMock(),
}));

vi.mock('@/core/realtime/use-live-checkins', () => ({
  useLiveCheckIns: () => useLiveCheckInsMock(),
}));

const registrations: Registration[] = [
  {
    id: 'registration-1',
    eventId: 'event-1',
    attendeeName: 'Ada Lovelace',
    attendeeEmail: 'ada@example.com',
    checkInCode: 'ABC123',
    status: 'CONFIRMED',
  },
  {
    id: 'registration-2',
    eventId: 'event-1',
    attendeeName: 'Alan Turing',
    attendeeEmail: 'alan@example.com',
    checkInCode: 'DEF456',
    status: 'CANCELLED',
  },
];

const liveCheckIns: LiveCheckIn[] = [
  {
    checkInId: 'check-in-1',
    registrationId: 'registration-1',
    checkedInById: 'staff-1',
    fromOfflineSync: false,
    receivedAt: '2026-07-07T10:00:00.000Z',
  },
];

describe('RegistrationsPage', () => {
  it('renders a row per registration with live check-in status', () => {
    useRegistrationsMock.mockReturnValue({
      data: registrations,
      isLoading: false,
      isError: false,
    });
    useLiveCheckInsMock.mockReturnValue(liveCheckIns);

    render(<RegistrationsPage />);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Alan Turing')).toBeInTheDocument();
    expect(screen.getByText('Checked in')).toBeInTheDocument();
    expect(screen.getByText('Not checked in')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeEnabled();
  });

  it('disables the CSV export button when there are no registrations', () => {
    useRegistrationsMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    useLiveCheckInsMock.mockReturnValue([]);

    render(<RegistrationsPage />);

    expect(screen.getByText('No registrations yet.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeDisabled();
  });

  it('shows an error state when the registrations request fails', () => {
    useRegistrationsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    useLiveCheckInsMock.mockReturnValue([]);

    render(<RegistrationsPage />);

    expect(
      screen.getByText('Could not load registrations.'),
    ).toBeInTheDocument();
  });
});
