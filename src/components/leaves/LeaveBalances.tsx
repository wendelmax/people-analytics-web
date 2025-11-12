import React from 'react';
import { useMyLeaveBalances } from '../../hooks/useLeaves';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export const LeaveBalances: React.FC = () => {
  const { balances, loading } = useMyLeaveBalances();

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (balances.length === 0) {
    return (
      <Card>
        <div className="p-6">
          <EmptyState
            title="Nenhum saldo encontrado"
            message="Você ainda não possui saldos de licença cadastrados."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saldos de Licença</h3>
        <div className="space-y-4">
          {balances.map((balance) => (
            <div
              key={balance.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {balance.leaveType?.name || balance.leaveTypeId || 'Tipo não especificado'}
                  </h4>
                  <p className="text-sm text-gray-600">Ano {balance.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {balance.balance}
                  </p>
                  <p className="text-xs text-gray-500">
                    {balance.used} usado / {balance.accrued} acumulado
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

