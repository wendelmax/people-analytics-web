import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonCard, Skeleton } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { ExpenseStatus } from '../../../types';
import { useMyExpenses } from '../../../hooks/useExpenses';

export const ExpensesDashboard: React.FC = () => {
  const { expenses, loading, error } = useMyExpenses();
  const [filter, setFilter] = useState<'ALL' | ExpenseStatus>('ALL');

  if (loading) {
    return (
      <ModuleLayout moduleId="expenses">
        <div className="space-y-6">
          <PageHeader
            title="Minhas Despesas"
            subtitle="Carregando..."
            actions={[{ label: 'Solicitar Reembolso', onClick: () => {}, variant: 'primary', icon: '➕' }]}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="expenses">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const filteredExpenses = filter === 'ALL' ? expenses : expenses.filter((e) => e.status === filter);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getStatusColor = (status: ExpenseStatus) => {
    switch (status) {
      case ExpenseStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ExpenseStatus.PAID:
        return 'bg-blue-100 text-blue-800';
      case ExpenseStatus.PENDING_APPROVAL:
        return 'bg-yellow-100 text-yellow-800';
      case ExpenseStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case ExpenseStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ExpenseStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = expenses.filter((e) => e.status === ExpenseStatus.PENDING_APPROVAL).length;
  const approvedCount = expenses.filter((e) => e.status === ExpenseStatus.APPROVED).length;
  const paidCount = expenses.filter((e) => e.status === ExpenseStatus.PAID).length;

  return (
    <ModuleLayout moduleId="expenses">
      <div className="space-y-6">
        <PageHeader
          title="Minhas Despesas"
          subtitle={`${filteredExpenses.length} despesas • Total: ${formatCurrency(totalAmount)}`}
          actions={[
            {
              label: 'Solicitar Reembolso',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardTile
            title="Total"
            icon="💰"
            description={formatCurrency(totalAmount)}
          />
          <DashboardTile
            title="Pendentes"
            icon="⏳"
            count={pendingCount}
            timestamp="20m ago"
            status={pendingCount > 0 ? 'pending' : 'closed'}
          />
          <DashboardTile
            title="Aprovadas"
            icon="✅"
            count={approvedCount}
            timestamp="20m ago"
            status={approvedCount > 0 ? 'open' : 'closed'}
          />
          <DashboardTile
            title="Pagas"
            icon="💵"
            count={paidCount}
            timestamp="20m ago"
            status={paidCount > 0 ? 'open' : 'closed'}
          />
        </div>

        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'ALL' | ExpenseStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">Todos os Status</option>
            {Object.values(ExpenseStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        expense.status
                      )}`}
                    >
                      {expense.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{expense.category.replace('_', ' ')}</span>
                    <span>{formatDate(expense.expenseDate)}</span>
                    {expense.project && <span>Projeto: {expense.project.name}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(expense.amount)} {expense.currency}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma despesa encontrada</p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

