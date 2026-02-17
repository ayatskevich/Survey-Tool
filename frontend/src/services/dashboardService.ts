import { api } from './api';
import { DashboardStatsDto } from '@/types/dashboard';

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStatsDto> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
