import React from 'react';
import { PerformanceReview } from '../../types';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';

interface PerformanceReviewCardProps {
  review: PerformanceReview;
  onClick?: () => void;
}

export const PerformanceReviewCard: React.FC<PerformanceReviewCardProps> = ({
  review,
  onClick,
}) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {review.employee?.name || 'Funcionário'}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Período: {formatDate(review.periodStart)} - {formatDate(review.periodEnd)}
          </p>
          {review.overallRating && (
            <p className="text-sm text-gray-600 mb-2">Avaliação: {review.overallRating}/5</p>
          )}
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {review.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

