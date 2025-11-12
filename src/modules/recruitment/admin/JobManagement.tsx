import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Table } from '../../../components/common/Table';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Badge } from '../../../components/common/Badge';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useRecruitment } from '../../../hooks/useRecruitment';
import { Job } from '../../../services/recruitmentService';
import { useForm } from 'react-hook-form';
import { formatDate } from '../../../utils/formatters';

interface JobFormData {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
}

export const JobManagement: React.FC = () => {
  const { jobs, loading, error, createJob, updateJob, deleteJob } = useRecruitment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<JobFormData>();

  const handleCreate = async (data: JobFormData) => {
    try {
      const jobData = {
        ...data,
        requirements: data.requirements.split('\n').filter((r) => r.trim()),
      };
      await createJob(jobData);
      setIsModalOpen(false);
      reset();
    } catch (err) {
      alert('Erro ao criar vaga');
    }
  };

  const handleUpdate = async (data: JobFormData) => {
    if (!editingJob) return;
    try {
      const jobData = {
        ...data,
        requirements: data.requirements.split('\n').filter((r) => r.trim()),
      };
      await updateJob(editingJob.id, jobData);
      setIsModalOpen(false);
      setEditingJob(null);
      reset();
    } catch (err) {
      alert('Erro ao atualizar vaga');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setValue('title', job.title);
    setValue('department', job.department);
    setValue('location', job.location);
    setValue('type', job.type);
    setValue('description', job.description);
    setValue('requirements', job.requirements?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta vaga?')) {
      try {
        await deleteJob(id);
      } catch (err) {
        alert('Erro ao deletar vaga');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
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

  const columns = [
    { key: 'title', header: 'Título' },
    { key: 'department', header: 'Departamento' },
    { key: 'location', header: 'Localização' },
    { key: 'type', header: 'Tipo' },
    {
      key: 'status',
      header: 'Status',
      render: (item: Job) => getStatusBadge(item.status),
    },
    {
      key: 'postedAt',
      header: 'Data de Publicação',
      render: (item: Job) => formatDate(item.postedAt),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (item: Job) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(item)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
            Deletar
          </Button>
        </div>
      ),
    },
  ];

  const typeOptions = [
    { value: 'full-time', label: 'Tempo Integral' },
    { value: 'part-time', label: 'Meio Período' },
    { value: 'contract', label: 'Contrato' },
    { value: 'internship', label: 'Estágio' },
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
          title="Gestão de Vagas"
          subtitle="Gerencie as vagas de emprego da empresa"
          actions={[
            {
              label: 'Nova Vaga',
              onClick: () => {
                setEditingJob(null);
                reset();
                setIsModalOpen(true);
              },
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        {jobs.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga encontrada"
            message="Crie sua primeira vaga para começar"
          />
        ) : (
          <Table data={jobs} columns={columns} />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingJob(null);
            reset();
          }}
          title={editingJob ? 'Editar Vaga' : 'Nova Vaga'}
          size="lg"
        >
          <form
            onSubmit={handleSubmit(editingJob ? handleUpdate : handleCreate)}
            className="space-y-4"
          >
            <Input
              label="Título da Vaga"
              {...register('title', { required: 'Título é obrigatório' })}
              error={errors.title?.message}
            />

            <Input
              label="Departamento"
              {...register('department', { required: 'Departamento é obrigatório' })}
              error={errors.department?.message}
            />

            <Input
              label="Localização"
              {...register('location', { required: 'Localização é obrigatória' })}
              error={errors.location?.message}
            />

            <Select
              label="Tipo de Contrato"
              options={typeOptions}
              {...register('type', { required: 'Tipo é obrigatório' })}
              error={errors.type?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                {...register('description', { required: 'Descrição é obrigatória' })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva a vaga..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requisitos (um por linha)
              </label>
              <textarea
                {...register('requirements')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite os requisitos, um por linha..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" isLoading={isSubmitting}>
                {editingJob ? 'Atualizar' : 'Criar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingJob(null);
                  reset();
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

