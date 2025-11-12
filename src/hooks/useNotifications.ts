import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Notification, CreateNotificationDto } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    const data = await notificationService.getAll();
    setNotifications(data);
    setLoading(false);
  };

  const createNotification = async (data: CreateNotificationDto) => {
    const newNotification = await notificationService.create(data);
    setNotifications([newNotification, ...notifications]);
    return newNotification;
  };

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getUnread = async (userId: string) => {
    const data = await notificationService.getUnread(userId);
    return data;
  };

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    createNotification,
    markAsRead,
    getUnread,
  };
};


