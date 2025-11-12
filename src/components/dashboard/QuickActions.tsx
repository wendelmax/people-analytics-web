import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  color?: string;
}

const defaultActions: QuickAction[] = [
  { label: 'Check-in', icon: '⏰', path: '/attendance', color: 'blue' },
  { label: 'Solicitar Licença', icon: '📅', path: '/leaves', color: 'green' },
  { label: 'Ver Metas', icon: '🎯', path: '/goals', color: 'purple' },
  { label: 'Treinamentos', icon: '📚', path: '/trainings', color: 'orange' },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
  title = 'Ações Rápidas',
}) => {
  const navigate = useNavigate();

  const getColorClasses = (color?: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
      red: 'bg-red-50 text-red-700 hover:bg-red-100',
      gray: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
    };
    return colors[color || 'gray'] || colors.gray;
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`p-4 rounded-lg transition-colors flex flex-col items-center gap-2 ${getColorClasses(
                action.color
              )}`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

