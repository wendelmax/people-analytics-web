import React, { useEffect, useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { PerformanceCycle } from '../../../types/performanceCycle';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CycleResult {
  cycleId: string;
  cycleName: string;
  totalParticipants: number;
  completedEvaluations: number;
  averageRating: number;
  distribution: {
    exceeds: number;
    meets: number;
    partiallyMeets: number;
    doesNotMeet: number;
  };
}

export const CycleResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<CycleResult[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<PerformanceCycle | null>(null);
  const [cycles, setCycles] = useState<PerformanceCycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cyclesData = await performanceCycleService.getAllCycles();
      setCycles(cyclesData);
      
      if (cyclesData.length > 0) {
        setSelectedCycle(cyclesData[0]);
        const mockResults: CycleResult[] = cyclesData.map(cycle => ({
          cycleId: cycle.id,
          cycleName: cycle.name,
          totalParticipants: cycle.participantsCount,
          completedEvaluations: Math.floor(cycle.participantsCount * 0.85),
          averageRating: 3.8 + Math.random() * 0.4,
          distribution: {
            exceeds: Math.floor(cycle.participantsCount * 0.15),
            meets: Math.floor(cycle.participantsCount * 0.50),
            partiallyMeets: Math.floor(cycle.participantsCount * 0.25),
            doesNotMeet: Math.floor(cycle.participantsCount * 0.10),
          },
        }));
        setResults(mockResults);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </ModuleLayout>
    );
  }

  const currentResult = results.find(r => r.cycleId === selectedCycle?.id);

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Ver Resultados"
          subtitle="Visualize os resultados das avaliações dos ciclos"
        />

        {cycles.length > 0 && (
          <Card>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Ciclo
              </label>
              <select
                value={selectedCycle?.id || ''}
                onChange={(e) => {
                  const cycle = cycles.find(c => c.id === e.target.value);
                  setSelectedCycle(cycle || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {cycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name} - {format(new Date(cycle.startDate), "MMM yyyy", { locale: ptBR })}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        )}

        {currentResult && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Total de Participantes</p>
                  <p className="text-3xl font-bold text-gray-900">{currentResult.totalParticipants}</p>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Avaliações Concluídas</p>
                  <p className="text-3xl font-bold text-green-600">{currentResult.completedEvaluations}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((currentResult.completedEvaluations / currentResult.totalParticipants) * 100)}% completo
                  </p>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Média Geral</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {currentResult.averageRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">de 5.0</p>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {currentResult.totalParticipants - currentResult.completedEvaluations}
                  </p>
                </div>
              </Card>
            </div>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribuição de Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Excede Expectativas ({currentResult.distribution.exceeds})
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round((currentResult.distribution.exceeds / currentResult.totalParticipants) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${(currentResult.distribution.exceeds / currentResult.totalParticipants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Atende Expectativas ({currentResult.distribution.meets})
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round((currentResult.distribution.meets / currentResult.totalParticipants) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{
                          width: `${(currentResult.distribution.meets / currentResult.totalParticipants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Atende Parcialmente ({currentResult.distribution.partiallyMeets})
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round((currentResult.distribution.partiallyMeets / currentResult.totalParticipants) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-600 h-3 rounded-full"
                        style={{
                          width: `${(currentResult.distribution.partiallyMeets / currentResult.totalParticipants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Não Atende ({currentResult.distribution.doesNotMeet})
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round((currentResult.distribution.doesNotMeet / currentResult.totalParticipants) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-600 h-3 rounded-full"
                        style={{
                          width: `${(currentResult.distribution.doesNotMeet / currentResult.totalParticipants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {!currentResult && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum resultado disponível</p>
            </div>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

