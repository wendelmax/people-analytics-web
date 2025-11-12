import React from 'react';
import { useFeedback } from '../../hooks/useFeedback';
import { FeedbackCard } from './FeedbackCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';

export const FeedbackList: React.FC = () => {
  const { feedbacks, loading, error } = useFeedback();

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

  if (feedbacks.length === 0) {
    return (
      <EmptyState
        title="Nenhum feedback encontrado"
        message="Comece criando seu primeiro feedback"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {feedbacks.map((feedback) => (
        <FeedbackCard key={feedback.id} feedback={feedback} />
      ))}
    </div>
  );
};

