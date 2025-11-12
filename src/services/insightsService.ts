import apiClient from '../api/client';
import { Insight } from '../types';

export const insightsService = {
  getAll: async (): Promise<Insight[]> => {
    const response = await apiClient.get('/insights');
    return response.data;
  },

  getById: async (id: string): Promise<Insight> => {
    const response = await apiClient.get(`/insights/${id}`);
    return response.data;
  },

  getPerformanceInsights: async (employeeId: string): Promise<Record<string, unknown>> => {
    const response = await apiClient.get<Record<string, unknown>>(`/performance-insights/employee/${employeeId}`);
    return response.data;
  },

  getTeamInsights: async (teamId: string): Promise<Record<string, unknown>> => {
    const response = await apiClient.get<Record<string, unknown>>(`/performance-insights/team/${teamId}`);
    return response.data;
  },

  getDepartmentInsights: async (departmentId: string): Promise<Record<string, unknown>> => {
    const response = await apiClient.get<Record<string, unknown>>(`/performance-insights/department/${departmentId}`);
    return response.data;
  },
};

