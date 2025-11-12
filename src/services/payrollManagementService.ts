import apiClient from '../api/client';
import {
  PayrollCycle,
  DepartmentPayrollSummary,
  CostCenterPayrollSummary,
  PayrollApproval,
  PayrollNotification,
  PayrollReport,
  EmployeePayrollDetail,
  CreatePayrollCycleDto,
  ApprovePayrollDto,
  NotifyFinanceDto,
} from '../types/payroll';

export const payrollManagementService = {
  // Ciclos de Folha
  getAllCycles: async (): Promise<PayrollCycle[]> => {
    return await apiClient.get('/payroll/cycles');
  },

  getCycleById: async (id: string): Promise<PayrollCycle> => {
    return await apiClient.get(`/payroll/cycles/${id}`);
  },

  createCycle: async (data: CreatePayrollCycleDto): Promise<PayrollCycle> => {
    return await apiClient.post('/payroll/cycles', data);
  },

  calculateCycle: async (id: string): Promise<PayrollCycle> => {
    return await apiClient.post(`/payroll/cycles/${id}/calculate`);
  },

  approveCycle: async (id: string, data: ApprovePayrollDto): Promise<PayrollCycle> => {
    return await apiClient.post(`/payroll/cycles/${id}/approve`, data);
  },

  processCycle: async (id: string): Promise<PayrollCycle> => {
    return await apiClient.post(`/payroll/cycles/${id}/process`);
  },

  closeCycle: async (id: string): Promise<PayrollCycle> => {
    return await apiClient.post(`/payroll/cycles/${id}/close`);
  },

  // Detalhes por Departamento/Centro de Custo
  getDepartmentSummary: async (cycleId: string): Promise<DepartmentPayrollSummary[]> => {
    return await apiClient.get(`/payroll/cycles/${cycleId}/departments`);
  },

  getCostCenterSummary: async (cycleId: string): Promise<CostCenterPayrollSummary[]> => {
    return await apiClient.get(`/payroll/cycles/${cycleId}/cost-centers`);
  },

  getEmployeeDetails: async (cycleId: string): Promise<EmployeePayrollDetail[]> => {
    return await apiClient.get(`/payroll/cycles/${cycleId}/employees`);
  },

  // Aprovações
  getApprovals: async (cycleId: string): Promise<PayrollApproval[]> => {
    return await apiClient.get(`/payroll/cycles/${cycleId}/approvals`);
  },

  requestApproval: async (cycleId: string, approverId: string): Promise<PayrollApproval> => {
    return await apiClient.post(`/payroll/cycles/${cycleId}/approvals`, { approverId });
  },

  // Notificações e Comunicação
  notifyFinance: async (cycleId: string, data: NotifyFinanceDto): Promise<PayrollNotification> => {
    return await apiClient.post(`/payroll/cycles/${cycleId}/notify-finance`, data);
  },

  notifyControllers: async (cycleId: string): Promise<PayrollNotification[]> => {
    return await apiClient.post(`/payroll/cycles/${cycleId}/notify-controllers`);
  },

  getNotifications: async (cycleId: string): Promise<PayrollNotification[]> => {
    return await apiClient.get(`/payroll/cycles/${cycleId}/notifications`);
  },

  // Relatórios
  generateReport: async (
    cycleId: string,
    reportType: string,
    format: string
  ): Promise<PayrollReport> => {
    return await apiClient.post(`/payroll/cycles/${cycleId}/reports`, { reportType, format });
  },

  getReports: async (cycleId: string): Promise<PayrollReport[]> => {
    return await apiClient.get(`/payroll/cycles/${cycleId}/reports`);
  },

  downloadReport: async (reportId: string): Promise<Blob> => {
    return await apiClient.get(`/payroll/reports/${reportId}/download`, { responseType: 'blob' });
  },

  // Estatísticas e Dashboard
  getDashboardStats: async (): Promise<any> => {
    return await apiClient.get('/payroll/dashboard/stats');
  },
};

