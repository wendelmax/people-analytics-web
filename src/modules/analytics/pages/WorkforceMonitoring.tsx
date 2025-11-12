import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { SimpleChart } from '../../../components/charts/SimpleChart';
import { useWorkforceMonitoring } from '../../../hooks/useWorkforceMonitoring';

export const WorkforceMonitoring: React.FC = () => {
  const { workforceData, loading, refresh } = useWorkforceMonitoring();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  if (loading) {
    return (
      <ModuleLayout moduleId="analytics">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  const headcountData = workforceData?.headcountTrend?.map((item) => ({
    label: item.month,
    value: item.count,
  })) || [];

  const costData = workforceData?.costTrend?.map((item) => ({
    label: item.month,
    value: item.totalCost,
  })) || [];

  const productivityData = workforceData?.productivityMetrics?.map((item) => ({
    label: item.department,
    value: item.productivityScore,
  })) || [];

  const capacityData = workforceData?.capacityAnalysis?.map((item) => ({
    label: item.department,
    value: item.utilization,
  })) || [];

  return (
    <ModuleLayout moduleId="analytics">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workforce Monitoring</h1>
            <p className="text-gray-600">Monitoramento e análise da força de trabalho</p>
          </div>
          <Button variant="primary" onClick={refresh}>
            Atualizar Dados
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Headcount Total</p>
              <p className="text-2xl font-bold text-gray-900">{workforceData?.totalHeadcount || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {workforceData?.headcountChange && workforceData.headcountChange > 0 ? '+' : ''}
                {workforceData?.headcountChange || 0} vs mês anterior
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Custo Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {workforceData?.totalCost?.toLocaleString('pt-BR') || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Custo mensal da força de trabalho</p>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Produtividade Média</p>
              <p className="text-2xl font-bold text-gray-900">
                {workforceData?.averageProductivity?.toFixed(1) || '0.0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Score (0-10)</p>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Utilização</p>
              <p className="text-2xl font-bold text-gray-900">
                {workforceData?.averageUtilization?.toFixed(1) || '0.0'}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Taxa média de utilização</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {headcountData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Tendência de Headcount</h2>
              <SimpleChart
                title="Evolução do Headcount"
                data={headcountData}
                type="line"
                height={300}
              />
            </Card>
          )}

          {costData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Tendência de Custos</h2>
              <SimpleChart
                title="Evolução dos Custos"
                data={costData}
                type="line"
                height={300}
              />
            </Card>
          )}

          {productivityData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Produtividade por Departamento</h2>
              <SimpleChart
                title="Produtividade"
                data={productivityData}
                type="bar"
                height={300}
              />
            </Card>
          )}

          {capacityData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Análise de Capacidade</h2>
              <SimpleChart
                title="Utilização por Departamento"
                data={capacityData}
                type="bar"
                height={300}
              />
            </Card>
          )}
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Análise Organizacional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Estrutura Organizacional</h3>
              <p className="text-sm text-gray-600">
                {workforceData?.organizationalStructure?.totalDepartments || 0} Departamentos
              </p>
              <p className="text-sm text-gray-600">
                {workforceData?.organizationalStructure?.totalTeams || 0} Times
              </p>
              <p className="text-sm text-gray-600">
                {workforceData?.organizationalStructure?.avgTeamSize?.toFixed(1) || '0.0'} pessoas por time
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Métricas de Eficiência</h3>
              <p className="text-sm text-gray-600">
                Revenue per Employee: R${' '}
                {workforceData?.efficiencyMetrics?.revenuePerEmployee?.toLocaleString('pt-BR') || '0'}
              </p>
              <p className="text-sm text-gray-600">
                Cost per Hire: R${' '}
                {workforceData?.efficiencyMetrics?.costPerHire?.toLocaleString('pt-BR') || '0'}
              </p>
              <p className="text-sm text-gray-600">
                Time to Productivity: {workforceData?.efficiencyMetrics?.timeToProductivity || 0} dias
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

