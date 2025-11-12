import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';
import { usePerformanceReviews } from '../../../hooks/usePerformanceReviews';
import { useGoals } from '../../../hooks/useGoals';

export const PerformanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { reviews, loading: loadingReviews } = usePerformanceReviews();
  const { goals, loading: loadingGoals } = useGoals();

  const isLoading = loadingReviews || loadingGoals;

  const pendingReviews = reviews.filter((r) => r.status === 'PENDING_MANAGER' || r.status === 'PENDING_EMPLOYEE').length;
  const activeGoals = goals.filter((g) => g.status === 'IN_PROGRESS').length;

  return (
    <ModuleLayout moduleId="performance">
      <div className="space-y-6">
        <PageHeader
          title="Performance"
          subtitle="Visualize e gerencie sua performance"
          actions={[
            {
              label: 'Novo',
              onClick: () => navigate('/performance/reviews'),
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <DashboardTile
                title="Avaliações"
                icon="⭐"
                count={pendingReviews}
                timestamp="há 20m"
                status={pendingReviews > 0 ? 'open' : 'closed'}
                description="Visualize suas avaliações de desempenho"
                onClick={() => navigate('/performance/reviews')}
              />

              <DashboardTile
                title="Objetivos"
                icon="🎯"
                count={activeGoals}
                timestamp="há 20m"
                status={activeGoals > 0 ? 'open' : 'closed'}
                description="Gerencie seus objetivos e metas"
                onClick={() => navigate('/goals')}
              />

              <DashboardTile
                title="Ciclos de Gente"
                icon="🔄"
                status="open"
                description="Gerencie ciclos de avaliação, metas e competências"
                onClick={() => navigate('/people-cycles')}
              />
              <DashboardTile
                title="Feedback"
                icon="💬"
                description="Visualize e dê feedback"
                onClick={() => navigate('/feedback')}
              />
            </>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

