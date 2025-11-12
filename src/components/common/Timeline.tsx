import React from 'react';
import { format } from 'date-fns';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: Date | string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const getColorClasses = (color?: TimelineItem['color'], type?: TimelineItem['type']) => {
  if (type) {
    const typeColors = {
      success: 'bg-green-500 border-green-500',
      error: 'bg-red-500 border-red-500',
      warning: 'bg-yellow-500 border-yellow-500',
      info: 'bg-blue-500 border-blue-500',
    };
    return typeColors[type] || 'bg-gray-500 border-gray-500';
  }

  const colors: Record<string, string> = {
    blue: 'bg-blue-500 border-blue-500',
    green: 'bg-green-500 border-green-500',
    red: 'bg-red-500 border-red-500',
    yellow: 'bg-yellow-500 border-yellow-500',
    purple: 'bg-purple-500 border-purple-500',
    gray: 'bg-gray-500 border-gray-500',
  };
  return colors[color || 'gray'] || colors.gray;
};

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-6">
        {items.map((item, index) => {
          const date = typeof item.date === 'string' ? new Date(item.date) : item.date;
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="relative flex gap-4">
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${getColorClasses(
                  item.color,
                  item.type
                )} text-white`}
              >
                {item.icon || (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                  <span className="text-xs text-gray-500">
                    {format(date, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

