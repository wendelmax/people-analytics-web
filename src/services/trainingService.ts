import apiClient from '../api/client';
import { Training, CreateTrainingDto, UpdateTrainingDto } from '../types';

export const trainingService = {
  getAll: async (): Promise<Training[]> => {
    return apiClient.get('/trainings');
  },

  getById: async (id: string): Promise<Training> => {
    return apiClient.get(`/trainings/${id}`);
  },

  create: async (data: CreateTrainingDto): Promise<Training> => {
    return apiClient.post('/trainings', data);
  },

  update: async (id: string, data: UpdateTrainingDto): Promise<Training> => {
    return apiClient.patch(`/trainings/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/trainings/${id}`);
  },
};

