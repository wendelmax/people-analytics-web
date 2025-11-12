import React from 'react';
import { ProjectAllocation, AllocationStatus } from '../../types/allocation';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { Progress } from '../common/Progress';

interface ProjectAllocationCardProps {
  allocation: ProjectAllocation;
  onEdit?: (allocation: ProjectAllocation) => void;
  onDelete?: (id: string) => void;
}

const getStatusVariant = (status: AllocationStatus) => {
  switch (status) {
    case AllocationStatus.ACTIVE:
      return 'success';
    case AllocationStatus.COMPLETED:
      return 'info';
    case AllocationStatus.CANCELLED:
      return 'error';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: AllocationStatus) => {
  switch (status) {
    case AllocationStatus.ACTIVE:
      return 'Ativa';
    case AllocationStatus.COMPLETED:
      return 'Concluída';
    case AllocationStatus.CANCELLED:
      return 'Cancelada';
    default:
      return status;
  }
};

export const ProjectAllocationCard: React.FC<ProjectAllocationCardProps> = ({
  allocation,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {allocation.project?.name || 'Projeto'}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {allocation.employee?.name || 'Funcionário'}
              {allocation.role && ` • ${allocation.role}`}
            </p>
          </div>
          <Badge variant={getStatusVariant(allocation.status)}>
            {getStatusLabel(allocation.status)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Alocação</span>
              <span className="font-medium">{allocation.allocationPercentage}%</span>
            </div>
            <Progress value={allocation.allocationPercentage} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Início</p>
              <p className="font-medium">{formatDate(allocation.startDate)}</p>
            </div>
            {allocation.endDate && (
              <div>
                <p className="text-gray-600">Fim</p>
                <p className="font-medium">{formatDate(allocation.endDate)}</p>
              </div>
            )}
          </div>

          {allocation.notes && (
            <div className="text-sm">
              <p className="text-gray-600 mb-1">Observações</p>
              <p className="text-gray-800">{allocation.notes}</p>
            </div>
          )}

          {(onEdit || onDelete) && (
            <div className="flex gap-2 pt-2 border-t">
              {onEdit && (
                <button
                  onClick={() => onEdit(allocation)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(allocation.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

