import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Registration } from '@/shared/types/registration';

interface RegistrationCardProps {
  registration: Registration | null;
  spotsLeft: number;
  onRegisterClick: () => void;
}

export function RegistrationCard({
  registration,
  spotsLeft,
  onRegisterClick,
}: RegistrationCardProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      title={registration ? 'You are registered!' : 'Ready to join?'}
      description={
        registration ? undefined : 'Reserve your spot in a couple of clicks.'
      }
    >
      {registration ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            A confirmation was sent to your email. Keep this check-in code for
            the event:
          </p>
          <p className="rounded-lg bg-slate-100 px-4 py-3 text-center font-mono text-lg tracking-widest">
            {registration.checkInCode}
          </p>
        </div>
      ) : (
        <Button
          fullWidth
          size="lg"
          disabled={spotsLeft <= 0}
          onClick={onRegisterClick}
        >
          {spotsLeft <= 0 ? 'Fully booked' : 'Register'}
        </Button>
      )}
    </Card>
  );
}
