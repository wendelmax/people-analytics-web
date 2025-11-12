import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { useContractLabor } from '../../../hooks/useContractLabor';
import { ContractLaborForm } from '../components/ContractLaborForm';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { CreateContractLaborDto, UpdateContractLaborDto, ContractLabor, ContractLaborStatus } from '../../../types';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export const LaborManagement: React.FC = () => {
  const { labor, loading, error, createLabor, updateLabor, deleteLabor } = useContractLabor();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState<ContractLabor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const toast = useToastContext();
  const navigate = useNavigate();

  const handleCreate = async (data: CreateContractLaborDto) => {
    try {
      await createLabor(data);
      setIsCreateModalOpen(false);
      toast.success('Trabalhador criado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar trabalhador');
    }
  };

  const handleUpdate = async (data: UpdateContractLaborDto) => {
    if (!editingLabor) return;
    try {
      await updateLabor(editingLabor.id, data);
      setEditingLabor(null);
      toast.success('Trabalhador atualizado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar trabalhador');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este trabalhador?')) return;
    try {
      await deleteLabor(id);
      toast.success('Trabalhador excluído com sucesso!');
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

  const filteredLabor = labor.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractor?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeLabor = labor.filter(l => l.status === ContractLaborStatus.ACTIVE).length;
  const inactiveLabor = labor.filter(l => l.status === ContractLaborStatus.INACTIVE).length;
  const terminatedLabor = labor.filter(l => l.status === ContractLaborStatus.TERMINATED).length;
  const totalWages = labor
    .filter(l => l.status === ContractLaborStatus.ACTIVE)
    .reduce((sum, l) => sum + l.wage, 0);

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="space-y-6">
          <PageHeader
            title="Gestão de Mão de Obra"
            subtitle="Carregando..."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <ModuleLayout moduleId="contract-labor">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="contract-labor">
      <div className="space-y-6">
        <PageHeader
          title="Gestão de Mão de Obra"
          subtitle={`${activeLabor} trabalhadores ativos`}
          actions={[
            {
              label: 'Novo Trabalhador',
              onClick: () => setIsCreateModalOpen(true),
              variant: 'primary',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{labor.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total de Trabalhadores</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{activeLabor}</div>
              <div className="text-sm text-gray-600 mt-1">Ativos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{inactiveLabor}</div>
              <div className="text-sm text-gray-600 mt-1">Inativos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{terminatedLabor}</div>
              <div className="text-sm text-gray-600 mt-1">Terminados</div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
            <div className="text-sm text-blue-800">
              Custo Total Mensal (Ativos): <span className="font-bold text-lg">{formatCurrency(totalWages)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Buscar por nome, especialidade ou contratado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value={ContractLaborStatus.ACTIVE}>Ativo</option>
              <option value={ContractLaborStatus.INACTIVE}>Inativo</option>
              <option value={ContractLaborStatus.TERMINATED}>Terminado</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trabalhador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contratado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Início
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projeto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLabor.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.skill}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.contractor?.companyName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{item.contractor?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(item.wage)} {item.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.project?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/contract-labor/${item.id}`)}
                        className="mr-2"
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLabor(item)}
                        className="mr-2"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLabor.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum trabalhador encontrado</p>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Trabalhador"
        size="lg"
      >
        <ContractLaborForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingLabor}
        onClose={() => setEditingLabor(null)}
        title="Editar Trabalhador"
        size="lg"
      >
        {editingLabor && (
          <ContractLaborForm
            initialData={editingLabor}
            onSubmit={handleUpdate}
            onCancel={() => setEditingLabor(null)}
          />
        )}
      </Modal>
    </ModuleLayout>
  );
};

