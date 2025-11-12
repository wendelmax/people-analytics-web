import apiClient from '../api/client';

export const careerService = {
  getOverview: async (employeeId: string): Promise<Record<string, unknown>> => {
    const response = await apiClient.get<Record<string, unknown>>(`/career/overview/${employeeId}`);
    return response.data;
  },

  getProgression: async (employeeId: string): Promise<Record<string, unknown>> => {
    const response = await apiClient.get<Record<string, unknown>>(`/career/progression/${employeeId}`);
    return response.data;
  },
};

