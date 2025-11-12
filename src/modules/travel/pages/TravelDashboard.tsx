import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useMyTravels } from '../../../hooks/useTravel';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { TravelStatus } from '../../../types';

export const TravelDashboard: React.FC = () => {
  const { travels, loading, error } = useMyTravels();

  if (loading) {
    return (
      <ModuleLayout moduleId="travel">
        <div className="space-y-6">
          <PageHeader
            title="Minhas Viagens"
            subtitle="Carregando..."
            actions={[{ label: 'Solicitar Viagem', onClick: () => {}, variant: 'primary', icon: '➕' }]}
          />
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
      <ModuleLayout moduleId="travel">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const getStatusColor = (status: TravelStatus) => {
    switch (status) {
      case TravelStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case TravelStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      case TravelStatus.BOOKED:
        return 'bg-blue-100 text-blue-800';
      case TravelStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case TravelStatus.PENDING_APPROVAL:
        return 'bg-yellow-100 text-yellow-800';
      case TravelStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case TravelStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case TravelStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModuleLayout moduleId="travel">
      <div className="space-y-6">
        <PageHeader
          title="Minhas Viagens"
          subtitle={`${travels.length} viagens`}
          actions={[
            {
              label: 'Solicitar Viagem',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="space-y-4">
          {travels.map((travel) => (
            <Card key={travel.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">{travel.destination}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        travel.status
                      )}`}
                    >
                      {travel.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Propósito: {travel.purpose}</p>
                    <p>
                      {formatDate(travel.startDate)} - {formatDate(travel.endDate)}
                    </p>
                    {travel.project && <p>Projeto: {travel.project.name}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(travel.estimatedCost)} {travel.currency}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {travels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma viagem encontrada</p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

