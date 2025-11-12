import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useEmployeeDashboard } from '../hooks/useEmployeeDashboard';
import { AttendanceButton } from '../components/attendance/AttendanceButton';
import { AttendanceSummaryCard } from '../components/attendance/AttendanceSummary';
import { LeaveRequestForm } from '../components/leaves/LeaveRequestForm';
import { LeaveList } from '../components/leaves/LeaveList';
import { LeaveBalances } from '../components/leaves/LeaveBalances';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { GoalCard } from '../components/goals/GoalCard';
import { TrainingCard } from '../components/training/TrainingCard';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Avatar } from '../components/common/Avatar';

export const EmployeeDashboard: React.FC = () => {
  const { data, loading, error } = useEmployeeDashboard();

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
        <ErrorMessage message={error.message} />
      </Layout>
    );
  }

  const totalLeaveDays = data?.leaveBalances.reduce((sum, balance) => sum + balance.balance, 0) || 0;
  const activeGoals = data?.goals.filter((g) => g.status !== 'COMPLETED' && g.status !== 'CANCELLED').length || 0;
  const upcomingTrainings = data?.trainings.filter((t) => t.status === 'ENROLLED' || t.status === 'IN_PROGRESS').length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Dashboard</h1>
            <p className="text-gray-600">
              Bem-vindo, {data?.profile.name}
            </p>
          </div>
          {data?.profile && (
            <Avatar
              name={data.profile.name}
              size="lg"
              status="online"
            />
          )}
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Saldos de Licença"
            value={totalLeaveDays}
            change={{ value: 0, type: 'neutral' }}
            icon="📅"
          />
          <StatCard
            title="Metas Ativas"
            value={activeGoals}
            change={{ value: 0, type: 'neutral' }}
            icon="🎯"
          />
          <StatCard
            title="Treinamentos"
            value={upcomingTrainings}
            change={{ value: 0, type: 'neutral' }}
            icon="📚"
          />
          <StatCard
            title="Avaliações"
            value={data?.performanceReviews.length || 0}
            change={{ value: 0, type: 'neutral' }}
            icon="⭐"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceButton />
          <LeaveBalances />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaveRequestForm />
          <AttendanceSummaryCard />
        </div>

        <LeaveList />

        {data && data.goals.length > 0 && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Minhas Metas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.goals.slice(0, 4).map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          </Card>
        )}

        {data && data.trainings.length > 0 && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meus Treinamentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.trainings.slice(0, 4).map((training) => (
                  <TrainingCard key={training.id} training={training} />
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

