import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../_services/dashboard.service';

const dashboardStatsKey = ['dashboard', 'stats'] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardStatsKey,
    queryFn: dashboardService.getStats,
  });
}
