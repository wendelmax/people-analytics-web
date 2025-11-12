import apiClient from '../api/client';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types';

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    return apiClient.get('/projects');
  },

  getById: async (id: string): Promise<Project> => {
    return apiClient.get(`/projects/${id}`);
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    return apiClient.post('/projects', data);
  },

  update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
    return apiClient.patch(`/projects/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/projects/${id}`);
  },
};

