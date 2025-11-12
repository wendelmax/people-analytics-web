import apiClient from '../api/client';
import { Separation, CreateSeparationDto, UpdateSeparationDto } from '../types';

export const separationService = {
  getAll: async (): Promise<Separation[]> => {
    return await apiClient.get('/separations');
  },

  getById: async (id: string): Promise<Separation> => {
    return await apiClient.get(`/separations/${id}`);
  },

  create: async (data: CreateSeparationDto): Promise<Separation> => {
    return await apiClient.post('/separations', data);
  },

  update: async (id: string, data: UpdateSeparationDto): Promise<Separation> => {
    return await apiClient.patch(`/separations/${id}`, data);
  },

  completeChecklistItem: async (separationId: string, itemId: string, notes?: string): Promise<Separation> => {
    return await apiClient.patch(`/separations/${separationId}/checklist/${itemId}`, { notes });
  },

  completeExitInterview: async (separationId: string, notes: string): Promise<Separation> => {
    return await apiClient.post(`/separations/${separationId}/exit-interview`, { notes });
  },

  approve: async (id: string): Promise<Separation> => {
    return await apiClient.post(`/separations/${id}/approve`);
  },
};

