import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useMyBookings } from '../../../hooks/useFacilities';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate, formatDateTime } from '../../../utils/formatters';
import { BookingStatus } from '../../../types';

export const FacilitiesDashboard: React.FC = () => {
  const { bookings, loading, error } = useMyBookings();

  if (loading) {
    return (
      <ModuleLayout moduleId="facilities">
        <div className="space-y-6">
          <PageHeader
            title="Minhas Reservas"
            subtitle="Carregando..."
            actions={[{ label: 'Reservar Sala', onClick: () => {}, variant: 'primary', icon: '➕' }]}
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
      <ModuleLayout moduleId="facilities">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModuleLayout moduleId="facilities">
      <div className="space-y-6">
        <PageHeader
          title="Minhas Reservas"
          subtitle={`${bookings.length} reservas`}
          actions={[
            {
              label: 'Reservar Sala',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Sala: {booking.room?.name || 'N/A'}</p>
                    <p>
                      {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                    </p>
                    {booking.attendees.length > 0 && (
                      <p>Participantes: {booking.attendees.length}</p>
                    )}
                  </div>
                  {booking.description && (
                    <p className="text-sm text-gray-600">{booking.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {booking.status === BookingStatus.PENDING && (
                    <Button variant="outline" size="sm">
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma reserva encontrada</p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

