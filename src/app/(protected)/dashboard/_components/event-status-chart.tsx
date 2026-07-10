'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { EventStatus } from '@/shared/types/event';

const STATUS_LABEL: Record<EventStatus, string> = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
};

const STATUS_COLOR: Record<EventStatus, string> = {
  PUBLISHED: 'var(--color-success-main)',
  DRAFT: 'var(--color-neutral-400)',
  CLOSED: 'var(--color-neutral-700)',
  CANCELLED: 'var(--color-error-dark)',
};

interface EventStatusChartProps {
  counts: Record<EventStatus, number>;
}

export function EventStatusChart({ counts }: EventStatusChartProps) {
  const data = (Object.keys(STATUS_LABEL) as EventStatus[])
    .map((status) => ({
      status,
      label: STATUS_LABEL[status],
      value: counts[status] ?? 0,
      color: STATUS_COLOR[status],
    }))
    .filter((entry) => entry.value > 0);

  if (data.length === 0) {
    return <p className="text-sm text-neutral-500">No events yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((entry) => (
          <div
            key={entry.status}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-2 text-neutral-600">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: entry.color }}
              />
              {entry.label}
            </span>
            <span className="font-semibold text-neutral-950">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
