import { PageHeader } from '@/components/PageHeader';
import { PageHeaderGroup } from '@/components/PageHeaderGroup';
import { ActionButton } from '@/components/ActionButton';
import { EventsFilter } from './_components/events-filter';
import { EventsList } from './_components/events-list';

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <PageHeaderGroup>
        <PageHeader title="Events" subtitle="Manage your events" />
        <ActionButton action="create" href="/events/new" label="New event" />
      </PageHeaderGroup>

      <EventsFilter />

      <EventsList />
    </div>
  );
}
