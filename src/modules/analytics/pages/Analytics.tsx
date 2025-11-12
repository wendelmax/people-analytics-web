import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Card } from '../../../components/common/Card';
import { SimpleChart } from '../../../components/charts/SimpleChart';

export const Analytics: React.FC = () => {
  const { overview, loading, error } = useAnalytics();

  if (loading) {
    return (
      <ModuleLayout moduleId="analytics">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="analytics">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const departmentData = overview
    ? [
        { label: 'TI', value: Math.floor(overview.totalEmployees * 0.3) },
        { label: 'RH', value: Math.floor(overview.totalEmployees * 0.2) },
        { label: 'Vendas', value: Math.floor(overview.totalEmployees * 0.25) },
        { label: 'Marketing', value: Math.floor(overview.totalEmployees * 0.15) },
        { label: 'Outros', value: Math.floor(overview.totalEmployees * 0.1) },
      ]
    : [];

  const projectStatusData = overview
    ? [
        { label: 'Ativos', value: overview.activeProjects, color: '#10b981' },
        { label: 'Concluídos', value: overview.totalProjects - overview.activeProjects, color: '#6b7280' },
      ]
    : [];

  const performanceData = overview
    ? [
        { label: 'Jan', value: 3.5 },
        { label: 'Fev', value: 3.7 },
        { label: 'Mar', value: 3.8 },
        { label: 'Abr', value: overview.averagePerformance },
        { label: 'Mai', value: 4.1 },
        { label: 'Jun', value: 4.2 },
      ]
    : [];

  return (
    <ModuleLayout moduleId="analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios Analytics</h1>
          <p className="text-gray-600">Visualize análises e métricas do sistema</p>
        </div>

        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600">Total de Funcionários</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalEmployees}</p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600">Projetos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{overview.activeProjects}</p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600">Média de Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview.averagePerformance?.toFixed(1) || '0.0'}
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600">Total de Projetos</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalProjects || 0}</p>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {departmentData.length > 0 && (
            <SimpleChart
              title="Distribuição por Departamento"
              data={departmentData}
              type="pie"
              height={300}
              showLegend
            />
          )}
          {projectStatusData.length > 0 && (
            <SimpleChart
              title="Status dos Projetos"
              data={projectStatusData}
              type="bar"
              height={300}
            />
          )}
          {performanceData.length > 0 && (
            <SimpleChart
              title="Evolução da Performance"
              data={performanceData}
              type="line"
              height={300}
            />
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

