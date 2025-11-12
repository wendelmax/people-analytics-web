import React from 'react';
import { Training } from '../../types';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';

interface TrainingCardProps {
  training: Training;
  onClick?: () => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({ training, onClick }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{training.name}</h3>
          {training.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{training.description}</p>
          )}
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span>Tipo: {training.type.replace('_', ' ')}</span>
            {training.provider && <span>• Fornecedor: {training.provider}</span>}
            <span>• Início: {formatDate(training.startDate)}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {training.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

