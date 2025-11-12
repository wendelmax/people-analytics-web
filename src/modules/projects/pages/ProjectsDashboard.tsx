import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useProjects } from '../../../hooks/useProjects';
import { ProjectList } from '../../../components/projects/ProjectList';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectSchema } from '../../../utils/validators';
import { CreateProjectDto, ProjectStatus } from '../../../types';
import { useEmployees } from '../../../hooks/useEmployees';
import { formatProjectStatus } from '../../../utils/formatters';

export const ProjectsDashboard: React.FC = () => {
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
      <ModuleLayout moduleId="projects">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="projects">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="projects">
      <PageHeader
        title="Projetos"
        subtitle={`${projects.length} projetos`}
        actions={[
          {
            label: 'Novo',
            onClick: () => setIsModalOpen(true),
            variant: 'primary',
            icon: '➕',
          },
          {
            label: 'Copiar Para',
            onClick: () => {},
            variant: 'outline',
            dropdown: [
              { label: 'Copiar para Excel', onClick: () => {} },
              { label: 'Copiar para PDF', onClick: () => {} },
            ],
          },
        ]}
      />
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
    </ModuleLayout>
  );
};

