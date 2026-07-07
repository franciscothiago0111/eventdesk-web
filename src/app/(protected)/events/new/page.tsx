'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { BackButton } from '@/components/BackButton';
import { EventForm } from '../_components/event-form';
import { useCreateEvent } from '../_hooks/use-events';

export default function NewEventPage() {
  const router = useRouter();
  const createEvent = useCreateEvent();

  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeaderGroup>
        <PageHeader title="New event" />
        <BackButton text="Back" />
      </PageHeaderGroup>

      <EventForm
        submitLabel="Create event"
        isSubmitting={createEvent.isPending}
        onSubmit={(values) => {
          createEvent.mutate(values, {
            onSuccess: (event) => {
              toast.success('Event created');
              router.push(`/events/${event.id}`);
            },
            onError: () => toast.error('Could not create the event'),
          });
        }}
      />
    </div>
  );
}
