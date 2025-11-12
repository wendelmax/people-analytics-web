import React from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, action }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📭</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-gray-500 mb-4">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

