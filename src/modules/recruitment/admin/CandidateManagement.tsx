import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Table } from '../../../components/common/Table';
import { Badge } from '../../../components/common/Badge';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useRecruitment } from '../../../hooks/useRecruitment';
import { Candidate } from '../../../services/recruitmentService';
import { formatDate } from '../../../utils/formatters';

export const CandidateManagement: React.FC = () => {
  const { candidates, jobs, loading, error } = useRecruitment();
  const [filterJob, setFilterJob] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

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

  const filteredCandidates = candidates.filter((candidate) => {
    if (filterJob && candidate.jobId !== filterJob) return false;
    if (filterStatus && candidate.status !== filterStatus) return false;
    return true;
  });

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
      render: (item: Candidate) => {
        const job = jobs.find((j) => j.id === item.jobId);
        return job?.title || item.jobId;
      },
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

  const jobOptions = [
    { value: '', label: 'Todas as vagas' },
    ...jobs.map((job) => ({
      value: job.id,
      label: job.title,
    })),
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'NEW', label: 'Novo' },
    { value: 'SCREENING', label: 'Triagem' },
    { value: 'INTERVIEW', label: 'Entrevista' },
    { value: 'OFFER', label: 'Oferta' },
    { value: 'HIRED', label: 'Contratado' },
    { value: 'REJECTED', label: 'Rejeitado' },
  ];

  if (loading) {
    return (
      <AdminLayout moduleId="recruitment">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout moduleId="recruitment">
        <ErrorMessage message={error} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout moduleId="recruitment">
      <div className="space-y-6">
        <PageHeader
          title="Gestão de Candidatos"
          subtitle="Gerencie todos os candidatos do processo seletivo"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
          <Select
            label="Filtrar por Vaga"
            options={jobOptions}
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
          />
          <Select
            label="Filtrar por Status"
            options={statusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>

        {filteredCandidates.length === 0 ? (
          <EmptyState
            title="Nenhum candidato encontrado"
            message="Não há candidatos que correspondam aos filtros selecionados"
          />
        ) : (
          <Table data={filteredCandidates} columns={columns} />
        )}
      </div>
    </AdminLayout>
  );
};

