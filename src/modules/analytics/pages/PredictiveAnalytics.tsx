import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { SimpleChart } from '../../../components/charts/SimpleChart';
import { usePredictiveAnalytics } from '../../../hooks/usePredictiveAnalytics';

export const PredictiveAnalytics: React.FC = () => {
  const { predictions, loading, refresh } = usePredictiveAnalytics();
  const [selectedView, setSelectedView] = useState<'flight-risk' | 'high-performers' | 'turnover'>('flight-risk');

  if (loading) {
    return (
      <ModuleLayout moduleId="analytics">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  const flightRiskData = predictions?.flightRisk?.map((emp) => ({
    label: emp.name,
    value: emp.riskScore,
  })) || [];

  const highPerformersData = predictions?.highPerformers?.map((emp) => ({
    label: emp.name,
    value: emp.performanceScore,
  })) || [];

  const turnoverData = predictions?.turnoverPrediction?.map((pred) => ({
    label: pred.period,
    value: pred.predictedRate,
  })) || [];

  return (
    <ModuleLayout moduleId="analytics">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Preditivos</h1>
            <p className="text-gray-600">Previsões baseadas em IA e Machine Learning</p>
          </div>
          <Button variant="primary" onClick={refresh}>
            Atualizar Previsões
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer transition-all ${
              selectedView === 'flight-risk' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedView('flight-risk')}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-semibold text-gray-900">Flight Risk</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Risco de saída de funcionários</p>
              <p className="text-2xl font-bold text-red-600">
                {predictions?.flightRisk?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Funcionários em risco</p>
            </div>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedView === 'high-performers' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedView('high-performers')}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <h3 className="font-semibold text-gray-900">High Performers</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Top talentos identificados</p>
              <p className="text-2xl font-bold text-green-600">
                {predictions?.highPerformers?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Funcionários de alta performance</p>
            </div>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedView === 'turnover' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedView('turnover')}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📊</span>
                <h3 className="font-semibold text-gray-900">Turnover</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Previsão de rotatividade</p>
              <p className="text-2xl font-bold text-blue-600">
                {predictions?.turnoverPrediction?.[0]?.predictedRate?.toFixed(1) || '0.0'}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Taxa prevista (próximos 6 meses)</p>
            </div>
          </Card>
        </div>

        {selectedView === 'flight-risk' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Funcionários em Risco de Saída</h2>
              <div className="space-y-4">
                {predictions?.flightRisk?.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                      <p className="text-sm text-gray-600">{emp.department}</p>
                      <p className="text-xs text-gray-500 mt-1">{emp.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{emp.riskScore}%</p>
                      <p className="text-xs text-gray-500">Risco</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {flightRiskData.length > 0 && (
              <SimpleChart
                title="Distribuição de Flight Risk"
                data={flightRiskData}
                type="bar"
                height={300}
              />
            )}
          </div>
        )}

        {selectedView === 'high-performers' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Top Talentos</h2>
              <div className="space-y-4">
                {predictions?.highPerformers?.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                      <p className="text-sm text-gray-600">{emp.department}</p>
                      <p className="text-xs text-gray-500 mt-1">{emp.strengths.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{emp.performanceScore}</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {highPerformersData.length > 0 && (
              <SimpleChart
                title="Distribuição de High Performers"
                data={highPerformersData}
                type="bar"
                height={300}
              />
            )}
          </div>
        )}

        {selectedView === 'turnover' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Previsão de Turnover</h2>
              <div className="space-y-4">
                {predictions?.turnoverPrediction?.map((pred) => (
                  <div
                    key={pred.period}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{pred.period}</h3>
                      <p className="text-sm text-gray-600">{pred.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{pred.predictedRate}%</p>
                      <p className="text-xs text-gray-500">Taxa prevista</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {turnoverData.length > 0 && (
              <SimpleChart
                title="Evolução Prevista de Turnover"
                data={turnoverData}
                type="line"
                height={300}
              />
            )}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

