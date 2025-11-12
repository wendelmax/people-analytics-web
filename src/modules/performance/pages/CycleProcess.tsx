import React, { useEffect, useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { CycleTimeline } from '../components/CycleTimeline';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { PerformanceCycle } from '../../../types/performanceCycle';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const CycleProcess: React.FC = () => {
  const navigate = useNavigate();
  const { cycleId } = useParams<{ cycleId?: string }>();
  const [cycle, setCycle] = useState<PerformanceCycle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cycleId) {
      loadCycle();
    } else {
      loadActiveCycle();
    }
  }, [cycleId]);

  const loadCycle = async () => {
    if (!cycleId) return;
    try {
      const data = await performanceCycleService.getCycleById(cycleId);
      setCycle(data);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveCycle = async () => {
    try {
      const cycles = await performanceCycleService.getAllCycles();
      const activeCycle = cycles.find(c => c.status === 'ACTIVE') || cycles[0];
      if (activeCycle) {
        setCycle(activeCycle);
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

  if (!cycle) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Nenhum ciclo encontrado</p>
          <button
            onClick={() => navigate('/people-cycles')}
            className="text-blue-600 hover:text-blue-800"
          >
            Voltar para Ciclos
          </button>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Visualizar Processo"
          subtitle={`Acompanhando o processo do ciclo: ${cycle.name}`}
        />

        <Card className="overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{cycle.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {cycle.participantsCount} participantes • Início em{' '}
                  {format(new Date(cycle.startDate), "d 'de' MMM, yyyy", { locale: ptBR })}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  cycle.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {cycle.status === 'ACTIVE' ? 'Ativo' : cycle.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Progresso Geral
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${cycle.progress}%` }}
                />
              </div>
              <p className="text-sm font-bold text-blue-600 mt-2">{cycle.progress}% concluído</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                Linha do Tempo do Processo
              </h4>
              <CycleTimeline stages={cycle.stages} />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="text-sm text-gray-500">Participantes</p>
                  <p className="text-2xl font-bold text-gray-900">{cycle.participantsCount}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-sm text-gray-500">Etapas Concluídas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cycle.stages.filter(s => s.status === 'COMPLETED').length} / {cycle.stages.length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-sm text-gray-500">Tempo Restante</p>
                  <p className="text-lg font-bold text-gray-900">
                    {cycle.stages.find(s => s.status === 'IN_PROGRESS')?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
};

