import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { useProjects } from '../../../hooks/useProjects';
import { DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Project, ProjectStatus } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const getStatusVariant = (status: ProjectStatus): 'success' | 'warning' | 'error' | 'info' | 'secondary' => {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return 'info';
    case ProjectStatus.COMPLETED:
      return 'success';
    case ProjectStatus.ON_HOLD:
      return 'warning';
    case ProjectStatus.CANCELLED:
      return 'error';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.PLANNING:
      return 'Planejamento';
    case ProjectStatus.IN_PROGRESS:
      return 'Em Andamento';
    case ProjectStatus.COMPLETED:
      return 'Concluído';
    case ProjectStatus.ON_HOLD:
      return 'Em Espera';
    case ProjectStatus.CANCELLED:
      return 'Cancelado';
    default:
      return status;
  }
};

export const ProjectTableManagement: React.FC = () => {
  const { projects, loading } = useProjects();
  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      header: 'Nome do Projeto',
      sortable: true,
      render: (item: Project) => (
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          {item.description && (
            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item: Project) => (
        <Badge variant={getStatusVariant(item.status)}>
          {getStatusLabel(item.status)}
        </Badge>
      ),
    },
    {
      key: 'dates',
      header: 'Período',
      sortable: true,
      render: (item: Project) => (
        <div>
          <p className="text-sm text-gray-900">
            {format(new Date(item.startDate), 'dd/MM/yyyy')}
          </p>
          {item.endDate && (
            <p className="text-xs text-gray-500">
              até {format(new Date(item.endDate), 'dd/MM/yyyy')}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Orçamento',
      sortable: true,
      align: 'right' as const,
      render: (item: Project) =>
        item.budget
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(item.budget)
          : '-',
    },
    {
      key: 'owner',
      header: 'Responsável',
      render: (item: Project) => item.owner?.name || '-',
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right' as const,
      render: (item: Project) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${item.id}`)}
          >
            Ver Detalhes
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'Todos' },
        { value: ProjectStatus.PLANNING, label: 'Planejamento' },
        { value: ProjectStatus.IN_PROGRESS, label: 'Em Andamento' },
        { value: ProjectStatus.COMPLETED, label: 'Concluído' },
        { value: ProjectStatus.ON_HOLD, label: 'Em Espera' },
        { value: ProjectStatus.CANCELLED, label: 'Cancelado' },
      ],
    },
  ];

  return (
    <AdminLayout moduleId="projects">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Projetos</h1>
            <p className="text-gray-600">Visualize e gerencie todos os projetos</p>
          </div>
          <Button onClick={() => navigate('/projects')}>Novo Projeto</Button>
        </div>

        <DataTable
          data={projects}
          columns={columns}
          filters={filters}
          loading={loading}
          searchable
          searchPlaceholder="Buscar por nome ou descrição..."
          onRowClick={(project) => navigate(`/projects/${project.id}`)}
          selectable
          pageSize={25}
        />
      </div>
    </AdminLayout>
  );
};

