import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useDepartments } from '../hooks/useDepartments';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { departmentSchema } from '../utils/validators';
import { CreateDepartmentDto } from '../types';

export const Departments: React.FC = () => {
  const { departments, loading, error, createDepartment, deleteDepartment } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateDepartmentDto>({
    resolver: yupResolver(departmentSchema),
  });

  const handleCreate = async (data: CreateDepartmentDto) => {
    await createDepartment(data);
    reset();
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'description', header: 'Descrição' },
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
        <h1 className="text-3xl font-bold text-gray-900">Departamentos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Departamento</Button>
      </div>
      {departments.length === 0 ? (
        <EmptyState title="Nenhum departamento encontrado" />
      ) : (
        <Table data={departments} columns={columns} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Novo Departamento"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input
            label="Nome"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
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

