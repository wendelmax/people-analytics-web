import apiClient from '../api/client';
import {
  Employee,
  LeaveBalance,
  Attendance,
  AttendanceSummary,
  Goal,
  Training,
  PerformanceReview,
  DashboardData,
  UpdateEmployeeDto,
  LeaveRequest,
  Payroll,
} from '../types';

export const employeeSelfService = {
  getMyProfile: async (): Promise<Employee> => {
    const response = await apiClient.get('/employee/me/profile');
    return response.data;
  },

  updateMyProfile: async (data: UpdateEmployeeDto): Promise<Employee> => {
    const response = await apiClient.patch('/employee/me/profile', data);
    return response.data;
  },

  getMyLeaves: async (status?: string): Promise<LeaveRequest[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/employee/me/leaves', { params });
    return response.data;
  },

  getMyLeaveBalances: async (year?: number): Promise<LeaveBalance[]> => {
    const params = year ? { year } : {};
    const response = await apiClient.get<LeaveBalance[]>('/employee/me/leave-balances', { params });
    return response.data;
  },

  getMyAttendance: async (startDate?: string, endDate?: string): Promise<Attendance[]> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get<Attendance[]>('/employee/me/attendance', { params });
    return response.data;
  },

  getMyAttendanceSummary: async (startDate: string, endDate: string): Promise<AttendanceSummary> => {
    const response = await apiClient.get('/employee/me/attendance/summary', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getMyGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>('/employee/me/goals');
    return response.data;
  },

  getMyTrainings: async (): Promise<Training[]> => {
    const response = await apiClient.get<Training[]>('/employee/me/trainings');
    return response.data;
  },

  getMyPerformanceReviews: async (): Promise<PerformanceReview[]> => {
    const response = await apiClient.get<PerformanceReview[]>('/employee/me/performance-reviews');
    return response.data;
  },

  getMyDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/employee/me/dashboard');
    return response.data;
  },

  requestDocument: async (type: string): Promise<void> => {
    await apiClient.post('/employee/me/documents/request', { type });
  },

  getMyPayrolls: async (year?: number): Promise<Payroll[]> => {
    const params = year ? { year } : {};
    const response = await apiClient.get<Payroll[]>('/employee/me/payrolls', { params });
    return response as unknown as Payroll[];
  },
};

