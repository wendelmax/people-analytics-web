import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Table } from '../../../components/common/Table';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { Badge } from '../../../components/common/Badge';
import { useRecruitment } from '../../../hooks/useRecruitment';
import { Candidate } from '../../../services/recruitmentService';
import { formatDate } from '../../../utils/formatters';

export const Candidates: React.FC = () => {
  const { candidates, jobs, loading, error } = useRecruitment();

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    return job?.title || jobId;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW':
        return <Badge variant="info">Novo</Badge>;
      case 'SCREENING':
        return <Badge variant="warning">Triagem</Badge>;
      case 'INTERVIEW':
        return <Badge variant="primary">Entrevista</Badge>;
      case 'OFFER':
        return <Badge variant="success">Oferta</Badge>;
      case 'HIRED':
        return <Badge variant="success">Contratado</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejeitado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    {
      key: 'phone',
      header: 'Telefone',
      render: (item: Candidate) => item.phone || '-',
    },
    {
      key: 'jobId',
      header: 'Vaga',
      render: (item: Candidate) => (
        <div>
          <p className="font-medium text-gray-900">{getJobTitle(item.jobId)}</p>
          <p className="text-xs text-gray-500">{item.jobId}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Candidate) => getStatusBadge(item.status),
    },
    {
      key: 'appliedAt',
      header: 'Data de Candidatura',
      render: (item: Candidate) => formatDate(item.appliedAt),
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
          title="Candidatos"
          subtitle="Visualize todos os candidatos em processo"
        />

        {candidates.length === 0 ? (
          <EmptyState
            title="Nenhum candidato encontrado"
            message="Ainda não há candidatos registrados no sistema"
          />
        ) : (
          <Table data={candidates} columns={columns} />
        )}
      </div>
    </ModuleLayout>
  );
};

