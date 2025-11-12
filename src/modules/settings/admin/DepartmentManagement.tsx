import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { useDepartments } from '../hooks/useDepartments';
import { Table } from '../../../components/common/Table';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { departmentSchema } from '../../../utils/validators';
import { CreateDepartmentDto, Department } from '../../../types';

export const DepartmentManagement: React.FC = () => {
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
    {
      key: 'actions',
      header: 'Ações',
      render: (item: Department) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => deleteDepartment(item.id)}
        >
          Deletar
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <AdminLayout moduleId="settings">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout moduleId="settings">
        <ErrorMessage message={error} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout moduleId="settings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Departamentos</h1>
            <p className="text-gray-600 mt-1">Gerencie os departamentos da empresa</p>
          </div>
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
      </div>
    </AdminLayout>
  );
};

