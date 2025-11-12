import apiClient from '../api/client';
import { Feedback, CreateFeedbackDto, UpdateFeedbackDto } from '../types';

export const feedbackService = {
  getAll: async (): Promise<Feedback[]> => {
    return apiClient.get('/feedback');
  },

  getById: async (id: string): Promise<Feedback> => {
    return apiClient.get(`/feedback/${id}`);
  },

  create: async (data: CreateFeedbackDto): Promise<Feedback> => {
    return apiClient.post('/feedback', data);
  },

  update: async (id: string, data: UpdateFeedbackDto): Promise<Feedback> => {
    return apiClient.patch(`/feedback/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/feedback/${id}`);
  },
};

