import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { projectService } from '../../../services/projectService';
import { useEmployees } from '../../../hooks/useEmployees';
import { Project } from '../../../types';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { QuickActions } from '../../../components/common/QuickActions';
import { RelatedData } from '../../../components/common/RelatedData';
import { formatDate } from '../../../utils/formatters';
import { formatProjectStatus } from '../../../utils/formatters';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { employees } = useEmployees();

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getById(id!);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="projects">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error || !project) {
    return (
      <ModuleLayout moduleId="projects">
        <ErrorMessage message={error || 'Projeto não encontrado'} />
      </ModuleLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const projectEmployees: Record<string, unknown>[] = [];

  return (
    <ModuleLayout moduleId="projects">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/projects')} className="mb-4">
          ← Voltar para lista
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description || 'Sem descrição'}</p>
          </div>
        </div>
        <div className="mt-4">
          <QuickActions context="projects" projectId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Detalhes do Projeto</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Descrição</label>
                <p className="mt-1 text-gray-900">{project.description || 'Sem descrição'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {formatProjectStatus(project.status)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Início</label>
                  <p className="mt-1 text-gray-900">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Término</label>
                  <p className="mt-1 text-gray-900">{project.endDate ? formatDate(project.endDate) : 'Não definida'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Informações</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Criado em</label>
                <p className="mt-1 text-gray-900">{formatDate(project.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Atualizado em</label>
                <p className="mt-1 text-gray-900">{formatDate(project.updatedAt)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(`/project-allocations?projectId=${id}`)}
              >
                Ver Alocações
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/projects')}>
                Voltar para Lista
              </Button>
            </div>
          </Card>

          {projectEmployees.length > 0 && (
            <RelatedData
              title="Equipe do Projeto"
              items={projectEmployees.map((emp) => ({
                id: emp.id,
                title: emp.name,
                subtitle: emp.position || emp.email,
                icon: '👤',
                route: `/employees/${emp.id}`,
              }))}
              emptyMessage="Nenhum funcionário alocado"
              viewAllRoute={`/project-allocations?projectId=${id}`}
              maxItems={5}
            />
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

