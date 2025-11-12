import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const { notifications, getUnread } = useNotifications();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token) {
      loadUnread();
    }
  }, [token]);

  const loadUnread = async () => {
    try {
      const unread = await getUnread('current-user-id');
      setUnreadCount(unread.length);
    } catch (err) {
      // Failed to load unread notifications - continue with 0 count
    }
  };

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 text-gray-700 hover:text-gray-900"
    >
      <span className="text-2xl">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

