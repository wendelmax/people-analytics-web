import apiClient from '../api/client';
import {
  LeaveType,
  LeaveRequest,
  LeaveBalance,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
} from '../types';

export const leaveService = {
  getLeaveTypes: async (): Promise<LeaveType[]> => {
    const response = await apiClient.get('/leaves/types');
    return response.data;
  },

  getLeaveTypeById: async (id: string): Promise<LeaveType> => {
    return apiClient.get(`/leaves/types/${id}`);
  },

  createLeaveType: async (data: CreateLeaveTypeDto): Promise<LeaveType> => {
    return apiClient.post('/leaves/types', data);
  },

  updateLeaveType: async (id: string, data: UpdateLeaveTypeDto): Promise<LeaveType> => {
    return apiClient.patch(`/leaves/types/${id}`, data);
  },

  deleteLeaveType: async (id: string): Promise<void> => {
    return apiClient.delete(`/leaves/types/${id}`);
  },

  createRequest: async (data: CreateLeaveRequestDto): Promise<LeaveRequest> => {
    const response = await apiClient.post('/leaves/requests', data);
    return response.data;
  },

  getRequests: async (status?: string): Promise<LeaveRequest[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/leaves/requests', { params });
    return response.data;
  },

  getRequestById: async (id: string): Promise<LeaveRequest> => {
    return apiClient.get(`/leaves/requests/${id}`);
  },

  updateRequest: async (id: string, data: UpdateLeaveRequestDto): Promise<LeaveRequest> => {
    return apiClient.patch(`/leaves/requests/${id}`, data);
  },

  cancelRequest: async (id: string): Promise<void> => {
    return apiClient.post(`/leaves/requests/${id}/cancel`);
  },

  approveRequest: async (id: string, notes?: string): Promise<LeaveRequest> => {
    return apiClient.post(`/leaves/requests/${id}/approve`, { notes });
  },

  rejectRequest: async (id: string, rejectedReason: string): Promise<LeaveRequest> => {
    return apiClient.post(`/leaves/requests/${id}/reject`, { rejectedReason });
  },

  getMyLeaves: async (status?: string): Promise<LeaveRequest[]> => {
    const params = status ? { status } : {};
    return apiClient.get('/employee/me/leaves', { params });
  },

  getMyBalances: async (year?: number): Promise<LeaveBalance[]> => {
    const params = year ? { year } : {};
    return apiClient.get('/employee/me/leave-balances', { params });
  },

  getEmployeeBalances: async (employeeId: string, year?: number): Promise<LeaveBalance[]> => {
    const params = year ? { year } : {};
    return apiClient.get(`/leaves/balances/${employeeId}`, { params });
  },
};

