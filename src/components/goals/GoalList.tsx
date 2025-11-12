import React from 'react';
import { useGoals } from '../../hooks/useGoals';
import { GoalCard } from './GoalCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const GoalList: React.FC = () => {
  const { goals, loading, error } = useGoals();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (goals.length === 0) {
    return (
      <EmptyState
        title="Nenhum objetivo encontrado"
        message="Comece criando seu primeiro objetivo"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onClick={() => navigate(`/goals/${goal.id}`)}
        />
      ))}
    </div>
  );
};

