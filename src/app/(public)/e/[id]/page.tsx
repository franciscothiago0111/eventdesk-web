'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Registration } from '@/shared/types/registration';
import { usePublicEvent } from './_hooks/use-public-event';
import { EventHero } from './_components/event-hero';
import { EventScheduleCard } from './_components/event-schedule-card';
import { EventGalleryCard } from './_components/event-gallery-card';
import { RegistrationCard } from './_components/registration-card';
import { RegistrationModal } from './_components/registration-modal';

export default function PublicEventPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = usePublicEvent(id);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const spotsLeft = event ? event.capacity - event.registered : 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-4 sm:p-6">
      <LoadingState isLoading={isLoading}>
        {isError || !event ? (
          <ErrorState
            message="This event isn't available for registration."
            showBackButton={false}
          />
        ) : (
          <div className="flex flex-col gap-8">
            <EventHero event={event} spotsLeft={spotsLeft} />

            {event.description && (
              <p className="whitespace-pre-line text-slate-700">
                {event.description}
              </p>
            )}

            <EventScheduleCard schedule={event.schedule} />
            <EventGalleryCard images={event.images} />

            <RegistrationCard
              registration={registration}
              spotsLeft={spotsLeft}
              onRegisterClick={() => setIsRegisterModalOpen(true)}
            />
          </div>
        )}
      </LoadingState>

      {event && (
        <RegistrationModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          eventId={event.id}
          requiresPass={event.requiresPass}
          isSubmitting={isSubmitting}
          onPendingChange={setIsSubmitting}
          onRegistered={(newRegistration) => {
            setRegistration(newRegistration);
            setIsRegisterModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
