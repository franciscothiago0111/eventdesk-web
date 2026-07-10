'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Link2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Event } from '@/shared/types/event';
import { usePDFDownload } from '@/core/hooks/use-pdf-download';
import { useCloseEvent, usePublishEvent } from '../../_hooks/use-events';

interface EventActionsProps {
  event: Event;
}

export function EventActions({ event }: EventActionsProps) {
  const router = useRouter();
  const publishEvent = usePublishEvent(event.id);
  const closeEvent = useCloseEvent(event.id);
  const { generatePDF, isGenerating: isGeneratingPDF } = usePDFDownload();

  const handleCopyPublicLink = async () => {
    const publicUrl = `${window.location.origin}/e/${event.id}`;
    await navigator.clipboard.writeText(publicUrl);
    toast.success('Registration link copied to clipboard');
  };

  const handleDownloadPDF = () =>
    generatePDF({
      template: 'event-details',
      data: event,
      options: {
        filename: `event-${event.id}-${event.name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        title: `Event: ${event.name}`,
        subject: 'Event Details Report',
      },
    });

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        isLoading={isGeneratingPDF}
        leftIcon={<Download className="size-4" />}
        onClick={handleDownloadPDF}
      >
        Download PDF
      </Button>
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
