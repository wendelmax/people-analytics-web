import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useProjects } from '../hooks/useProjects';
import { ProjectList } from '../components/projects/ProjectList';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectSchema } from '../utils/validators';
import { CreateProjectDto, ProjectStatus } from '../types';
import { useEmployees } from '../hooks/useEmployees';
import { formatProjectStatus } from '../utils/formatters';

export const Projects: React.FC = () => {
  const { projects, loading, error, createProject } = useProjects();
  const { employees } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProjectDto>({
    // resolver: yupResolver(projectSchema), // TODO: Fix yup resolver types
  });

  const handleCreate = async (data: CreateProjectDto) => {
    await createProject(data);
    reset();
    setIsModalOpen(false);
  };

  const statusOptions = Object.values(ProjectStatus).map((value) => ({
    value,
    label: formatProjectStatus(value),
  }));

  const ownerOptions = [
    { value: '', label: 'Selecione um responsável' },
    ...employees.map((emp) => ({
      value: emp.id,
      label: emp.name,
    })),
  ];


  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Projeto</Button>
      </div>
      <ProjectList />
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Novo Projeto"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input label="Nome" {...register('name')} error={errors.name?.message} />
          <Input
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
          />
          <Input
            label="Data de Início"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <Input
            label="Data de Término"
            type="date"
            {...register('endDate')}
            error={errors.endDate?.message}
          />
          <Select
            label="Status"
            options={statusOptions}
            {...register('status')}
            error={errors.status?.message}
          />
          <Input
            label="Orçamento"
            type="number"
            step="0.01"
            {...register('budget')}
            error={errors.budget?.message}
          />
          <Select
            label="Responsável"
            options={ownerOptions}
            {...register('ownerId')}
            error={errors.ownerId?.message}
          />
          <div className="flex gap-2">
            <Button type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

