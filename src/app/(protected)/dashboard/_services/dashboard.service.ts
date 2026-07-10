import { api } from '@/core/api/client';
import { DashboardStats } from '@/shared/types/dashboard';

export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};
