import apiClient from '../api/client';
import { MentoringRelationship, CreateMentoringDto, UpdateMentoringDto } from '../types';

export const mentoringService = {
  getAll: async (): Promise<MentoringRelationship[]> => {
    return apiClient.get('/mentoring');
  },

  getById: async (id: string): Promise<MentoringRelationship> => {
    return apiClient.get(`/mentoring/${id}`);
  },

  create: async (data: CreateMentoringDto): Promise<MentoringRelationship> => {
    return apiClient.post('/mentoring', data);
  },

  update: async (id: string, data: UpdateMentoringDto): Promise<MentoringRelationship> => {
    return apiClient.patch(`/mentoring/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/mentoring/${id}`);
  },
};

