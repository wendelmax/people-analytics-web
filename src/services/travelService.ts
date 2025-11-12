import apiClient from '../api/client';
import { TravelRequest, CreateTravelRequestDto, UpdateTravelRequestDto } from '../types';

export const travelService = {
  getAll: async (): Promise<TravelRequest[]> => {
    return await apiClient.get('/travel');
  },

  getById: async (id: string): Promise<TravelRequest> => {
    return await apiClient.get(`/travel/${id}`);
  },

  create: async (data: CreateTravelRequestDto): Promise<TravelRequest> => {
    return await apiClient.post('/travel', data);
  },

  update: async (id: string, data: UpdateTravelRequestDto): Promise<TravelRequest> => {
    return await apiClient.patch(`/travel/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/travel/${id}`);
  },

  getMyTravels: async (): Promise<TravelRequest[]> => {
    return await apiClient.get('/travel/my');
  },

  approve: async (id: string): Promise<TravelRequest> => {
    return await apiClient.post(`/travel/${id}/approve`);
  },

  reject: async (id: string, reason: string): Promise<TravelRequest> => {
    return await apiClient.post(`/travel/${id}/reject`, { reason });
  },
};

