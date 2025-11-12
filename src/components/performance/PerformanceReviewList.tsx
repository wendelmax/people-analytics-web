import React from 'react';
import { usePerformanceReviews } from '../../hooks/usePerformanceReviews';
import { PerformanceReviewCard } from './PerformanceReviewCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';

export const PerformanceReviewList: React.FC = () => {
  const { reviews, loading, error } = usePerformanceReviews();

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

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="Nenhuma avaliação encontrada"
        message="Comece criando sua primeira avaliação"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <PerformanceReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

