import React from 'react';
import { Feedback } from '../../types';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';

interface FeedbackCardProps {
  feedback: Feedback;
  onClick?: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onClick }) => {
  const sentimentColors = {
    POSITIVE: 'bg-green-100 text-green-800',
    NEUTRAL: 'bg-gray-100 text-gray-800',
    NEGATIVE: 'bg-red-100 text-red-800',
  };

  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feedback.title}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-3">{feedback.content}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>De: {feedback.author?.name || 'Desconhecido'}</span>
            <span>•</span>
            <span>Para: {feedback.recipient?.name || 'Desconhecido'}</span>
            <span>•</span>
            <span>{formatDate(feedback.createdAt)}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-xs ${sentimentColors[feedback.sentiment]}`}>
              {feedback.sentiment}
            </span>
            {feedback.rating && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                ⭐ {feedback.rating}/5
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

