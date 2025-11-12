import React from 'react';
import { CycleStage } from '../../../types/performanceCycle';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CycleTimelineProps {
  stages: CycleStage[];
}

export const CycleTimeline: React.FC<CycleTimelineProps> = ({ stages }) => {
  const getStatusColor = (status: CycleStage['status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500 animate-pulse';
      default: return 'bg-gray-300';
    }
  };

  const getStatusTextColor = (status: CycleStage['status']) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-700';
      case 'IN_PROGRESS': return 'text-blue-700';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="relative">
      {/* Linha conectora */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />

      <div className="space-y-8">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative flex items-start gap-6">
            {/* Bolinha do status */}
            <div className={`
              absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10
              ${getStatusColor(stage.status)}
            `}>
              {stage.status === 'COMPLETED' && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <div className="ml-12 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${stage.status === 'PENDING' ? 'text-gray-500' : 'text-gray-900'}`}>
                      {stage.name}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      stage.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                      stage.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {stage.status === 'IN_PROGRESS' ? 'Em Andamento' : 
                       stage.status === 'COMPLETED' ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                  {stage.description && (
                    <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
                  )}
                  {stage.type === 'REVIEW_180_360' && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                        🔄 180/360
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 sm:mt-0 text-right">
                  <p className="text-xs text-gray-500">Prazo</p>
                  <p className={`text-sm font-medium ${getStatusTextColor(stage.status)}`}>
                    {format(new Date(stage.endDate), "d 'de' MMM", { locale: ptBR })}
                  </p>
                  {stage.type === 'REVIEW_180_360' && stage.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => window.location.href = '/people-cycles/review-180-360'}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Iniciar Avaliação →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

