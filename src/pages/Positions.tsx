import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { usePositions } from '../hooks/usePositions';
import { useDepartments } from '../hooks/useDepartments';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { positionSchema } from '../utils/validators';
import { CreatePositionDto, Position } from '../types';

export const Positions: React.FC = () => {
  const { positions, loading, error, createPosition } = usePositions();
  const { departments } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePositionDto>({
    resolver: yupResolver(positionSchema),
  });

  const handleCreate = async (data: CreatePositionDto) => {
    await createPosition(data);
    reset();
    setIsModalOpen(false);
  };

  const departmentOptions = [
    { value: '', label: 'Selecione um departamento' },
    ...departments.map((dept) => ({
      value: dept.id,
      label: dept.name,
    })),
  ];

  const columns = [
    { key: 'title', header: 'Título' },
    { key: 'level', header: 'Nível' },
    {
      key: 'department',
      header: 'Departamento',
      render: (item: Position) => item.department?.name || '-',
    },
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
        <h1 className="text-3xl font-bold text-gray-900">Posições</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nova Posição</Button>
      </div>
      {positions.length === 0 ? (
        <EmptyState title="Nenhuma posição encontrada" />
      ) : (
        <Table data={positions} columns={columns} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Nova Posição"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input
            label="Título"
            {...register('title')}
            error={errors.title?.message}
          />
          <Input
            label="Nível"
            {...register('level')}
            error={errors.level?.message}
          />
          <Input
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
          />
          <Select
            label="Departamento"
            options={departmentOptions}
            {...register('departmentId')}
            error={errors.departmentId?.message}
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

