import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { ModuleId, getModuleConfig } from '../../types/modules';

interface ModuleWidgetProps {
  moduleId: ModuleId;
  title?: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  icon?: string;
  onClick?: () => void;
  className?: string;
}

export const ModuleWidget: React.FC<ModuleWidgetProps> = ({
  moduleId,
  title,
  value,
  subtitle,
  trend,
  icon,
  onClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const module = getModuleConfig(moduleId);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(module.route);
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all ${className}`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {title && (
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            )}
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-3xl">{icon || module.icon}</span>
            <span className="text-xs text-gray-500">{module.name}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

