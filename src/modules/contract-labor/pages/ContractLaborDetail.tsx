import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { ContractLabor, ContractLaborStatus } from '../../../types';
import { contractLaborService } from '../../../services/contractLaborService';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';
import { ContractLaborForm } from '../components/ContractLaborForm';
import { useContractLaborAttendance } from '../../../hooks/useContractLabor';

export const ContractLaborDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToastContext();
  const [labor, setLabor] = useState<ContractLabor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { attendance, loading: attendanceLoading } = useContractLaborAttendance(id);

  useEffect(() => {
    if (id) {
      fetchLabor();
    }
  }, [id]);

  const fetchLabor = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await contractLaborService.getById(id);
      setLabor(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!id) return;
    try {
      const updated = await contractLaborService.update(id, data);
      setLabor(updated);
      setIsEditModalOpen(false);
      toast.success('Trabalhador atualizado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar trabalhador');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir este trabalhador?')) return;
    try {
      await contractLaborService.delete(id);
      toast.success('Trabalhador excluído com sucesso!');
      navigate('/contract-labor/admin/labor');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir trabalhador');
    }
  };

  const getStatusColor = (status: ContractLaborStatus) => {
    switch (status) {
      case ContractLaborStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case ContractLaborStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      case ContractLaborStatus.TERMINATED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ContractLaborStatus) => {
    switch (status) {
      case ContractLaborStatus.ACTIVE:
        return 'Ativo';
      case ContractLaborStatus.INACTIVE:
        return 'Inativo';
      case ContractLaborStatus.TERMINATED:
        return 'Terminado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error || !labor) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <ErrorMessage message={error || 'Trabalhador não encontrado'} />
      </ModuleLayout>
    );
  }

  const daysWorked = attendance.length;
  const totalHours = attendance.reduce((sum, att) => sum + (att.hoursWorked || 0), 0);
  const contractDuration = labor.endDate
    ? Math.ceil((new Date(labor.endDate).getTime() - new Date(labor.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 'Indeterminado';

  return (
    <ModuleLayout moduleId="contract-labor">
      <div className="space-y-6">
        <PageHeader
          title={labor.name}
          subtitle={labor.skill}
          actions={[
            {
              label: 'Editar',
              onClick: () => setIsEditModalOpen(true),
              variant: 'primary',
            },
            {
              label: 'Excluir',
              onClick: handleDelete,
              variant: 'outline',
            },
            {
              label: 'Voltar',
              onClick: () => navigate('/contract-labor'),
              variant: 'outline',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(labor.wage)}</div>
              <div className="text-sm text-gray-600 mt-1">Salário Mensal ({labor.currency})</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{daysWorked}</div>
              <div className="text-sm text-gray-600 mt-1">Dias Trabalhados</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600 mt-1">Horas Totais</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(labor.status)}`}>
                {getStatusLabel(labor.status)}
              </span>
              <div className="text-sm text-gray-600 mt-2">Status Atual</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Contrato</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Nome</div>
                <div className="text-base text-gray-900">{labor.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Especialidade</div>
                <div className="text-base text-gray-900">{labor.skill}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Data de Início</div>
                <div className="text-base text-gray-900">{formatDate(labor.startDate)}</div>
              </div>
              {labor.endDate && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Data de Término</div>
                  <div className="text-base text-gray-900">{formatDate(labor.endDate)}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-500">Duração do Contrato</div>
                <div className="text-base text-gray-900">
                  {typeof contractDuration === 'number' ? `${contractDuration} dias` : contractDuration}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Contratado</h3>
            {labor.contractor ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Empresa</div>
                  <div className="text-base text-gray-900">{labor.contractor.companyName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Contato</div>
                  <div className="text-base text-gray-900">{labor.contractor.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-base text-gray-900">{labor.contractor.contactEmail}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Telefone</div>
                  <div className="text-base text-gray-900">{labor.contractor.contactPhone}</div>
                </div>
                {labor.contractor.taxId && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">CPF/CNPJ</div>
                    <div className="text-base text-gray-900">{labor.contractor.taxId}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">Nenhum contratado associado</div>
            )}
          </Card>
        </div>

        {labor.project && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projeto Associado</h3>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-gray-500">Nome do Projeto</div>
                <div className="text-base text-gray-900">{labor.project.name}</div>
              </div>
              {labor.project.description && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Descrição</div>
                  <div className="text-base text-gray-900">{labor.project.description}</div>
                </div>
              )}
            </div>
          </Card>
        )}

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Presença</h3>
          {attendanceLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : attendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Horas Trabalhadas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Observações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.slice(0, 10).map((att) => (
                    <tr key={att.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(att.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {att.hoursWorked}h
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {att.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {attendance.length > 10 && (
                <div className="text-center py-4 text-sm text-gray-500">
                  Mostrando 10 de {attendance.length} registros
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro de presença encontrado
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Trabalhador"
        size="lg"
      >
        <ContractLaborForm
          initialData={labor}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </ModuleLayout>
  );
};

