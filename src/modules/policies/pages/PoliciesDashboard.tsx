import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { DocumentCard } from '../../../components/common/DocumentCard';
import { usePolicies } from '../../../hooks/usePolicies';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate } from '../../../utils/formatters';
import { PolicyStatus, PolicyCategory } from '../../../types';

export const PoliciesDashboard: React.FC = () => {
  const { policies, loading, error } = usePolicies();
  const [filter, setFilter] = useState<'ALL' | PolicyStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | PolicyCategory>('ALL');

  if (loading) {
    return (
      <ModuleLayout moduleId="policies">
        <div className="space-y-6">
          <PageHeader
            title="Políticas da Empresa"
            subtitle="Carregando..."
            actions={[{ label: 'Nova Política', onClick: () => {}, variant: 'primary', icon: '➕' }]}
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
      <ModuleLayout moduleId="policies">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const filteredPolicies = policies.filter((policy) => {
    if (filter !== 'ALL' && policy.status !== filter) return false;
    if (categoryFilter !== 'ALL' && policy.category !== categoryFilter) return false;
    return true;
  });

  const getStatusColor = (status: PolicyStatus) => {
    switch (status) {
      case PolicyStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case PolicyStatus.APPROVED:
        return 'bg-blue-100 text-blue-800';
      case PolicyStatus.PENDING_APPROVAL:
        return 'bg-yellow-100 text-yellow-800';
      case PolicyStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case PolicyStatus.ARCHIVED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModuleLayout moduleId="policies">
      <div className="space-y-6">
        <PageHeader
          title="Políticas da Empresa"
          subtitle={`${filteredPolicies.length} políticas disponíveis`}
          actions={[
            {
              label: 'Nova Política',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'ALL' | PolicyStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">Todos os Status</option>
            {Object.values(PolicyStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'ALL' | PolicyCategory)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">Todas as Categorias</option>
            {Object.values(PolicyCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{policy.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      policy.status
                    )}`}
                  >
                    {policy.status.replace('_', ' ')}
                  </span>
                </div>
                {policy.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{policy.description}</p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Versão {policy.version}</span>
                  <span>{formatDate(policy.effectiveDate)}</span>
                </div>
                {policy.requiresAcknowledgment && (
                  <Button variant="primary" className="w-full" size="sm">
                    Aceitar Política
                  </Button>
                )}
                <Button variant="outline" className="w-full" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma política encontrada</p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

