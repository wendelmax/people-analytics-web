import React, { useState, useMemo } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useContractLabor } from '../../../hooks/useContractLabor';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { ContractLaborStatus } from '../../../types';

export const ContractLaborReports: React.FC = () => {
  const { labor, loading, error } = useContractLabor();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [reportType, setReportType] = useState<'summary' | 'costs' | 'attendance' | 'performance'>('summary');

  const analytics = useMemo(() => {
    const activeLabor = labor.filter(l => l.status === ContractLaborStatus.ACTIVE);
    
    const totalMonthlyCost = activeLabor.reduce((sum, l) => sum + l.wage, 0);
    const totalAnnualCost = totalMonthlyCost * 12;
    
    const costsByContractor = activeLabor.reduce((acc, l) => {
      const contractorId = l.contractorId;
      const contractorName = l.contractor?.companyName || 'N/A';
      if (!acc[contractorId]) {
        acc[contractorId] = {
          name: contractorName,
          totalCost: 0,
          count: 0,
          workers: [] as string[],
        };
      }
      acc[contractorId].totalCost += l.wage;
      acc[contractorId].count += 1;
      acc[contractorId].workers.push(l.name);
      return acc;
    }, {} as Record<string, { name: string; totalCost: number; count: number; workers: string[] }>);

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

    const contractsExpiringSoon = labor.filter((l) => {
      if (!l.endDate || l.status !== ContractLaborStatus.ACTIVE) return false;
      const end = new Date(l.endDate);
      const today = new Date();
      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= 60 && diff > 0;
    });

    const statusDistribution = {
      active: labor.filter(l => l.status === ContractLaborStatus.ACTIVE).length,
      inactive: labor.filter(l => l.status === ContractLaborStatus.INACTIVE).length,
      terminated: labor.filter(l => l.status === ContractLaborStatus.TERMINATED).length,
    };

    return {
      totalMonthlyCost,
      totalAnnualCost,
      activeWorkers: activeLabor.length,
      averageCost: activeLabor.length > 0 ? totalMonthlyCost / activeLabor.length : 0,
      costsByContractor: Object.entries(costsByContractor).map(([id, data]) => ({ id, ...data })),
      costsByProject: Object.entries(costsByProject).map(([id, data]) => ({ id, ...data })),
      contractsExpiringSoon,
      statusDistribution,
    };
  }, [labor]);

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Exportando relatório em formato ${format.toUpperCase()}...`);
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
          title="Relatórios de Mão de Obra Terceirizada"
          subtitle="Análises e relatórios detalhados"
          actions={[
            {
              label: 'Exportar PDF',
              onClick: () => handleExport('pdf'),
              variant: 'outline',
            },
            {
              label: 'Exportar Excel',
              onClick: () => handleExport('excel'),
              variant: 'outline',
            },
          ]}
        />

        <div className="flex gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
          </select>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="summary">Resumo Executivo</option>
            <option value="costs">Análise de Custos</option>
            <option value="attendance">Presença e Horas</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        {reportType === 'summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{labor.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Total de Contratos</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analytics.activeWorkers}</div>
                  <div className="text-sm text-gray-600 mt-1">Contratos Ativos</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(analytics.totalMonthlyCost)}</div>
                  <div className="text-sm text-gray-600 mt-1">Custo Mensal</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.totalAnnualCost)}</div>
                  <div className="text-sm text-gray-600 mt-1">Custo Anual</div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ativos</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(analytics.statusDistribution.active / labor.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {analytics.statusDistribution.active}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Inativos</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-500 h-2 rounded-full"
                          style={{
                            width: `${(analytics.statusDistribution.inactive / labor.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {analytics.statusDistribution.inactive}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Terminados</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${(analytics.statusDistribution.terminated / labor.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {analytics.statusDistribution.terminated}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contratos Próximos ao Vencimento</h3>
                {analytics.contractsExpiringSoon.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum contrato próximo ao vencimento</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.contractsExpiringSoon.slice(0, 5).map((contract) => (
                      <div
                        key={contract.id}
                        className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded"
                      >
                        <div className="font-medium text-gray-900">{contract.name}</div>
                        <div className="text-sm text-gray-600">{contract.contractor?.companyName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Vence em {formatDate(contract.endDate!)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {reportType === 'costs' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos por Contratado</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Contratado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Trabalhadores
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Custo Total/Mês
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Custo Anual
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.costsByContractor.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-600">
                            {formatCurrency(item.totalCost)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(item.totalCost * 12)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos por Projeto</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Projeto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Trabalhadores
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Custo Mensal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.costsByProject.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(item.totalCost)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {reportType === 'attendance' && (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relatório de Presença</h3>
              <p className="text-gray-500">Em breve: Relatórios detalhados de presença e horas trabalhadas</p>
            </div>
          </Card>
        )}

        {reportType === 'performance' && (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relatório de Performance</h3>
              <p className="text-gray-500">Em breve: Avaliações e métricas de desempenho</p>
            </div>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

