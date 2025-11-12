import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';

// Mock Types
interface Job {
  id: string;
  title: string;
  department: string;
  candidates: number;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  postedDate: string;
}

export const RecruitmentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs([
        { id: '1', title: 'Senior Frontend Developer', department: 'Engenharia', candidates: 12, status: 'OPEN', postedDate: '2023-10-15' },
        { id: '2', title: 'Product Manager', department: 'Produto', candidates: 8, status: 'OPEN', postedDate: '2023-10-20' },
        { id: '3', title: 'UX Designer', department: 'Design', candidates: 45, status: 'OPEN', postedDate: '2023-10-10' },
        { id: '4', title: 'HR Specialist', department: 'Recursos Humanos', candidates: 0, status: 'DRAFT', postedDate: '2023-11-01' },
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openJobs = jobs.filter(j => j.status === 'OPEN');
  const totalCandidates = jobs.reduce((acc, job) => acc + job.candidates, 0);

  return (
    <ModuleLayout moduleId="recruitment">
      <div className="space-y-6">
        <PageHeader
          title="Recrutamento"
          subtitle="Gestão de vagas e candidatos"
          actions={[
            {
              label: 'Nova Vaga',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardTile
                title="Vagas Abertas"
                icon="📢"
                count={openJobs.length}
                status="open"
                description="Vagas publicadas ativas"
                onClick={() => {}}
              />
              <DashboardTile
                title="Total de Candidatos"
                icon="👥"
                count={totalCandidates}
                status="open"
                description="Candidatos em processo"
                onClick={() => {}}
              />
              <DashboardTile
                title="Entrevistas Hoje"
                icon="📅"
                count={3}
                status="pending"
                description="Entrevistas agendadas"
                onClick={() => {}}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vagas Recentes</h3>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-all cursor-pointer">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{job.title}</h4>
                          <Badge variant={job.status === 'OPEN' ? 'success' : 'secondary'}>
                            {job.status === 'OPEN' ? 'Aberta' : 'Rascunho'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.department} • Publicada em {new Date(job.postedDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{job.candidates}</p>
                        <p className="text-xs text-gray-500">Candidatos</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ModuleLayout>
  );
};

