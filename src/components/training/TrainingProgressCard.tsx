import React from 'react';
import { Training, TrainingStatus, TrainingType } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Progress } from '../common/Progress';
import { formatDate } from '../../utils/formatters';

interface TrainingProgressCardProps {
  training: Training;
  progress?: number;
}

const getStatusColor = (status: TrainingStatus) => {
  switch (status) {
    case TrainingStatus.COMPLETED:
      return 'success';
    case TrainingStatus.IN_PROGRESS:
      return 'warning';
    case TrainingStatus.ENROLLED:
      return 'info';
    case TrainingStatus.DROPPED:
      return 'error';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: TrainingStatus) => {
  switch (status) {
    case TrainingStatus.COMPLETED:
      return 'Concluído';
    case TrainingStatus.IN_PROGRESS:
      return 'Em Progresso';
    case TrainingStatus.ENROLLED:
      return 'Inscrito';
    case TrainingStatus.DROPPED:
      return 'Abandonado';
    default:
      return status;
  }
};

const getTypeLabel = (type: TrainingType) => {
  switch (type) {
    case TrainingType.ONLINE_COURSE:
      return 'Curso Online';
    case TrainingType.WORKSHOP:
      return 'Workshop';
    case TrainingType.CONFERENCE:
      return 'Conferência';
    case TrainingType.INTERNAL_TRAINING:
      return 'Treinamento Interno';
    case TrainingType.EXTERNAL_COURSE:
      return 'Curso Externo';
    default:
      return type;
  }
};

export const TrainingProgressCard: React.FC<TrainingProgressCardProps> = ({
  training,
  progress = 0,
}) => {
  const progressPercentage = training.status === TrainingStatus.COMPLETED ? 100 : progress * 100;

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{training.name}</h3>
            {training.description && (
              <p className="text-sm text-gray-600 mb-2">{training.description}</p>
            )}
          </div>
          <Badge variant={getStatusColor(training.status)} size="sm">
            {getStatusLabel(training.status)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {training.provider && (
              <span>
                <strong>Provedor:</strong> {training.provider}
              </span>
            )}
            <span>
              <strong>Tipo:</strong> {getTypeLabel(training.type)}
            </span>
            {training.difficulty && (
              <span>
                <strong>Dificuldade:</strong> {training.difficulty}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              <strong>Início:</strong> {formatDate(training.startDate)}
            </span>
            {training.endDate && (
              <span>
                <strong>Fim:</strong> {formatDate(training.endDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

