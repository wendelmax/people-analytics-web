import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { goalService } from '../../../services/goalService';
import { useEmployees } from '../../../hooks/useEmployees';
import { Goal } from '../../../types';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { QuickActions } from '../../../components/common/QuickActions';
import { RelatedData } from '../../../components/common/RelatedData';
import { CrossModuleLink } from '../../../components/common/CrossModuleLink';
import { formatDate } from '../../../utils/formatters';
import { formatGoalStatus, formatGoalPriority, formatGoalType } from '../../../utils/formatters';

export const GoalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { employees } = useEmployees();

  useEffect(() => {
    if (id) {
      fetchGoal();
    }
  }, [id]);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const data = await goalService.getById(id!);
      setGoal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar objetivo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="performance">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error || !goal) {
    return (
      <ModuleLayout moduleId="performance">
        <ErrorMessage message={error || 'Objetivo não encontrado'} />
      </ModuleLayout>
    );
  }

  const progressPercentage = Math.round((goal.progress || 0) * 100);

  const employee = goal.employeeId ? employees.find((e) => e.id === goal.employeeId) : null;

  return (
    <ModuleLayout moduleId="performance">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/goals')} className="mb-4">
          ← Voltar para lista
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{goal.title}</h1>
            {employee && (
              <p className="text-gray-600 mt-1">
                Funcionário:{' '}
                <CrossModuleLink
                  moduleId="employees"
                  itemId={employee.id}
                  itemName={employee.name}
                  itemType="employee"
                />
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <QuickActions context="performance" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Detalhes do Objetivo</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Descrição</label>
                <p className="mt-1 text-gray-900">{goal.description || 'Sem descrição'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="mt-1 text-gray-900">{formatGoalType(goal.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Prioridade</label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        goal.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : goal.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {formatGoalPriority(goal.priority)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        goal.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : goal.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : goal.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {formatGoalStatus(goal.status)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Progresso</label>
                  <p className="mt-1 text-gray-900">{progressPercentage}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Início</label>
                  <p className="mt-1 text-gray-900">{formatDate(goal.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data Alvo</label>
                  <p className="mt-1 text-gray-900">{formatDate(goal.targetDate)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Progresso</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso atual</span>
                <span className="font-medium text-gray-900">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    progressPercentage >= 100
                      ? 'bg-green-500'
                      : progressPercentage >= 50
                      ? 'bg-blue-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
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
                <p className="mt-1 text-gray-900">{formatDate(goal.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Atualizado em</label>
                <p className="mt-1 text-gray-900">{formatDate(goal.updatedAt)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={() => navigate(`/goals/${id}/edit`)}>
                Editar Objetivo
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/goals')}>
                Voltar para Lista
              </Button>
            </div>
          </Card>

          {employee && (
            <RelatedData
              title="Funcionário"
              items={[
                {
                  id: employee.id,
                  title: employee.name,
                  subtitle: employee.email,
                  icon: '👤',
                  route: `/employees/${employee.id}`,
                },
              ]}
              viewAllRoute={`/employees/${employee.id}`}
            />
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

