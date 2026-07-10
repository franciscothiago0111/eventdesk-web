import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { Event, EventStatus } from '@/shared/types/event';
import { eventCategoryLabel } from '@/shared/utils/event-category';
import { commonStyles } from '../styles/common.styles';
import { Header, Section, Field, Badge, Footer } from '../components/common';
import { KeepTogether, NoBreak } from '../utils/page-breaks';
import type { IPDFTemplate, IPDFGenerationOptions } from '../types';

const statusBadgeVariant: Record<EventStatus, 'success' | 'primary' | 'danger' | 'secondary'> = {
  PUBLISHED: 'success',
  DRAFT: 'secondary',
  CLOSED: 'primary',
  CANCELLED: 'danger',
};

function EventDetailsDocument({
  data: event,
  options,
}: {
  data: Event;
  options?: IPDFGenerationOptions;
}) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Document
      author={options?.author || 'EventDesk'}
      title={options?.title || `Event: ${event.name}`}
      subject={options?.subject || 'Event Details'}
    >
      <Page size="A4" style={commonStyles.page} wrap>
        <NoBreak>
          <Header title={event.name} subtitle={`Generated on ${dateFormatter.format(new Date())}`} />
        </NoBreak>

        <KeepTogether>
          <Section title="Event Information" wrap={false} minPresenceAhead={120}>
            <View style={commonStyles.field} wrap={false} minPresenceAhead={35}>
              <Text style={commonStyles.fieldLabel}>Status</Text>
              <Badge text={event.status} variant={statusBadgeVariant[event.status]} />
            </View>
            <Field label="Category" value={eventCategoryLabel(event.category)} />
            <Field label="Location" value={event.location} />
            <Field label="Capacity" value={`${event.registered} / ${event.capacity} registered`} />
          </Section>
        </KeepTogether>

        <KeepTogether>
          <Section title="Schedule Window" minPresenceAhead={80}>
            <Field label="Starts" value={dateFormatter.format(new Date(event.startDate))} />
            <Field label="Ends" value={dateFormatter.format(new Date(event.endDate))} />
          </Section>
        </KeepTogether>

        {event.description && (
          <Section title="Description">
            <Text style={commonStyles.fieldValue}>{event.description}</Text>
          </Section>
        )}

        {event.schedule.length > 0 && (
          <Section title="Agenda">
            {event.schedule.map((item) => (
              <View key={item.id} style={commonStyles.field} wrap={false} minPresenceAhead={40}>
                <Text style={commonStyles.fieldLabel}>
                  {dateFormatter.format(new Date(item.startTime))} –{' '}
                  {dateFormatter.format(new Date(item.endTime))}
                </Text>
                <Text style={commonStyles.fieldValue}>{item.title}</Text>
                {item.description && (
                  <Text style={[commonStyles.fieldValue, commonStyles.textMuted]}>
                    {item.description}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        <Footer leftText="EventDesk" rightText={event.name} />
      </Page>
    </Document>
  );
}

export const eventDetailsPDFTemplate: IPDFTemplate<Event> = {
  name: 'event-details',
  Document: EventDetailsDocument,
};
