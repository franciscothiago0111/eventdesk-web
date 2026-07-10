import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Registration } from '@/shared/types/registration';
import {
  PublicRegistrationForm,
  PUBLIC_REGISTRATION_FORM_ID,
} from './public-registration-form';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  requiresPass: boolean;
  isSubmitting: boolean;
  onPendingChange: (isPending: boolean) => void;
  onRegistered: (registration: Registration) => void;
}

export function RegistrationModal({
  isOpen,
  onClose,
  eventId,
  requiresPass,
  isSubmitting,
  onPendingChange,
  onRegistered,
}: RegistrationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm registration"
      size="sm"
      bodyClassName="pb-6"
      footer={
        <>
          <Button
            variant="secondary"
            fullWidth
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={PUBLIC_REGISTRATION_FORM_ID}
            fullWidth
            isLoading={isSubmitting}
          >
            Confirm registration
          </Button>
        </>
      }
    >
      <PublicRegistrationForm
        eventId={eventId}
        requiresPass={requiresPass}
        onPendingChange={onPendingChange}
        onRegistered={onRegistered}
      />
    </Modal>
  );
}
