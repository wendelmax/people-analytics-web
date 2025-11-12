import React from 'react';
import { useMyLeaves } from '../../hooks/useLeaves';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { LeaveRequestStatus } from '../../types';
import { format } from 'date-fns';

const getStatusVariant = (status: LeaveRequestStatus): 'success' | 'warning' | 'error' | 'secondary' => {
  switch (status) {
    case LeaveRequestStatus.APPROVED:
      return 'success';
    case LeaveRequestStatus.PENDING:
      return 'warning';
    case LeaveRequestStatus.REJECTED:
      return 'error';
    case LeaveRequestStatus.CANCELLED:
      return 'secondary';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: LeaveRequestStatus) => {
  switch (status) {
    case LeaveRequestStatus.APPROVED:
      return 'Aprovada';
    case LeaveRequestStatus.PENDING:
      return 'Pendente';
    case LeaveRequestStatus.REJECTED:
      return 'Rejeitada';
    case LeaveRequestStatus.CANCELLED:
      return 'Cancelada';
    default:
      return status;
  }
};

export const LeaveList: React.FC = () => {
  const { leaves, loading, cancelLeave } = useMyLeaves();

  const handleCancel = async (id: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      try {
        await cancelLeave(id);
      } catch (error) {
        // Cancel leave request failed - error handled by UI
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (leaves.length === 0) {
    return (
      <Card>
        <div className="p-6">
          <EmptyState
            title="Nenhuma solicitação encontrada"
            message="Você ainda não possui solicitações de licença."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Minhas Licenças</h3>
        <div className="space-y-4">
          {leaves.map((leave) => (
            <div
              key={leave.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {leave.leaveType?.name || leave.leaveTypeId || 'Tipo não especificado'}
                    </h4>
                    <Badge variant={getStatusVariant(leave.status)}>
                      {getStatusLabel(leave.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {format(new Date(leave.startDate), 'dd/MM/yyyy')} -{' '}
                    {format(new Date(leave.endDate), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {leave.days} {leave.days === 1 ? 'dia' : 'dias'}
                  </p>
                  {leave.reason && (
                    <p className="text-sm text-gray-500 mt-2">{leave.reason}</p>
                  )}
                  {leave.rejectedReason && (
                    <p className="text-sm text-red-600 mt-2">
                      Motivo da rejeição: {leave.rejectedReason}
                    </p>
                  )}
                </div>
                {leave.status === LeaveRequestStatus.PENDING && (
                  <button
                    onClick={() => handleCancel(leave.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

