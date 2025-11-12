import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { useContractors } from '../../../hooks/useContractLabor';
import { ContractorForm } from '../components/ContractorForm';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { CreateContractorDto, UpdateContractorDto, Contractor } from '../../../types';
import { formatDate } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';

export const ContractorManagement: React.FC = () => {
  const { contractors, loading, error, createContractor, updateContractor, deleteContractor } = useContractors();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToastContext();

  const handleCreate = async (data: CreateContractorDto) => {
    try {
      await createContractor(data);
      setIsCreateModalOpen(false);
      toast.success('Contratado criado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar contratado');
    }
  };

  const handleUpdate = async (data: UpdateContractorDto) => {
    if (!editingContractor) return;
    try {
      await updateContractor(editingContractor.id, data);
      setEditingContractor(null);
      toast.success('Contratado atualizado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar contratado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este contratado?')) return;
    try {
      await deleteContractor(id);
      toast.success('Contratado excluído com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir contratado');
    }
  };

  const filteredContractors = contractors.filter((contractor) =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeContractors = contractors.filter(c => c.isActive).length;
  const inactiveContractors = contractors.filter(c => !c.isActive).length;

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="space-y-6">
          <PageHeader
            title="Gestão de Contratados"
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
          title="Gestão de Contratados"
          subtitle={`${activeContractors} ativos, ${inactiveContractors} inativos`}
          actions={[
            {
              label: 'Novo Contratado',
              onClick: () => setIsCreateModalOpen(true),
              variant: 'primary',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{contractors.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total de Contratados</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{activeContractors}</div>
              <div className="text-sm text-gray-600 mt-1">Ativos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{inactiveContractors}</div>
              <div className="text-sm text-gray-600 mt-1">Inativos</div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContractors.map((contractor) => (
                  <tr key={contractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contractor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contractor.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contractor.contactEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contractor.contactPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          contractor.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {contractor.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contractor.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingContractor(contractor)}
                        className="mr-2"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contractor.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContractors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum contratado encontrado</p>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Contratado"
        size="lg"
      >
        <ContractorForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingContractor}
        onClose={() => setEditingContractor(null)}
        title="Editar Contratado"
        size="lg"
      >
        {editingContractor && (
          <ContractorForm
            initialData={editingContractor}
            onSubmit={handleUpdate}
            onCancel={() => setEditingContractor(null)}
          />
        )}
      </Modal>
    </ModuleLayout>
  );
};

