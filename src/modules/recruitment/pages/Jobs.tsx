import React, { useState, useMemo } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { Modal } from '../../../components/common/Modal';
import { useRecruitment } from '../../../hooks/useRecruitment';
import { formatDate } from '../../../utils/formatters';

export const Jobs: React.FC = () => {
  const { jobs, loading, error, submitApplication } = useRecruitment();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterType, setFilterType] = useState('');

  const departments = useMemo(() => {
    const depts = new Set(jobs.map((job) => job.department));
    return Array.from(depts).sort();
  }, [jobs]);

  const types = useMemo(() => {
    const jobTypes = new Set(jobs.map((job) => job.type));
    return Array.from(jobTypes).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => job.status === 'OPEN' || job.status === 'open');

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term) ||
          job.department.toLowerCase().includes(term)
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter((job) => job.department === filterDepartment);
    }

    if (filterType) {
      filtered = filtered.filter((job) => job.type === filterType);
    }

    return filtered;
  }, [jobs, searchTerm, filterDepartment, filterType]);

  const handleApply = async (jobId: string) => {
    setIsApplying(true);
    try {
      await submitApplication(jobId, {});
      setIsModalOpen(false);
      alert('Candidatura enviada com sucesso!');
    } catch (err) {
      alert('Erro ao enviar candidatura');
    } finally {
      setIsApplying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="success">Aberta</Badge>;
      case 'CLOSED':
        return <Badge variant="secondary">Fechada</Badge>;
      case 'DRAFT':
        return <Badge variant="warning">Rascunho</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
          title="Vagas Disponíveis"
          subtitle="Explore as oportunidades abertas na empresa"
        />

        <Card>
          <div className="p-4 space-y-4">
            <Input
              placeholder="Buscar por título, descrição ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Filtrar por Departamento"
                options={[
                  { value: '', label: 'Todos os departamentos' },
                  ...departments.map((dept) => ({ value: dept, label: dept })),
                ]}
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              />
              <Select
                label="Filtrar por Tipo"
                options={[
                  { value: '', label: 'Todos os tipos' },
                  ...types.map((type) => ({ value: type, label: type })),
                ]}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {filteredJobs.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga encontrada"
            message={
              jobs.length === 0
                ? 'No momento não há vagas abertas. Volte em breve!'
                : 'Nenhuma vaga corresponde aos filtros selecionados.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span>🏢</span>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📍</span>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💼</span>
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedJob(job.id);
                        setIsModalOpen(true);
                      }}
                      variant="primary"
                    >
                      Candidatar-se
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
                      <p className="text-gray-700">{job.description}</p>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Requisitos</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-gray-700">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Publicada em {formatDate(job.postedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          title="Confirmar Candidatura"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Você tem certeza que deseja se candidatar a esta vaga?
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => selectedJob && handleApply(selectedJob)}
                isLoading={isApplying}
                variant="primary"
              >
                Confirmar Candidatura
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedJob(null);
                }}
                variant="outline"
                disabled={isApplying}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ModuleLayout>
  );
};

