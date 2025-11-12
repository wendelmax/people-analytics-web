import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import { useAnalytics } from '../hooks/useAnalytics';
import { useProjects } from '../hooks/useProjects';
import { useGoals } from '../hooks/useGoals';
import { useLeaveRequests } from '../hooks/useLeaveRequests';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardWidget } from '../components/common/DashboardWidget';
import { SimpleChart } from '../components/charts/SimpleChart';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { employees, loading: employeesLoading } = useEmployees();
  const { departments, loading: departmentsLoading } = useDepartments();
  const { overview, loading: analyticsLoading } = useAnalytics();
  const { projects, loading: projectsLoading } = useProjects();
  const { goals, loading: goalsLoading } = useGoals();
  const { requests: leaveRequests, loading: leavesLoading } = useLeaveRequests();

  if (employeesLoading || departmentsLoading || analyticsLoading || projectsLoading || goalsLoading || leavesLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'PENDING').length;
  const activeGoals = goals.filter((g) => g.status === 'IN_PROGRESS').length;
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;

  const departmentData = departments.map((dept) => ({
    label: dept.name,
    value: employees.filter((emp) => emp.departmentId === dept.id).length,
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Geral</h1>
          <p className="text-gray-600">Visão geral do sistema People Analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Funcionários"
            value={overview?.totalEmployees || employees.length}
            icon="👥"
            trend={{
              label: 'Últimos 6 meses',
              data: [10, 15, 20, 25, 30, overview?.totalEmployees || employees.length],
            }}
          />
          <StatCard
            title="Total de Departamentos"
            value={overview?.totalDepartments || departments.length}
            icon="🏢"
          />
          {overview && (
            <>
              <StatCard
                title="Projetos Ativos"
                value={overview.activeProjects || 0}
                icon="📁"
              />
              <StatCard
                title="Média de Performance"
                value={overview.averagePerformance?.toFixed(1) || '0.0'}
                icon="⭐"
              />
            </>
          )}
        </div>

        {departmentData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleChart
              title="Distribuição de Funcionários por Departamento"
              data={departmentData}
              type="bar"
              height={300}
            />
            <SimpleChart
              title="Distribuição por Departamento"
              data={departmentData}
              type="pie"
              height={300}
              showLegend
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Visão Rápida dos Módulos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardWidget
              moduleId="employees"
              title="Total de Funcionários"
              value={employees.length}
              subtitle={`${departments.length} departamentos`}
              trend={{
                value: 5,
                label: 'vs mês anterior',
                isPositive: true,
              }}
              actions={[
                {
                  label: 'Adicionar Funcionário',
                  onClick: () => navigate('/employees/admin/table?action=create'),
                  icon: '➕',
                },
              ]}
            />

            <DashboardWidget
              moduleId="projects"
              title="Projetos Ativos"
              value={activeProjects}
              subtitle={`${projects.length} projetos no total`}
              trend={{
                value: 10,
                label: 'vs mês anterior',
                isPositive: true,
              }}
              actions={[
                {
                  label: 'Criar Projeto',
                  onClick: () => navigate('/projects?action=create'),
                  icon: '➕',
                },
              ]}
            />

            <DashboardWidget
              moduleId="performance"
              title="Objetivos em Andamento"
              value={activeGoals}
              subtitle={`${goals.length} objetivos no total`}
              actions={[
                {
                  label: 'Criar Objetivo',
                  onClick: () => navigate('/goals?action=create'),
                  icon: '➕',
                },
              ]}
            />

            <DashboardWidget
              moduleId="leaves"
              title="Licenças Pendentes"
              value={pendingLeaves}
              subtitle={`${leaveRequests.length} solicitações no total`}
              trend={
                pendingLeaves > 0
                  ? {
                      value: pendingLeaves,
                      label: 'requerem atenção',
                      isPositive: false,
                    }
                  : undefined
              }
              actions={[
                {
                  label: 'Ver Todas',
                  onClick: () => navigate('/leaves/management'),
                  icon: '👁️',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

