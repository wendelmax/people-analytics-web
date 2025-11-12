import apiClient from '../api/client';
import {
  KnowledgeArticle,
  CreateKnowledgeArticleDto,
  UpdateKnowledgeArticleDto,
} from '../types';

export const knowledgeBaseService = {
  getAll: async (): Promise<KnowledgeArticle[]> => {
    return apiClient.get('/knowledge-base');
  },

  getById: async (id: string): Promise<KnowledgeArticle> => {
    return apiClient.get(`/knowledge-base/${id}`);
  },

  create: async (data: CreateKnowledgeArticleDto): Promise<KnowledgeArticle> => {
    return apiClient.post('/knowledge-base', data);
  },

  update: async (id: string, data: UpdateKnowledgeArticleDto): Promise<KnowledgeArticle> => {
    return apiClient.patch(`/knowledge-base/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/knowledge-base/${id}`);
  },
};

