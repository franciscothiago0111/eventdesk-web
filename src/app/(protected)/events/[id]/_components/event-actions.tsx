'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Event } from '@/shared/types/event';
import { useCloseEvent, usePublishEvent } from '../../_hooks/use-events';

interface EventActionsProps {
  event: Event;
}

export function EventActions({ event }: EventActionsProps) {
  const router = useRouter();
  const publishEvent = usePublishEvent(event.id);
  const closeEvent = useCloseEvent(event.id);

  const handleCopyPublicLink = async () => {
    const publicUrl = `${window.location.origin}/e/${event.id}`;
    await navigator.clipboard.writeText(publicUrl);
    toast.success('Registration link copied to clipboard');
  };

  return (
    <div className="flex flex-wrap gap-3">
      {event.status === 'DRAFT' && (
        <Button
          variant="secondary"
          onClick={() => router.push(`/events/${event.id}/edit`)}
        >
          Edit
        </Button>
      )}
      {event.status === 'DRAFT' && (
        <Button
          isLoading={publishEvent.isPending}
          onClick={() =>
            publishEvent.mutate(undefined, {
              onSuccess: () => toast.success('Event published'),
              onError: () => toast.error('Could not publish the event'),
            })
          }
        >
          Publish
        </Button>
      )}
      {event.status === 'PUBLISHED' && (
        <Button
          variant="danger"
          isLoading={closeEvent.isPending}
          onClick={() =>
            closeEvent.mutate(undefined, {
              onSuccess: () => toast.success('Event closed'),
              onError: () => toast.error('Could not close the event'),
            })
          }
        >
          Close
        </Button>
      )}
      {event.status === 'PUBLISHED' && (
        <Button
          variant="secondary"
          leftIcon={<Link2 className="size-4" />}
          onClick={handleCopyPublicLink}
        >
          Share registration link
        </Button>
      )}
    </div>
  );
}
