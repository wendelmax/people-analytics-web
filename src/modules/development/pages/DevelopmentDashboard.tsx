import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { TrainingProgressCard } from '../../../components/training/TrainingProgressCard';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useTrainings } from '../../../hooks/useTrainings';

export const DevelopmentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { trainings, loading } = useTrainings();

  const activeTrainings = trainings.filter((t) => t.status === 'IN_PROGRESS');

  return (
    <ModuleLayout moduleId="development">
      <div className="space-y-6">
        <PageHeader
          title="Desenvolvimento"
          subtitle="Gerencie seu desenvolvimento profissional"
          actions={[
            {
              label: 'Novo Treinamento',
              onClick: () => navigate('/trainings'),
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardTile
            title="Treinamentos"
            icon="📚"
            count={trainings.length}
            description="Catálogo de cursos"
            onClick={() => navigate('/trainings')}
          />

          <DashboardTile
            title="Mentoria"
            icon="👨‍🏫"
            description="Programas de mentoria"
            onClick={() => navigate('/mentoring')}
          />

          <DashboardTile
            title="Carreira"
            icon="🚀"
            description="Plano de carreira"
            onClick={() => navigate('/career')}
          />

          <DashboardTile
            title="Base de Conhecimento"
            icon="📖"
            description="Materiais de apoio"
            onClick={() => navigate('/knowledge-base')}
          />
        </div>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Em Andamento</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : activeTrainings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTrainings.map((training) => (
                <TrainingProgressCard 
                  key={training.id} 
                  training={training} 
                  progress={0.45} // Simulação de progresso, já que a API mock pode não retornar isso
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-100">
              <p className="text-gray-500">Você não tem treinamentos em andamento.</p>
              <button 
                onClick={() => navigate('/trainings')}
                className="text-blue-600 font-medium mt-2 hover:underline"
              >
                Explorar catálogo
              </button>
            </div>
          )}
        </section>
      </div>
    </ModuleLayout>
  );
};

