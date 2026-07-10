'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { EventCategory } from '@/shared/types/event';

interface EventCategoryChartProps {
  counts: Record<EventCategory, number>;
}

export function EventCategoryChart({ counts }: EventCategoryChartProps) {
  const data = Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) {
    return <p className="text-sm text-neutral-500">No events yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-neutral-200)"
          horizontal={false}
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 12, fill: 'var(--color-neutral-600)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="category"
          width={90}
          tick={{ fontSize: 12, fill: 'var(--color-neutral-600)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: 'var(--color-neutral-50)' }} />
        <Bar
          dataKey="count"
          fill="var(--color-primary-main)"
          radius={[0, 4, 4, 0]}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
