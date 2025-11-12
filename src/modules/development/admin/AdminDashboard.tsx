import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { useTrainings } from '../../../hooks/useTrainings';
import { useMentoring } from '../../../hooks/useMentoring';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { trainings, loading: loadingTrainings } = useTrainings();
  const { relationships, loading: loadingMentoring } = useMentoring();

  const activeTrainings = trainings.filter((t) => t.status === 'IN_PROGRESS');
  const activeMentoring = relationships.filter((r) => r.status === 'ACTIVE');

  const loading = loadingTrainings || loadingMentoring;

  if (loading) {
    return (
      <AdminLayout moduleId="development">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout moduleId="development">
      <div className="space-y-6">
        <PageHeader
          title="Admin - Desenvolvimento"
          subtitle="Painel administrativo de desenvolvimento e treinamento"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total de Treinamentos"
            value={trainings.length.toString()}
            icon="📚"
          />
          <StatCard
            title="Treinamentos Ativos"
            value={activeTrainings.length.toString()}
            icon="🎓"
          />
          <StatCard
            title="Relações de Mentoria"
            value={relationships.length.toString()}
            icon="👨‍🏫"
          />
          <StatCard
            title="Mentorias Ativas"
            value={activeMentoring.length.toString()}
            icon="⭐"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão Rápida</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardTile
              title="Gestão de Treinamentos"
              icon="📚"
              description="Criar e gerenciar treinamentos"
              onClick={() => navigate('/development/admin/trainings')}
            />
            <DashboardTile
              title="Gestão de Mentoria"
              icon="👨‍🏫"
              description="Configurar programas de mentoria"
              onClick={() => navigate('/development/admin/mentoring')}
            />
            <DashboardTile
              title="Gestão de Conteúdo"
              icon="📝"
              description="Gerenciar base de conhecimento"
              onClick={() => navigate('/development/admin/content')}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
