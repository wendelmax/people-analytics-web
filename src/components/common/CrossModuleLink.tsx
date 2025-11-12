import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleId, getModuleConfig } from '../../types/modules';

interface CrossModuleLinkProps {
  moduleId: ModuleId;
  itemId: string;
  itemName: string;
  itemType: 'employee' | 'project' | 'department' | 'goal' | 'training' | 'leave';
  className?: string;
}

const itemConfig: Record<string, { route: (id: string) => string; icon: string }> = {
  employee: {
    route: (id) => `/employees/${id}`,
    icon: '👤',
  },
  project: {
    route: (id) => `/projects/${id}`,
    icon: '📁',
  },
  department: {
    route: () => '/settings/admin/departments',
    icon: '🏢',
  },
  goal: {
    route: (id) => `/goals/${id}`,
    icon: '🎯',
  },
  training: {
    route: (id) => `/trainings?trainingId=${id}`,
    icon: '🎓',
  },
  leave: {
    route: (id) => `/leaves?leaveId=${id}`,
    icon: '🏖️',
  },
};

export const CrossModuleLink: React.FC<CrossModuleLinkProps> = ({
  moduleId,
  itemId,
  itemName,
  itemType,
  className = '',
}) => {
  const navigate = useNavigate();
  const module = getModuleConfig(moduleId);
  const config = itemConfig[itemType];

  if (!config) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(config.route(itemId));
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors ${className}`}
    >
      <span>{config.icon}</span>
      <span>{itemName}</span>
      <span className="text-xs text-gray-400">({module.name})</span>
    </button>
  );
};

