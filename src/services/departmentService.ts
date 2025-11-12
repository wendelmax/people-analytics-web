import apiClient from '../api/client';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types';

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    return apiClient.get('/departments');
  },

  getById: async (id: string): Promise<Department> => {
    return apiClient.get(`/departments/${id}`);
  },

  create: async (data: CreateDepartmentDto): Promise<Department> => {
    return apiClient.post('/departments', data);
  },

  update: async (id: string, data: UpdateDepartmentDto): Promise<Department> => {
    return apiClient.patch(`/departments/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/departments/${id}`);
  },
};

