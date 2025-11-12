import React, { useMemo } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { useContractLabor } from '../../../hooks/useContractLabor';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatCurrency } from '../../../utils/formatters';
import { ContractLaborStatus } from '../../../types';

export const CostsAnalysis: React.FC = () => {
  const { labor, loading, error } = useContractLabor();

  const analytics = useMemo(() => {
    const activeLabor = labor.filter(l => l.status === ContractLaborStatus.ACTIVE);
    
    const totalMonthlyCost = activeLabor.reduce((sum, l) => sum + l.wage, 0);
    
    const costsByContractor = activeLabor.reduce((acc, l) => {
      const contractorId = l.contractorId;
      const contractorName = l.contractor?.companyName || 'N/A';
      if (!acc[contractorId]) {
        acc[contractorId] = {
          name: contractorName,
          totalCost: 0,
          count: 0,
        };
      }
      acc[contractorId].totalCost += l.wage;
      acc[contractorId].count += 1;
      return acc;
    }, {} as Record<string, { name: string; totalCost: number; count: number }>);

    const costsByProject = activeLabor.reduce((acc, l) => {
      const projectId = l.projectId || 'unallocated';
      const projectName = l.project?.name || 'Não Alocado';
      if (!acc[projectId]) {
        acc[projectId] = {
          name: projectName,
          totalCost: 0,
          count: 0,
        };
      }
      acc[projectId].totalCost += l.wage;
      acc[projectId].count += 1;
      return acc;
    }, {} as Record<string, { name: string; totalCost: number; count: number }>);

    const costsBySkill = activeLabor.reduce((acc, l) => {
      const skill = l.skill;
      if (!acc[skill]) {
        acc[skill] = {
          totalCost: 0,
          count: 0,
          avgCost: 0,
        };
      }
      acc[skill].totalCost += l.wage;
      acc[skill].count += 1;
      acc[skill].avgCost = acc[skill].totalCost / acc[skill].count;
      return acc;
    }, {} as Record<string, { totalCost: number; count: number; avgCost: number }>);

    return {
      totalMonthlyCost,
      totalAnnualCost: totalMonthlyCost * 12,
      activeWorkers: activeLabor.length,
      averageCost: activeLabor.length > 0 ? totalMonthlyCost / activeLabor.length : 0,
      costsByContractor: Object.entries(costsByContractor).map(([id, data]) => ({ id, ...data })),
      costsByProject: Object.entries(costsByProject).map(([id, data]) => ({ id, ...data })),
      costsBySkill: Object.entries(costsBySkill).map(([skill, data]) => ({ skill, ...data })),
    };
  }, [labor]);

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
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
          title="Análise de Custos"
          subtitle="Análise financeira da mão de obra terceirizada"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(analytics.totalMonthlyCost)}</div>
              <div className="text-sm text-gray-600 mt-1">Custo Mensal Total</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(analytics.totalAnnualCost)}</div>
              <div className="text-sm text-gray-600 mt-1">Custo Anual Projetado</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.activeWorkers}</div>
              <div className="text-sm text-gray-600 mt-1">Trabalhadores Ativos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.averageCost)}</div>
              <div className="text-sm text-gray-600 mt-1">Custo Médio</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos por Contratado</h3>
            <div className="space-y-3">
              {analytics.costsByContractor.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
              ) : (
                analytics.costsByContractor.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.count} trabalhador(es)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">{formatCurrency(item.totalCost)}</div>
                      <div className="text-xs text-gray-500">por mês</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos por Projeto</h3>
            <div className="space-y-3">
              {analytics.costsByProject.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
              ) : (
                analytics.costsByProject.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.count} trabalhador(es)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{formatCurrency(item.totalCost)}</div>
                      <div className="text-xs text-gray-500">por mês</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos por Especialidade</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Custo Total/Mês
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Custo Médio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.costsBySkill.map((item) => (
                  <tr key={item.skill} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.skill}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">{formatCurrency(item.totalCost)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(item.avgCost)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

