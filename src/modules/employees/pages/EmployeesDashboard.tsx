import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { EmployeeList } from '../../../components/employees/EmployeeList';
import { EmployeeForm } from '../../../components/employees/EmployeeForm';
import { Modal } from '../../../components/common/Modal';
import { PageHeader } from '../../../components/common/PageHeader';
import { useEmployees } from '../../../hooks/useEmployees';
import { CreateEmployeeDto } from '../../../types';
import { useNavigate } from 'react-router-dom';

export const EmployeesDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createEmployee, employees } = useEmployees();
  const navigate = useNavigate();

  const handleCreate = async (data: CreateEmployeeDto) => {
    await createEmployee(data);
    setIsModalOpen(false);
  };

  return (
    <ModuleLayout moduleId="employees">
      <PageHeader
        title="Gestão de Funcionários"
        subtitle={`${employees.length} funcionários`}
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
          {
            label: 'Duplicar',
            onClick: () => {},
            variant: 'outline',
          },
        ]}
      />
      <EmployeeList />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Funcionário"
        size="lg"
      >
        <EmployeeForm
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </ModuleLayout>
  );
};

