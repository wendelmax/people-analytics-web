import apiClient from '../api/client';
import { Position, CreatePositionDto, UpdatePositionDto } from '../types';

export const positionService = {
  getAll: async (): Promise<Position[]> => {
    return apiClient.get('/positions');
  },

  getById: async (id: string): Promise<Position> => {
    return apiClient.get(`/positions/${id}`);
  },

  create: async (data: CreatePositionDto): Promise<Position> => {
    return apiClient.post('/positions', data);
  },

  update: async (id: string, data: UpdatePositionDto): Promise<Position> => {
    return apiClient.patch(`/positions/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/positions/${id}`);
  },
};

