import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { PeopleCycle } from '../../types/peopleCycle';
import { Progress } from '../Progress';

interface CycleStatusCardProps {
  cycle: PeopleCycle;
  onClick?: () => void;
}

export const CycleStatusCard: React.FC<CycleStatusCardProps> = ({ cycle, onClick }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'DRAFT': return 'secondary';
      case 'CALIBRATION': return 'warning';
      case 'FINISHED': return 'info';
      default: return 'secondary';
    }
  };

  const currentStage = cycle.stages.find(s => s.status === 'IN_PROGRESS') || cycle.stages[0];

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onClick}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{cycle.title}</h3>
            <p className="text-sm text-gray-500">{cycle.model.replace('_', ' ')}</p>
          </div>
          <Badge variant={getStatusVariant(cycle.status)}>
            {cycle.status}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progresso do Ciclo</span>
              <span className="font-medium">{cycle.progress}%</span>
            </div>
            <Progress value={cycle.progress} />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Etapa Atual</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {currentStage.type === 'CALIBRATION_OPR' ? '⚖️' : 
                 currentStage.type === 'FEEDBACK' ? '💬' : '📝'}
              </span>
              <div>
                <p className="font-medium text-gray-900">{currentStage.name}</p>
                <p className="text-xs text-gray-500">Até {currentStage.endDate || 'Definir'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
            <span>👥 {cycle.participantsCount} Participantes</span>
            <span>📅 {new Date(cycle.startDate).getFullYear()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

