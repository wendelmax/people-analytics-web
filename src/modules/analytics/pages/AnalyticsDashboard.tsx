import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../../hooks/useAnalytics';

export const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { overview, loading } = useAnalytics();

  return (
    <ModuleLayout moduleId="analytics">
      <div className="space-y-6">
        <PageHeader
          title="People Analytics"
          subtitle={loading ? 'Carregando...' : (overview ? `${overview.totalEmployees} funcionários` : 'Visualize análises, insights e previsões')}
          actions={[
            {
              label: 'Novo Relatório',
              onClick: () => navigate('/analytics/reports'),
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardTile
            title="Relatórios"
            icon="📈"
            description="Visualize análises e relatórios detalhados"
            onClick={() => navigate('/analytics/reports')}
          />

          <DashboardTile
            title="Analytics Preditivos"
            icon="🔮"
            description="Previsões de turnover, risco de saída e talentos"
            onClick={() => navigate('/analytics/predictive')}
          />

          <DashboardTile
            title="DEIB Analytics"
            icon="🌈"
            description="Diversidade, Equidade, Inclusão e Pertencimento"
            onClick={() => navigate('/analytics/deib')}
          />

          <DashboardTile
            title="Monitoramento da Força de Trabalho"
            icon="👥"
            description="Acompanhamento em tempo real da equipe"
            onClick={() => navigate('/analytics/workforce')}
          />

          <DashboardTile
            title="Insights"
            icon="💡"
            description="Recomendações inteligentes baseadas em dados"
            onClick={() => navigate('/insights')}
          />
        </div>
      </div>
    </ModuleLayout>
  );
};

