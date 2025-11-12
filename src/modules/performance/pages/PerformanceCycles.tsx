import React, { useEffect, useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { CycleTimeline } from '../components/CycleTimeline';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { PerformanceCycle } from '../../../types/performanceCycle';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const PerformanceCycles: React.FC = () => {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState<PerformanceCycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    try {
      const data = await performanceCycleService.getAllCycles();
      setCycles(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Ciclos de Gente"
          subtitle="Gerencie os ciclos de avaliação, metas e calibração organizacional"
          actions={[
            {
              label: 'Novo Ciclo',
              onClick: () => navigate('/people-cycles/new'),
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="space-y-8">
            {cycles.map((cycle) => (
              <Card key={cycle.id} className="overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{cycle.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        cycle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cycle.status === 'ACTIVE' ? 'Ativo' : cycle.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {cycle.participantsCount} participantes • Início em {format(new Date(cycle.startDate), "d 'de' MMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none text-right">
                      <p className="text-xs text-gray-500 mb-1">Progresso Geral</p>
                      <div className="w-full md:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${cycle.progress}%` }}
                        />
                      </div>
                      <p className="text-xs font-bold text-blue-600 mt-1">{cycle.progress}%</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/people-cycles/admin/management?cycleId=${cycle.id}`)}
                    >
                      Gerenciar
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Linha do Tempo do Ciclo</h4>
                  <CycleTimeline stages={cycle.stages} />
                </div>
              </Card>
            ))}

            {cycles.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">Nenhum ciclo de avaliação criado.</p>
                <Button onClick={() => navigate('/people-cycles/new')}>
                  Criar Primeiro Ciclo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

