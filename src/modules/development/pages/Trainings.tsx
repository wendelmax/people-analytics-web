import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useTrainings } from '../../../hooks/useTrainings';
import { TrainingList } from '../../../components/training/TrainingList';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateTrainingDto, TrainingType, TrainingStatus } from '../../../types';
import * as yup from 'yup';

const trainingSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: yup.string().optional(),
  provider: yup.string().optional(),
  type: yup.string().oneOf(Object.values(TrainingType)).required('Tipo é obrigatório'),
  status: yup.string().oneOf(Object.values(TrainingStatus)).required('Status é obrigatório'),
  startDate: yup.date().required('Data de início é obrigatória'),
  endDate: yup.date().optional().min(yup.ref('startDate'), 'Data de término deve ser após a data de início'),
  difficulty: yup.string().optional(),
});

export const Trainings: React.FC = () => {
  const { trainings, loading, error, createTraining } = useTrainings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTrainingDto>({
    // resolver: yupResolver(trainingSchema), // TODO: Fix yup resolver types
  });

  const handleCreate = async (data: CreateTrainingDto) => {
    await createTraining(data);
    reset();
    setIsModalOpen(false);
  };

  const typeOptions = Object.values(TrainingType).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  const statusOptions = Object.values(TrainingStatus).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  if (loading) {
    return (
      <ModuleLayout moduleId="development">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="development">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="development">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Treinamentos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Treinamento</Button>
      </div>
      {trainings.length === 0 ? (
        <EmptyState title="Nenhum treinamento encontrado" />
      ) : (
        <TrainingList />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Novo Treinamento"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input label="Nome" {...register('name')} error={errors.name?.message} />
          <Input
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
          />
          <Input label="Fornecedor" {...register('provider')} error={errors.provider?.message} />
          <Select
            label="Tipo"
            options={typeOptions}
            {...register('type')}
            error={errors.type?.message}
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
            label="Data de Término"
            type="date"
            {...register('endDate')}
            error={errors.endDate?.message}
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

