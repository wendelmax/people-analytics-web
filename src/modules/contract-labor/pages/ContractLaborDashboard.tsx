import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { useContractLabor } from '../../../hooks/useContractLabor';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { ContractLaborStatus, CreateContractLaborDto } from '../../../types';
import { ContractLaborForm } from '../components/ContractLaborForm';
import { useToastContext } from '../../../contexts/ToastContext';

export const ContractLaborDashboard: React.FC = () => {
  const { labor, loading, error, createLabor } = useContractLabor();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const toast = useToastContext();

  const handleCreate = async (data: CreateContractLaborDto) => {
    try {
      await createLabor(data);
      setIsCreateModalOpen(false);
      toast.success('Trabalhador criado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar trabalhador');
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="space-y-6">
          <PageHeader
            title="Mão de Obra Terceirizada"
            subtitle="Carregando..."
            actions={[{ label: 'Novo Contrato', onClick: () => {}, variant: 'primary', icon: '➕' }]}
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

  const activeLabor = labor.filter((l) => l.status === ContractLaborStatus.ACTIVE).length;
  const inactiveLabor = labor.filter((l) => l.status === ContractLaborStatus.INACTIVE).length;
  const terminatedLabor = labor.filter((l) => l.status === ContractLaborStatus.TERMINATED).length;
  const totalMonthlyWages = labor
    .filter((l) => l.status === ContractLaborStatus.ACTIVE)
    .reduce((sum, l) => sum + l.wage, 0);

  const filteredLabor = labor.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractor?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <ModuleLayout moduleId="contract-labor">
      <div className="space-y-6">
        <PageHeader
          title="Mão de Obra Terceirizada"
          subtitle={`${activeLabor} trabalhadores ativos`}
          actions={[
            {
              label: 'Novo Contrato',
              onClick: () => setIsCreateModalOpen(true),
              variant: 'primary',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalMonthlyWages)}</div>
              <div className="text-sm text-gray-600 mt-1">Custo Mensal Total</div>
            </div>
          </Card>
        </div>

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
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabor.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/contract-labor/${item.id}`)}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.skill}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status === ContractLaborStatus.ACTIVE ? 'Ativo' : 
                     item.status === ContractLaborStatus.INACTIVE ? 'Inativo' : 'Terminado'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Contratado: {item.contractor?.companyName || 'N/A'}</p>
                  <p>Salário: {formatCurrency(item.wage)} {item.currency}</p>
                  {item.project && <p>Projeto: {item.project.name}</p>}
                  <p>Início: {formatDate(item.startDate)}</p>
                  {item.endDate && <p>Término: {formatDate(item.endDate)}</p>}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/contract-labor/${item.id}`);
                  }}
                >
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredLabor.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhum trabalhador encontrado com os filtros aplicados' 
                : 'Nenhum trabalhador terceirizado encontrado'}
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Trabalhador Terceirizado"
        size="lg"
      >
        <ContractLaborForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </ModuleLayout>
  );
};

