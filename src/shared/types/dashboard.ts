import type { EventCategory, EventStatus } from './event';

export interface DashboardStats {
  totalEvents: number;
  totalCapacity: number;
  totalRegistered: number;
  totalCheckIns: number;
  eventsByStatus: Record<EventStatus, number>;
  eventsByCategory: Record<EventCategory, number>;
}
