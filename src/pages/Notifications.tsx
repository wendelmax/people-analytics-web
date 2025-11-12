import React, { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';
import { Table } from '../components/common/Table';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { formatDate, formatDateTime } from '../utils/formatters';
import { Notification } from '../types';

export const Notifications: React.FC = () => {
  const { notifications, loading, error, markAsRead } = useNotifications();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const userId = 'current-user-id';
    }
  }, [token]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  const columns = [
    { key: 'title', header: 'Título' },
    { key: 'message', header: 'Mensagem' },
    {
      key: 'status',
      header: 'Status',
      render: (item: Notification) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
          }`}
        >
          {item.read ? 'Lida' : 'Não lida'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data',
      render: (item: Notification) => formatDateTime(item.createdAt),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Notificações {unreadCount > 0 && `(${unreadCount})`}
        </h1>
      </div>
      {notifications.length === 0 ? (
        <EmptyState title="Nenhuma notificação encontrada" />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.status === 'UNREAD' ? 'bg-blue-50' : ''}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
                {notification.status === 'UNREAD' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Marcar como lida
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

