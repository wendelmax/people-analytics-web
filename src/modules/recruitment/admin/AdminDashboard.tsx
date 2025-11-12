import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { Card } from '../../../components/common/Card';
import { PageHeader } from '../../../components/common/PageHeader';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { useRecruitment } from '../../../hooks/useRecruitment';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, candidates, applications, loading } = useRecruitment();

  const openJobs = jobs.filter((j) => j.status === 'OPEN' || j.status === 'open');
  const activeApplications = applications.filter(
    (a) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW'
  );

  if (loading) {
    return (
      <AdminLayout moduleId="recruitment">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout moduleId="recruitment">
      <div className="space-y-6">
        <PageHeader
          title="Admin - Recrutamento"
          subtitle="Painel administrativo de recrutamento e seleção"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total de Vagas" value={jobs.length.toString()} icon="📋" />
          <StatCard title="Vagas Abertas" value={openJobs.length.toString()} icon="📢" />
          <StatCard
            title="Total de Candidatos"
            value={candidates.length.toString()}
            icon="👤"
          />
          <StatCard
            title="Em Processo"
            value={activeApplications.length.toString()}
            icon="⏳"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão Rápida</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardTile
              title="Gestão de Vagas"
              icon="📝"
              description="Criar e gerenciar vagas"
              onClick={() => navigate('/recruitment/admin/jobs')}
            />
            <DashboardTile
              title="Gestão de Candidatos"
              icon="👥"
              description="Visualizar e gerenciar candidatos"
              onClick={() => navigate('/recruitment/admin/candidates')}
            />
            <DashboardTile
              title="Configuração de Pipeline"
              icon="⚙️"
              description="Configurar estágios do processo"
              onClick={() => navigate('/recruitment/admin/pipeline')}
            />
            <DashboardTile
              title="Inicializar Pipeline"
              icon="🚀"
              description="Inicializar pipeline para uma vaga"
              onClick={() => navigate('/recruitment/admin/initialize-pipeline')}
            />
          </div>
        </div>

        {openJobs.length > 0 && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vagas Abertas Recentes
              </h3>
              <div className="space-y-3">
                {openJobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-600">
                        {job.department} • {job.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {applications.filter((a) => a.jobId === job.id).length} candidatos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

