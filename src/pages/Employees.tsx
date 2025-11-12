import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { EmployeeList } from '../components/employees/EmployeeList';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useEmployees } from '../hooks/useEmployees';
import { CreateEmployeeDto } from '../types';

export const Employees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createEmployee } = useEmployees();

  const handleCreate = async (data: CreateEmployeeDto) => {
    await createEmployee(data);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Funcionário</Button>
      </div>
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
    </Layout>
  );
};

