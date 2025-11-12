import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { useContractors } from '../../../hooks/useContractLabor';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate } from '../../../utils/formatters';

export const ContractorsView: React.FC = () => {
  const { contractors, loading, error } = useContractors();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearch = 
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && contractor.isActive) ||
      (statusFilter === 'inactive' && !contractor.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const activeContractors = contractors.filter(c => c.isActive).length;
  const inactiveContractors = contractors.filter(c => !c.isActive).length;

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="space-y-6">
          <PageHeader
            title="Empresas Contratadas"
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
          title="Empresas Contratadas"
          subtitle={`${activeContractors} ativos, ${inactiveContractors} inativos`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContractors.map((contractor) => (
            <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{contractor.companyName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{contractor.name}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      contractor.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {contractor.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📧</span>
                    <span>{contractor.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📱</span>
                    <span>{contractor.contactPhone}</span>
                  </div>
                  {contractor.address && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📍</span>
                      <span className="text-xs">{contractor.address}</span>
                    </div>
                  )}
                  {contractor.taxId && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🏢</span>
                      <span className="text-xs">{contractor.taxId}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      Cadastrado em {formatDate(contractor.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredContractors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma empresa contratada encontrada</p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

