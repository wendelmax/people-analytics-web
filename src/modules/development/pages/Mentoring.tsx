import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useMentoring } from '../../../hooks/useMentoring';
import { Table } from '../../../components/common/Table';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { CreateMentoringDto, MentoringStatus, MentoringRelationship } from '../../../types';
import { useEmployees } from '../../../hooks/useEmployees';
import { formatDate } from '../../../utils/formatters';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const mentoringSchema = yup.object({
  mentorId: yup.string().required('Mentor é obrigatório'),
  menteeId: yup.string().required('Mentorado é obrigatório'),
  status: yup.string().oneOf(Object.values(MentoringStatus)).required('Status é obrigatório'),
  startDate: yup.date().required('Data de início é obrigatória'),
  endDate: yup.date().optional(),
});

export const Mentoring: React.FC = () => {
  const { relationships, loading, error, createRelationship } = useMentoring();
  const { employees } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateMentoringDto>({
    // resolver: yupResolver(mentoringSchema), // TODO: Fix yup resolver types
  });

  const handleCreate = async (data: CreateMentoringDto & { endDate?: string | Date }) => {
    const mentoringData: CreateMentoringDto = {
      mentorId: data.mentorId,
      menteeId: data.menteeId,
      status: data.status,
      startDate: data.startDate instanceof Date ? data.startDate.toISOString().split('T')[0] : data.startDate,
      endDate: data.endDate ? (data.endDate instanceof Date ? data.endDate.toISOString().split('T')[0] : data.endDate) : undefined,
    };
    await createRelationship(mentoringData);
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

  const statusOptions = Object.values(MentoringStatus).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  const columns = [
    { key: 'mentor', header: 'Mentor', render: (item: MentoringRelationship) => item.mentor?.name || 'N/A' },
    { key: 'mentee', header: 'Mentorado', render: (item: MentoringRelationship) => item.mentee?.name || 'N/A' },
    {
      key: 'status',
      header: 'Status',
      render: (item: MentoringRelationship) => item.status.replace('_', ' '),
    },
    {
      key: 'startDate',
      header: 'Data de Início',
      render: (item: MentoringRelationship) => formatDate(item.startDate),
    },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Mentoria</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nova Relação de Mentoria</Button>
      </div>
      {relationships.length === 0 ? (
        <EmptyState title="Nenhuma relação de mentoria encontrada" />
      ) : (
        <Table data={relationships} columns={columns} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Nova Relação de Mentoria"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Select
            label="Mentor"
            options={employeeOptions}
            {...register('mentorId')}
            error={errors.mentorId?.message}
          />
          <Select
            label="Mentorado"
            options={employeeOptions}
            {...register('menteeId')}
            error={errors.menteeId?.message}
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

