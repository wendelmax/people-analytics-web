import apiClient from '../api/client';
import { Goal, CreateGoalDto, UpdateGoalDto } from '../types';

export const goalService = {
  getAll: async (): Promise<Goal[]> => {
    return apiClient.get('/goals');
  },

  getById: async (id: string): Promise<Goal> => {
    return apiClient.get(`/goals/${id}`);
  },

  create: async (data: CreateGoalDto): Promise<Goal> => {
    return apiClient.post('/goals', data);
  },

  update: async (id: string, data: UpdateGoalDto): Promise<Goal> => {
    return apiClient.patch(`/goals/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/goals/${id}`);
  },
};

