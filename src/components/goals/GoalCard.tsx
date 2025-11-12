import React from 'react';
import { Goal } from '../../types';
import { Card } from '../common/Card';
import { formatDate, formatGoalStatus, formatPriority } from '../../utils/formatters';

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  // Progress is 0-1 (decimal), convert to 0-100 percentage
  // Handle edge cases where progress might be > 1 or < 0
  const progressPercentage = Math.min(100, Math.max(0, Math.round(
    goal.progress > 1 ? goal.progress : goal.progress * 100
  )));

  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            goal.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : goal.status === 'AT_RISK'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {formatGoalStatus(goal.status)}
        </span>
      </div>
      {goal.description && <p className="text-sm text-gray-600 mb-3">{goal.description}</p>}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progresso</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Prioridade: {formatPriority(goal.priority)}</span>
          <span>Prazo: {formatDate(goal.targetDate)}</span>
        </div>
      </div>
    </Card>
  );
};

