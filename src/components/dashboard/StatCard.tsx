import React from 'react';
import { Card } from '../common/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  trend?: {
    label: string;
    data: number[];
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  onClick,
  className = '',
}) => {
  const getChangeColor = () => {
    if (!change) return '';
    switch (change.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    switch (change.type) {
      case 'increase':
        return '↑';
      case 'decrease':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <Card
      className={`${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-end gap-1 h-8">
            {trend.data.map((point, index) => {
              const max = Math.max(...trend.data);
              const height = (point / max) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

