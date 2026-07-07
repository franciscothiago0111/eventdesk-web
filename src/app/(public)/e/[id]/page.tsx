'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Registration } from '@/shared/types/registration';
import { usePublicEvent } from './_hooks/use-public-event';
import { PublicRegistrationForm } from './_components/public-registration-form';

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
}

export default function PublicEventPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = usePublicEvent(id);
  const [registration, setRegistration] = useState<Registration | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <LoadingState isLoading={isLoading}>
        {isError || !event ? (
          <ErrorState
            message="This event isn't available for registration."
            showBackButton={false}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {event.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImageUrl}
                alt=""
                className="h-48 w-full rounded-2xl object-cover"
              />
            )}
            <div className="flex items-center gap-4">
              {event.profileImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.profileImageUrl}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-semibold">{event.name}</h1>
                <p className="text-sm text-slate-500">
                  {formatDateRange(event.startDate, event.endDate)}
                </p>
                {event.location && (
                  <p className="text-sm text-slate-500">{event.location}</p>
                )}
              </div>
            </div>

            {event.description && (
              <p className="text-slate-700">{event.description}</p>
            )}

            <p className="text-sm text-slate-500">
              {event.capacity - event.registered} of {event.capacity} spots
              left
            </p>

            <Card title={registration ? 'You are registered!' : 'Register'}>
              {registration ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    A confirmation was sent to your email. Keep this check-in
                    code for the event:
                  </p>
                  <p className="rounded-lg bg-slate-100 px-4 py-3 text-center font-mono text-lg tracking-widest">
                    {registration.checkInCode}
                  </p>
                </div>
              ) : (
                <PublicRegistrationForm
                  eventId={event.id}
                  requiresPass={event.requiresPass}
                  onRegistered={setRegistration}
                />
              )}
            </Card>
          </div>
        )}
      </LoadingState>
    </div>
  );
}
