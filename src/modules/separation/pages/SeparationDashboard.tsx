import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useSeparations } from '../../../hooks/useSeparations';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate } from '../../../utils/formatters';
import { SeparationStatus, SeparationType } from '../../../types';

export const SeparationDashboard: React.FC = () => {
  const { separations, loading, error } = useSeparations();

  if (loading) {
    return (
      <ModuleLayout moduleId="separation">
        <div className="space-y-6">
          <PageHeader
            title="Desligamentos"
            subtitle="Carregando..."
            actions={[{ label: 'Novo Desligamento', onClick: () => {}, variant: 'primary', icon: '➕' }]}
          />
          <div className="grid grid-cols-1 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="separation">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const getStatusColor = (status: SeparationStatus) => {
    switch (status) {
      case SeparationStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case SeparationStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case SeparationStatus.PENDING_APPROVAL:
        return 'bg-yellow-100 text-yellow-800';
      case SeparationStatus.INITIATED:
        return 'bg-gray-100 text-gray-800';
      case SeparationStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModuleLayout moduleId="separation">
      <div className="space-y-6">
        <PageHeader
          title="Desligamentos"
          subtitle={`${separations.length} processos`}
          actions={[
            {
              label: 'Novo Desligamento',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-6">
          {separations.map((separation) => (
            <Card key={separation.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {separation.employee?.name || 'Funcionário'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{separation.type.replace('_', ' ')}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      separation.status
                    )}`}
                  >
                    {separation.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Último dia de trabalho:</span>
                    <p className="font-medium">{formatDate(separation.lastWorkingDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Período de aviso:</span>
                    <p className="font-medium">{separation.noticePeriodDays} dias</p>
                  </div>
                </div>
                {separation.reason && (
                  <div>
                    <span className="text-sm text-gray-500">Motivo:</span>
                    <p className="text-sm text-gray-900">{separation.reason}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {separation.status === SeparationStatus.IN_PROGRESS && (
                    <Button variant="primary" size="sm">
                      Ver Checklist
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {separations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum processo de desligamento encontrado</p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

