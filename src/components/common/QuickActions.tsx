import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ModuleId, getModuleConfig } from '../../types/modules';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  module?: ModuleId;
  badge?: number;
}

interface QuickActionsProps {
  context?: ModuleId;
  employeeId?: string;
  projectId?: string;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  context,
  employeeId,
  projectId,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getContextualActions = (): QuickAction[] => {
    const actions: QuickAction[] = [];

    // Ações globais sempre disponíveis
    actions.push({
      id: 'modules',
      label: 'Ver Módulos',
      icon: '📦',
      action: () => navigate('/modules'),
    });

    actions.push({
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      action: () => navigate('/dashboard'),
    });

    // Ações contextuais baseadas no módulo atual
    if (context === 'employees' && employeeId) {
      actions.push({
        id: 'employee-performance',
        label: 'Ver Performance',
        icon: '⭐',
        action: () => navigate(`/performance?employeeId=${employeeId}`),
        module: 'performance',
      });
      actions.push({
        id: 'employee-leaves',
        label: 'Ver Licenças',
        icon: '🏖️',
        action: () => navigate(`/leaves?employeeId=${employeeId}`),
        module: 'leaves',
      });
      actions.push({
        id: 'employee-attendance',
        label: 'Ver Presença',
        icon: '⏰',
        action: () => navigate(`/attendance?employeeId=${employeeId}`),
        module: 'attendance',
      });
      actions.push({
        id: 'employee-trainings',
        label: 'Ver Treinamentos',
        icon: '🎓',
        action: () => navigate(`/trainings?employeeId=${employeeId}`),
        module: 'development',
      });
      actions.push({
        id: 'employee-projects',
        label: 'Ver Projetos',
        icon: '📁',
        action: () => navigate(`/projects?employeeId=${employeeId}`),
        module: 'projects',
      });
    }

    if (context === 'projects' && projectId) {
      actions.push({
        id: 'project-allocations',
        label: 'Ver Alocações',
        icon: '👥',
        action: () => navigate(`/project-allocations?projectId=${projectId}`),
        module: 'projects',
      });
      actions.push({
        id: 'project-analytics',
        label: 'Ver Analytics',
        icon: '📈',
        action: () => navigate(`/analytics?projectId=${projectId}`),
        module: 'analytics',
      });
    }

    if (context === 'performance') {
      actions.push({
        id: 'create-goal',
        label: 'Criar Objetivo',
        icon: '🎯',
        action: () => navigate('/goals?action=create'),
        module: 'performance',
      });
      actions.push({
        id: 'create-feedback',
        label: 'Dar Feedback',
        icon: '💬',
        action: () => navigate('/feedback?action=create'),
        module: 'performance',
      });
    }

    if (context === 'leaves') {
      actions.push({
        id: 'request-leave',
        label: 'Solicitar Licença',
        icon: '➕',
        action: () => navigate('/leaves?action=request'),
        module: 'leaves',
      });
    }

    if (context === 'attendance') {
      actions.push({
        id: 'check-in',
        label: 'Registrar Entrada',
        icon: '✅',
        action: () => navigate('/attendance?action=checkin'),
        module: 'attendance',
      });
    }

    return actions;
  };

  const actions = getContextualActions();

  if (actions.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((action) => {
        const module = action.module ? getModuleConfig(action.module) : null;
        return (
          <button
            key={action.id}
            onClick={action.action}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all text-sm font-medium text-gray-700 hover:text-blue-700 shadow-sm hover:shadow"
            title={action.label}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
            {action.badge && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                {action.badge}
              </span>
            )}
            {module && (
              <span className="text-xs text-gray-400">({module.name})</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

