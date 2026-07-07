'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LiveCheckIn } from '@/core/realtime/use-live-checkins';

const PRIMARY = '#15803d';

const emptyData = [{ time: '--:--', checkIns: 0 }];

interface CheckInTrendChartProps {
  checkIns: LiveCheckIn[];
}

// Buckets check-ins by the minute they were received and turns that into a
// cumulative count, since the socket stream only gives us discrete events.
function toTrendData(checkIns: LiveCheckIn[]) {
  if (checkIns.length === 0) return emptyData;

  const countsByMinute = new Map<string, number>();
  for (const checkIn of checkIns) {
    const time = new Date(checkIn.receivedAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    countsByMinute.set(time, (countsByMinute.get(time) ?? 0) + 1);
  }

  let cumulative = 0;
  return Array.from(countsByMinute.entries()).map(([time, count]) => {
    cumulative += count;
    return { time, checkIns: cumulative };
  });
}

export function CheckInTrendChart({ checkIns }: CheckInTrendChartProps) {
  const data = toTrendData(checkIns);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-neutral-950">
          Check-ins over time
        </h3>
        <span className="text-xs text-neutral-500">
          {checkIns.length > 0
            ? `${checkIns.length} live check-in${checkIns.length === 1 ? '' : 's'}`
            : 'Waiting for check-ins'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ left: -16 }}>
          <defs>
            <linearGradient id="checkInFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.25} />
              <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-neutral-200)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: 'var(--color-neutral-600)' }}
            axisLine={{ stroke: 'var(--color-neutral-300)' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: 'var(--color-neutral-600)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="checkIns"
            stroke={PRIMARY}
            strokeWidth={2}
            fill="url(#checkInFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
