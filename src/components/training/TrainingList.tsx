import React from 'react';
import { useTrainings } from '../../hooks/useTrainings';
import { TrainingCard } from './TrainingCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';

export const TrainingList: React.FC = () => {
  const { trainings, loading, error } = useTrainings();

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

  if (trainings.length === 0) {
    return (
      <EmptyState
        title="Nenhum treinamento encontrado"
        message="Comece criando seu primeiro treinamento"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainings.map((training) => (
        <TrainingCard key={training.id} training={training} />
      ))}
    </div>
  );
};

