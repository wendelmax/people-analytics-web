import apiClient from '../api/client';
import { Expense, ExpenseReport, CreateExpenseDto, UpdateExpenseDto, CreateExpenseReportDto } from '../types';

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    return await apiClient.get('/expenses');
  },

  getById: async (id: string): Promise<Expense> => {
    return await apiClient.get(`/expenses/${id}`);
  },

  create: async (data: CreateExpenseDto): Promise<Expense> => {
    return await apiClient.post('/expenses', data);
  },

  update: async (id: string, data: UpdateExpenseDto): Promise<Expense> => {
    return await apiClient.patch(`/expenses/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
  },

  getMyExpenses: async (): Promise<Expense[]> => {
    return await apiClient.get('/expenses/my');
  },

  createReport: async (data: CreateExpenseReportDto): Promise<ExpenseReport> => {
    return await apiClient.post('/expenses/reports', data);
  },

  getReports: async (): Promise<ExpenseReport[]> => {
    return await apiClient.get('/expenses/reports');
  },

  getReportById: async (id: string): Promise<ExpenseReport> => {
    return await apiClient.get(`/expenses/reports/${id}`);
  },

  approve: async (id: string): Promise<Expense> => {
    return await apiClient.post(`/expenses/${id}/approve`);
  },

  reject: async (id: string, reason: string): Promise<Expense> => {
    return await apiClient.post(`/expenses/${id}/reject`, { reason });
  },
};

