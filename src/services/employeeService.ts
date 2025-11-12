import apiClient from '../api/client';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types';

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    return apiClient.get('/employee');
  },

  getById: async (id: string): Promise<Employee> => {
    return apiClient.get(`/employee/${id}`);
  },

  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    return apiClient.post('/employee', data);
  },

  update: async (id: string, data: UpdateEmployeeDto): Promise<Employee> => {
    return apiClient.patch(`/employee/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/employee/${id}`);
  },
};

