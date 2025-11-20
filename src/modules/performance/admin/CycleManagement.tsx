import React, { useEffect, useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { PerformanceCycle } from '../../../types/performanceCycle';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CycleTimeline } from '../components/CycleTimeline';

export const CycleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cycleId = searchParams.get('cycleId');
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
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </ModuleLayout>
    );
  }

  if (!cycle) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Nenhum ciclo encontrado</p>
          <Button onClick={() => navigate('/people-cycles')}>
            Voltar para Ciclos
          </Button>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Gestão de Ciclo"
          subtitle={`Gerenciando: ${cycle.name}`}
          actions={[
            {
              label: 'Voltar',
              onClick: () => navigate('/people-cycles'),
              variant: 'outline',
              icon: '←',
            },
          ]}
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
                Linha do Tempo do Ciclo
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
                  <p className="text-sm text-gray-500">Etapa Atual</p>
                  <p className="text-lg font-bold text-gray-900">
                    {cycle.stages.find(s => s.status === 'IN_PROGRESS')?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="primary" className="w-full" onClick={() => navigate('/people-cycles/results')}>
                  Ver Resultados
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/people-cycles/process')}>
                  Visualizar Processo
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/people-cycles/admin/data-sources')}>
                  Configurar Fontes de Dados
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => navigate('/people-cycles/admin/success-factors')}>
                  Fatores de Sucesso
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/people-cycles/admin/review-180-360-config')}>
                  Configurar 180/360
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/people-cycles/admin/compensation')}>
                  Amarrar Avaliação
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
};

