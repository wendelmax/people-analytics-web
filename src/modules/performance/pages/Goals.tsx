import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useGoals } from '../../../hooks/useGoals';
import { GoalList } from '../../../components/goals/GoalList';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { goalSchema } from '../../../utils/validators';
import { CreateGoalDto, GoalType, GoalPriority, GoalStatus } from '../../../types';
import { useEmployees } from '../../../hooks/useEmployees';

export const Goals: React.FC = () => {
  const { goals, loading, error, createGoal } = useGoals();
  const { employees } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateGoalDto>({
    // resolver: yupResolver(goalSchema), // TODO: Fix yup resolver types
  });

  const handleCreate = async (data: CreateGoalDto) => {
    await createGoal(data);
    reset();
    setIsModalOpen(false);
  };

  const employeeOptions = [
    { value: '', label: 'Selecione um funcionário' },
    ...employees.map((emp) => ({
      value: emp.id,
      label: emp.name,
    })),
  ];

  const typeOptions = Object.values(GoalType).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  const priorityOptions = Object.values(GoalPriority).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  const statusOptions = Object.values(GoalStatus).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  if (loading) {
    return (
      <ModuleLayout moduleId="performance">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="performance">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="performance">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Objetivos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Objetivo</Button>
      </div>
      {goals.length === 0 ? (
        <EmptyState title="Nenhum objetivo encontrado" />
      ) : (
        <GoalList />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Novo Objetivo"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Select
            label="Funcionário"
            options={employeeOptions}
            {...register('employeeId')}
            error={errors.employeeId?.message}
          />
          <Input label="Título" {...register('title')} error={errors.title?.message} />
          <Input
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
          />
          <Select
            label="Tipo"
            options={typeOptions}
            {...register('type')}
            error={errors.type?.message}
          />
          <Select
            label="Prioridade"
            options={priorityOptions}
            {...register('priority')}
            error={errors.priority?.message}
          />
          <Select
            label="Status"
            options={statusOptions}
            {...register('status')}
            error={errors.status?.message}
          />
          <Input
            label="Data de Início"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <Input
            label="Data Alvo"
            type="date"
            {...register('targetDate')}
            error={errors.targetDate?.message}
          />
          <Input
            label="Progresso (0-1)"
            type="number"
            step="0.01"
            min="0"
            max="1"
            {...register('progress')}
            error={errors.progress?.message}
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

