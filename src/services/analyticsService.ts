import apiClient from '../api/client';
import {
  AnalyticsOverview,
  PerformanceTrend,
  PredictiveAnalytics,
  DEIBAnalytics,
  WorkforceMonitoring,
} from '../types';

export const analyticsService = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await apiClient.get('/analytics/overview');
    return response.data;
  },

  getEmployeeAnalytics: async (employeeId: string): Promise<Record<string, unknown>> => {
    const response = await apiClient.get<Record<string, unknown>>(`/analytics/employee/${employeeId}`);
    return response.data;
  },

  getPerformanceTrend: async (startDate: string, endDate: string): Promise<PerformanceTrend[]> => {
    const response = await apiClient.get(`/analytics/performance-trend?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getPredictiveAnalytics: async (): Promise<PredictiveAnalytics> => {
    const response = await apiClient.get('/analytics/predictive');
    return response.data;
  },

  getDEIBAnalytics: async (): Promise<DEIBAnalytics> => {
    const response = await apiClient.get('/analytics/deib');
    return response.data;
  },

  getWorkforceMonitoring: async (): Promise<WorkforceMonitoring> => {
    const response = await apiClient.get('/analytics/workforce-monitoring');
    return response.data;
  },
};

