'use client';

import { Filter } from '@/components/Filter';

export function EventsFilter() {
  return (
    <Filter
      showNameFilter
      namePlaceholder="Search by name..."
      fields={[
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'DRAFT', label: 'Draft' },
            { value: 'PUBLISHED', label: 'Published' },
            { value: 'CLOSED', label: 'Closed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ],
        },
      ]}
    />
  );
}
