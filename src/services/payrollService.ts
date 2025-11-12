import apiClient from '../api/client';
import { Payroll, CreatePayrollDto, UpdatePayrollDto } from '../types';

export const payrollService = {
  getAll: async (period?: string): Promise<Payroll[]> => {
    const params = period ? { period } : {};
    return await apiClient.get('/payroll', { params });
  },

  getById: async (id: string): Promise<Payroll> => {
    return await apiClient.get(`/payroll/${id}`);
  },

  create: async (data: CreatePayrollDto): Promise<Payroll> => {
    return await apiClient.post('/payroll', data);
  },

  update: async (id: string, data: UpdatePayrollDto): Promise<Payroll> => {
    return await apiClient.patch(`/payroll/${id}`, data);
  },

  processPeriod: async (period: string): Promise<Payroll[]> => {
    return await apiClient.post('/payroll/process', { period });
  },

  approve: async (id: string): Promise<Payroll> => {
    return await apiClient.post(`/payroll/${id}/approve`);
  },

  getMyPayslips: async (): Promise<Payroll[]> => {
    return await apiClient.get('/payroll/my/payslips');
  },

  downloadPayslip: async (id: string): Promise<Blob> => {
    return await apiClient.get(`/payroll/${id}/payslip`, { responseType: 'blob' }) as unknown as Blob;
  },
};

