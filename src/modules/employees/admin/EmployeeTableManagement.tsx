import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { useEmployees } from '../../../hooks/useEmployees';
import { useDepartments } from '../../../hooks/useDepartments';
import { DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Employee } from '../../../types';
import { useNavigate } from 'react-router-dom';

export const EmployeeTableManagement: React.FC = () => {
  const { employees, loading } = useEmployees();
  const { departments } = useDepartments();
  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      render: (item: Employee) => (
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-500">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Departamento',
      sortable: true,
      filterable: true,
      render: (item: Employee) => (
        <Badge variant="info">{item.department?.name || 'N/A'}</Badge>
      ),
    },
    {
      key: 'position',
      header: 'Cargo',
      sortable: true,
      render: (item: Employee) => item.position?.title || 'N/A',
    },
    {
      key: 'phone',
      header: 'Telefone',
      render: (item: Employee) => item.phone || '-',
    },
    {
      key: 'hireDate',
      header: 'Data de Contratação',
      sortable: true,
      render: (item: Employee) => {
        const date = new Date(item.hireDate);
        return date.toLocaleDateString('pt-BR');
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item: Employee) => (
        <Badge variant={item.status === 'ACTIVE' ? 'success' : 'secondary'}>
          {item.status || 'ACTIVE'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right' as const,
      render: (item: Employee) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/employees/${item.id}`)}
          >
            Ver Detalhes
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: 'departmentId',
      label: 'Departamento',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos' },
        ...departments.map((dept) => ({
          value: dept.id,
          label: dept.name,
        })),
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos' },
        { value: 'ACTIVE', label: 'Ativo' },
        { value: 'INACTIVE', label: 'Inativo' },
      ],
    },
  ];

  return (
    <AdminLayout moduleId="employees">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Funcionários</h1>
            <p className="text-gray-600">Visualize e gerencie todos os funcionários</p>
          </div>
          <Button onClick={() => navigate('/employees')}>Novo Funcionário</Button>
        </div>

        <DataTable
          data={employees}
          columns={columns}
          filters={filters}
          loading={loading}
          searchable
          searchPlaceholder="Buscar por nome, email ou telefone..."
          onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
          selectable
          pageSize={25}
        />
      </div>
    </AdminLayout>
  );
};

