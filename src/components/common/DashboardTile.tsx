import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';

interface DashboardTileProps {
  title: string;
  icon?: string;
  count?: number;
  timestamp?: string;
  status?: 'open' | 'closed' | 'pending';
  onClick?: () => void;
  variant?: 'info' | 'action' | 'guide';
  image?: string;
  description?: string;
  className?: string;
}

export const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  icon,
  count,
  timestamp,
  status,
  onClick,
  variant = 'info',
  image,
  description,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'open':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'closed':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  if (variant === 'action') {
    return (
      <Card
        className={`cursor-pointer hover:shadow-lg transition-all hover:scale-105 ${className}`}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[120px] space-y-2">
          {icon && <div className="text-4xl">{icon}</div>}
          <div className="text-lg font-semibold text-gray-900 text-center">{title}</div>
        </div>
      </Card>
    );
  }

  if (variant === 'guide' && image) {
    return (
      <Card
        className={`cursor-pointer hover:shadow-lg transition-all ${className}`}
        onClick={handleClick}
      >
        <div className="space-y-2">
          {image && (
            <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-2">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          {description && <div className="text-xs text-gray-500">{description}</div>}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all ${className}`}
      onClick={handleClick}
    >
      <div className="space-y-2 min-h-[100px]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && <div className="text-3xl flex-shrink-0">{icon}</div>}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{title}</div>
              {description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</div>}
            </div>
          </div>
        </div>
        {count !== undefined && (
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold text-gray-900">{count}</div>
          </div>
        )}
        {timestamp && (
          <div className={`text-xs ${getStatusColor()} flex items-center gap-1`}>
            <span>{timestamp}</span>
            {status === 'open' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Open
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

