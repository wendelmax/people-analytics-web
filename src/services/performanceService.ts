import apiClient from '../api/client';
import {
  PerformanceReview,
  CreatePerformanceReviewDto,
  UpdatePerformanceReviewDto,
} from '../types';

export const performanceService = {
  getAll: async (): Promise<PerformanceReview[]> => {
    return apiClient.get('/performance');
  },

  getById: async (id: string): Promise<PerformanceReview> => {
    return apiClient.get(`/performance/${id}`);
  },

  create: async (data: CreatePerformanceReviewDto): Promise<PerformanceReview> => {
    return apiClient.post('/performance', data);
  },

  update: async (id: string, data: UpdatePerformanceReviewDto): Promise<PerformanceReview> => {
    return apiClient.patch(`/performance/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/performance/${id}`);
  },
};

