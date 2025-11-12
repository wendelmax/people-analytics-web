import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { ModuleId, getModuleConfig } from '../../types/modules';

interface DashboardWidgetProps {
  moduleId: ModuleId;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: string;
  }>;
  className?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  moduleId,
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  actions,
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
    <Card className={`hover:shadow-lg transition-all ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {trend && (
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <span>{trend.isPositive ? '↑' : '↓'}</span>
                  <span>{Math.abs(trend.value)}%</span>
                  <span className="text-xs text-gray-500">{trend.label}</span>
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-4xl">{icon || module.icon}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            Ver {module.name}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {actions && actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  title={action.label}
                >
                  {action.icon || '⚙️'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

