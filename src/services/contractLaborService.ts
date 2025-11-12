import apiClient from '../api/client';
import { Contractor, ContractLabor, CreateContractorDto, UpdateContractorDto, CreateContractLaborDto, UpdateContractLaborDto, ContractLaborAttendance } from '../types';

export const contractLaborService = {
  getContractors: async (): Promise<Contractor[]> => {
    return await apiClient.get('/contract-labor/contractors');
  },

  getContractorById: async (id: string): Promise<Contractor> => {
    return await apiClient.get(`/contract-labor/contractors/${id}`);
  },

  createContractor: async (data: CreateContractorDto): Promise<Contractor> => {
    return await apiClient.post('/contract-labor/contractors', data);
  },

  updateContractor: async (id: string, data: UpdateContractorDto): Promise<Contractor> => {
    return await apiClient.patch(`/contract-labor/contractors/${id}`, data);
  },

  deleteContractor: async (id: string): Promise<void> => {
    await apiClient.delete(`/contract-labor/contractors/${id}`);
  },

  getAll: async (): Promise<ContractLabor[]> => {
    return await apiClient.get('/contract-labor');
  },

  getById: async (id: string): Promise<ContractLabor> => {
    return await apiClient.get(`/contract-labor/${id}`);
  },

  create: async (data: CreateContractLaborDto): Promise<ContractLabor> => {
    return await apiClient.post('/contract-labor', data);
  },

  update: async (id: string, data: UpdateContractLaborDto): Promise<ContractLabor> => {
    return await apiClient.patch(`/contract-labor/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/contract-labor/${id}`);
  },

  getAttendance: async (laborId: string, startDate?: string, endDate?: string): Promise<ContractLaborAttendance[]> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get<ContractLaborAttendance[]>(`/contract-labor/${laborId}/attendance`, { params });
    return response.data;
  },

  recordAttendance: async (laborId: string, data: Omit<ContractLaborAttendance, 'id' | 'laborId'>): Promise<ContractLaborAttendance> => {
    return await apiClient.post(`/contract-labor/${laborId}/attendance`, data);
  },
};

