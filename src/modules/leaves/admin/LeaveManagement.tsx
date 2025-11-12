import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { useLeaveRequests } from '../../../hooks/useLeaves';
import { DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Textarea } from '../../../components/common/Textarea';
import { LeaveRequest, LeaveRequestStatus } from '../../../types';
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

export const LeaveManagement: React.FC = () => {
  const { requests, loading, approveRequest, rejectRequest, refetch } = useLeaveRequests();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');

  const handleApprove = async () => {
    if (selectedRequest) {
      await approveRequest(selectedRequest.id, notes || undefined);
      setSelectedRequest(null);
      setActionType(null);
      setNotes('');
    }
  };

  const handleReject = async () => {
    if (selectedRequest && notes) {
      await rejectRequest(selectedRequest.id, notes);
      setSelectedRequest(null);
      setActionType(null);
      setNotes('');
    }
  };

  const openApproveModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setActionType('approve');
    setNotes('');
  };

  const openRejectModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setNotes('');
  };

  const columns = [
    {
      key: 'employee',
      header: 'Funcionário',
      sortable: true,
      render: (item: LeaveRequest) => (
        <div>
          <p className="font-medium text-gray-900">{item.employee?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{item.employee?.email || ''}</p>
        </div>
      ),
    },
    {
      key: 'leaveType',
      header: 'Tipo de Licença',
      sortable: true,
      render: (item: LeaveRequest) => item.leaveType.name,
    },
    {
      key: 'period',
      header: 'Período',
      sortable: true,
      render: (item: LeaveRequest) => (
        <div>
          <p className="text-sm text-gray-900">
            {format(new Date(item.startDate), 'dd/MM/yyyy')} -{' '}
            {format(new Date(item.endDate), 'dd/MM/yyyy')}
          </p>
          <p className="text-xs text-gray-500">{item.days} dias</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item: LeaveRequest) => (
        <Badge variant={getStatusVariant(item.status)}>{getStatusLabel(item.status)}</Badge>
      ),
    },
    {
      key: 'reason',
      header: 'Motivo',
      render: (item: LeaveRequest) => (
        <p className="text-sm text-gray-600 max-w-xs truncate">{item.reason || '-'}</p>
      ),
    },
    {
      key: 'createdAt',
      header: 'Solicitado em',
      sortable: true,
      render: (item: LeaveRequest) => format(new Date(item.createdAt), 'dd/MM/yyyy'),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right' as const,
      render: (item: LeaveRequest) => (
        <div className="flex gap-2 justify-end">
          {item.status === LeaveRequestStatus.PENDING && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openApproveModal(item)}
              >
                Aprovar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openRejectModal(item)}
              >
                Rejeitar
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: LeaveRequestStatus.PENDING, label: 'Pendente' },
        { value: LeaveRequestStatus.APPROVED, label: 'Aprovada' },
        { value: LeaveRequestStatus.REJECTED, label: 'Rejeitada' },
        { value: LeaveRequestStatus.CANCELLED, label: 'Cancelada' },
      ],
    },
  ];

  return (
    <AdminLayout moduleId="leaves">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Licenças</h1>
          <p className="text-gray-600">Aprove ou rejeite solicitações de licença</p>
        </div>

        <DataTable
          data={requests}
          columns={columns}
          filters={filters}
          loading={loading}
          searchable
          searchPlaceholder="Buscar por funcionário ou tipo de licença..."
          pageSize={10}
        />

        <Modal
          isOpen={!!selectedRequest && actionType === 'approve'}
          onClose={() => {
            setSelectedRequest(null);
            setActionType(null);
            setNotes('');
          }}
          title="Aprovar Solicitação de Licença"
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Funcionário</p>
                <p className="font-medium">{selectedRequest.employee?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-medium">{selectedRequest.leaveType.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Período</p>
                <p className="font-medium">
                  {format(new Date(selectedRequest.startDate), 'dd/MM/yyyy')} -{' '}
                  {format(new Date(selectedRequest.endDate), 'dd/MM/yyyy')} ({selectedRequest.days} dias)
                </p>
              </div>
              <Textarea
                label="Observações (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Adicione observações sobre a aprovação..."
              />
              <div className="flex gap-2">
                <Button onClick={handleApprove}>Confirmar Aprovação</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                    setNotes('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={!!selectedRequest && actionType === 'reject'}
          onClose={() => {
            setSelectedRequest(null);
            setActionType(null);
            setNotes('');
          }}
          title="Rejeitar Solicitação de Licença"
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Funcionário</p>
                <p className="font-medium">{selectedRequest.employee?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-medium">{selectedRequest.leaveType.name}</p>
              </div>
              <Textarea
                label="Motivo da Rejeição *"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Informe o motivo da rejeição..."
                required
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  disabled={!notes.trim()}
                  variant="danger"
                >
                  Confirmar Rejeição
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                    setNotes('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

