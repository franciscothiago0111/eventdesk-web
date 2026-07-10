import { Card } from '@/components/ui/Card';
import { ScheduleItem } from '@/shared/types/event';
import { formatDateRange } from '@/shared/utils/date';

interface EventScheduleCardProps {
  schedule: ScheduleItem[];
}

export function EventScheduleCard({ schedule }: EventScheduleCardProps) {
  if (schedule.length === 0) return null;

  return (
    <Card title="Schedule" variant="bordered" padding="md">
      <ul className="flex flex-col gap-2">
        {schedule.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 p-3">
            <p className="font-medium text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">
              {formatDateRange(item.startTime, item.endTime)}
            </p>
            {item.description && (
              <p className="mt-1 text-sm text-slate-700">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
