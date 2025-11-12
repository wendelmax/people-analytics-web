import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Table } from '../../../components/common/Table';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { Badge } from '../../../components/common/Badge';
import { useRecruitment } from '../../../hooks/useRecruitment';
import { Application } from '../../../services/recruitmentService';
import { formatDate } from '../../../utils/formatters';

export const Applications: React.FC = () => {
  const { myApplications, jobs, loading, error } = useRecruitment();

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Badge variant="warning">Pendente</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="info">Em Análise</Badge>;
      case 'INTERVIEW':
        return <Badge variant="primary">Entrevista</Badge>;
      case 'APPROVED':
        return <Badge variant="success">Aprovado</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejeitado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    return job?.title || jobId;
  };

  const columns = [
    {
      key: 'jobId',
      header: 'Vaga',
      render: (item: Application) => (
        <div>
          <p className="font-medium text-gray-900">{getJobTitle(item.jobId)}</p>
          <p className="text-sm text-gray-500">{item.jobId}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Application) => getStatusBadge(item.status),
    },
    {
      key: 'appliedAt',
      header: 'Data de Candidatura',
      render: (item: Application) => formatDate(item.appliedAt),
    },
    {
      key: 'notes',
      header: 'Observações',
      render: (item: Application) => item.notes || '-',
    },
  ];

  if (loading) {
    return (
      <ModuleLayout moduleId="recruitment">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="recruitment">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="recruitment">
      <div className="space-y-6">
        <PageHeader
          title="Minhas Candidaturas"
          subtitle="Acompanhe o status das suas candidaturas"
        />

        {myApplications.length === 0 ? (
          <EmptyState
            title="Nenhuma candidatura encontrada"
            message="Você ainda não se candidatou a nenhuma vaga"
          />
        ) : (
          <Table data={myApplications} columns={columns} />
        )}
      </div>
    </ModuleLayout>
  );
};

