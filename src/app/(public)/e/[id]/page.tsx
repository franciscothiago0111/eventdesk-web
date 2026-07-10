'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Registration } from '@/shared/types/registration';
import { getGalleryImages, getImageByType } from '@/shared/utils/event-images';
import { eventCategoryLabel } from '@/shared/utils/event-category';
import { usePublicEvent } from './_hooks/use-public-event';
import {
  PublicRegistrationForm,
  PUBLIC_REGISTRATION_FORM_ID,
} from './_components/public-registration-form';

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
            {/* Hero */}
            <div className="flex flex-col gap-4">
              {(() => {
                const coverImage = getImageByType(event.images, 'COVER');
                const profileImage = getImageByType(event.images, 'PROFILE');
                return (
                  <div className="relative">
                    <div className="h-40 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-56">
                      {coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverImage.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    {profileImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileImage.url}
                        alt=""
                        className="absolute -bottom-8 left-5 h-16 w-16 rounded-full border-4 border-white object-cover shadow-md sm:h-20 sm:w-20"
                      />
                    )}
                  </div>
                );
              })()}

              <div className="flex flex-col gap-2 pt-6">
                <Badge variant="info" className="w-fit">
                  {eventCategoryLabel(event.category)}
                </Badge>
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {event.name}
                </h1>
                <div className="flex flex-col gap-1.5 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    {formatDateRange(event.startDate, event.endDate)}
                  </span>
                  {event.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {event.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 shrink-0" />
                    {spotsLeft} of {event.capacity} spots left
                  </span>
                </div>
              </div>
            </div>

            {event.description && (
              <p className="whitespace-pre-line text-slate-700">
                {event.description}
              </p>
            )}

            {event.schedule.length > 0 && (
              <Card title="Schedule" variant="bordered" padding="md">
                <ul className="flex flex-col gap-2">
                  {event.schedule.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">
                        {formatDateRange(item.startTime, item.endTime)}
                      </p>
                      {item.description && (
                        <p className="mt-1 text-sm text-slate-700">
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {getGalleryImages(event.images).length > 0 && (
              <Card title="Gallery" variant="bordered" padding="md">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {getGalleryImages(event.images).map((image) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={image.id}
                      src={image.url}
                      alt={image.caption ?? ''}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              </Card>
            )}

            <Card
              variant="elevated"
              padding="lg"
              title={registration ? 'You are registered!' : 'Ready to join?'}
              description={
                registration
                  ? undefined
                  : 'Reserve your spot in a couple of clicks.'
              }
            >
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
                <Button
                  fullWidth
                  size="lg"
                  disabled={spotsLeft <= 0}
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  {spotsLeft <= 0 ? 'Fully booked' : 'Register'}
                </Button>
              )}
            </Card>
          </div>
        )}
      </LoadingState>

      {event && (
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          title="Confirm registration"
          size="sm"
          bodyClassName="pb-6"
          footer={
            <>
              <Button
                variant="secondary"
                fullWidth
                disabled={isSubmitting}
                onClick={() => setIsRegisterModalOpen(false)}
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
            eventId={event.id}
            requiresPass={event.requiresPass}
            onPendingChange={setIsSubmitting}
            onRegistered={(newRegistration) => {
              setRegistration(newRegistration);
              setIsRegisterModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
