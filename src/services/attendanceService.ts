import apiClient from '../api/client';
import {
  Attendance,
  AttendanceSummary,
  WorkSchedule,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  CheckInDto,
  CheckOutDto,
} from '../types';

export const attendanceService = {
  checkIn: async (data?: CheckInDto): Promise<Attendance> => {
    return apiClient.post('/attendance/check-in', data || {});
  },

  checkOut: async (data?: CheckOutDto): Promise<Attendance> => {
    return apiClient.post('/attendance/check-out', data || {});
  },

  getAll: async (): Promise<Attendance[]> => {
    return apiClient.get('/attendance');
  },

  getById: async (id: string): Promise<Attendance> => {
    return apiClient.get(`/attendance/${id}`);
  },

  create: async (data: CreateAttendanceDto): Promise<Attendance> => {
    return apiClient.post('/attendance', data);
  },

  update: async (id: string, data: UpdateAttendanceDto): Promise<Attendance> => {
    return apiClient.patch(`/attendance/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/attendance/${id}`);
  },

  getMyAttendance: async (startDate?: string, endDate?: string): Promise<Attendance[]> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return apiClient.get('/employee/me/attendance', { params });
  },

  getMySummary: async (startDate: string, endDate: string): Promise<AttendanceSummary> => {
    return apiClient.get('/employee/me/attendance/summary', {
      params: { startDate, endDate },
    });
  },

  getSummary: async (employeeId: string, startDate?: string, endDate?: string): Promise<AttendanceSummary> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return apiClient.get(`/attendance/summary/${employeeId}`, { params });
  },

  getWorkSchedules: async (): Promise<WorkSchedule[]> => {
    return apiClient.get('/attendance/work-schedules');
  },

  getWorkScheduleById: async (id: string): Promise<WorkSchedule> => {
    return apiClient.get(`/attendance/work-schedules/${id}`);
  },

  createWorkSchedule: async (data: Partial<WorkSchedule>): Promise<WorkSchedule> => {
    return apiClient.post('/attendance/work-schedules', data);
  },

  updateWorkSchedule: async (id: string, data: Partial<WorkSchedule>): Promise<WorkSchedule> => {
    return apiClient.patch(`/attendance/work-schedules/${id}`, data);
  },

  deleteWorkSchedule: async (id: string): Promise<void> => {
    return apiClient.delete(`/attendance/work-schedules/${id}`);
  },

  addJustification: async (attendanceId: string, justification: string, attachment?: File): Promise<Attendance> => {
    const formData = new FormData();
    formData.append('justification', justification);
    if (attachment) {
      formData.append('attachment', attachment);
    }
    return apiClient.post(`/attendance/${attendanceId}/justification`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  signAttendanceMirror: async (month: string, signature: string): Promise<any> => {
    return apiClient.post('/attendance/sign-mirror', {
      month,
      signature,
    });
  },

  getAttendanceMirror: async (month: string): Promise<{
    attendance: Attendance[];
    signature?: string;
    signedAt?: string;
  }> => {
    return apiClient.get('/attendance/mirror', {
      params: { month },
    });
  },
};

