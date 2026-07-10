'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/core/api/api-error';
import { Registration } from '@/shared/types/registration';
import { usePublicRegistration } from '../_hooks/use-public-event';
import {
  buildPublicRegistrationSchema,
  PublicRegistrationValues,
} from '../_schemas/public-registration.schema';

export const PUBLIC_REGISTRATION_FORM_ID = 'public-registration-form';

interface PublicRegistrationFormProps {
  eventId: string;
  requiresPass: boolean;
  onRegistered: (registration: Registration) => void;
  onPendingChange?: (isPending: boolean) => void;
}

export function PublicRegistrationForm({
  eventId,
  requiresPass,
  onRegistered,
  onPendingChange,
}: PublicRegistrationFormProps) {
  const [passError, setPassError] = useState<string | undefined>();
  const register_ = usePublicRegistration(eventId);

  useEffect(() => {
    onPendingChange?.(register_.isPending);
  }, [register_.isPending, onPendingChange]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublicRegistrationValues>({
    resolver: zodResolver(buildPublicRegistrationSchema(requiresPass)),
  });

  const onSubmit = (values: PublicRegistrationValues) => {
    setPassError(undefined);
    register_.mutate(
      {
        attendeeName: values.attendeeName,
        attendeeEmail: values.attendeeEmail,
        pass: values.pass,
      },
      {
        onSuccess: (registration) => onRegistered(registration),
        onError: (error) => {
          if (
            error instanceof ApiError &&
            error.statusCode === 400 &&
            error.message.toLowerCase().includes('pass')
          ) {
            setPassError(error.message);
            return;
          }
          const message =
            error instanceof ApiError
              ? error.message
              : 'Could not complete registration. Please try again.';
          toast.error(message);
        },
      },
    );
  };

  return (
    <form
      id={PUBLIC_REGISTRATION_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 py-1"
    >
      <p className="text-sm text-slate-500">
        You&apos;re one step away. Fill in your details below and we&apos;ll
        send a check-in code to your email.
      </p>
      <Input
        label="Full name"
        placeholder="Jane Doe"
        error={errors.attendeeName?.message}
        {...register('attendeeName')}
      />
      <Input
        type="email"
        label="Email"
        placeholder="jane@example.com"
        error={errors.attendeeEmail?.message}
        {...register('attendeeEmail')}
      />
      {requiresPass && (
        <Input
          type="password"
          label="Access pass"
          placeholder="Enter the event access pass"
          error={errors.pass?.message ?? passError}
          {...register('pass')}
        />
      )}
    </form>
  );
}
