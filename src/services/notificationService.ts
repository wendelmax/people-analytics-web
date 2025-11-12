import apiClient from '../api/client';
import { Notification, CreateNotificationDto, UpdateNotificationDto } from '../types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    return apiClient.get('/notifications');
  },

  getById: async (id: string): Promise<Notification> => {
    return apiClient.get(`/notifications/${id}`);
  },

  create: async (data: CreateNotificationDto): Promise<Notification> => {
    return apiClient.post('/notifications', data);
  },

  update: async (id: string, data: UpdateNotificationDto): Promise<Notification> => {
    return apiClient.patch(`/notifications/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/notifications/${id}`);
  },

  markAsRead: async (id: string): Promise<Notification> => {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  getUnread: async (userId: string): Promise<Notification[]> => {
    return apiClient.get(`/notifications/user/${userId}/unread`);
  },
};

