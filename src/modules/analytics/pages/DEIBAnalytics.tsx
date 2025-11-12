import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { Card } from '../../../components/common/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { SimpleChart } from '../../../components/charts/SimpleChart';
import { useDEIBAnalytics } from '../../../hooks/useDEIBAnalytics';

export const DEIBAnalytics: React.FC = () => {
  const { deibData, loading } = useDEIBAnalytics();

  if (loading) {
    return (
      <ModuleLayout moduleId="analytics">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  const genderData = deibData?.genderDistribution?.map((item) => ({
    label: item.gender,
    value: item.count,
  })) || [];

  const ethnicityData = deibData?.ethnicityDistribution?.map((item) => ({
    label: item.ethnicity,
    value: item.count,
  })) || [];

  const ageGroupData = deibData?.ageDistribution?.map((item) => ({
    label: item.ageGroup,
    value: item.count,
  })) || [];

  const payEquityData = deibData?.payEquity?.map((item) => ({
    label: item.category,
    value: item.gap,
  })) || [];

  return (
    <ModuleLayout moduleId="analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DEIB Analytics</h1>
          <p className="text-gray-600">Diversity, Equity, Inclusion & Belonging Analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Diversidade de Gênero</p>
              <p className="text-2xl font-bold text-gray-900">
                {deibData?.genderDiversityIndex?.toFixed(1) || '0.0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Índice (0-100)</p>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Equidade Salarial</p>
              <p className="text-2xl font-bold text-gray-900">
                {deibData?.payEquityIndex?.toFixed(1) || '0.0'}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Índice de equidade</p>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Inclusão</p>
              <p className="text-2xl font-bold text-gray-900">
                {deibData?.inclusionScore?.toFixed(1) || '0.0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Score (0-10)</p>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Liderança Diversa</p>
              <p className="text-2xl font-bold text-gray-900">
                {deibData?.diverseLeadership?.toFixed(1) || '0.0'}%
              </p>
              <p className="text-xs text-gray-500 mt-1">% em posições de liderança</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {genderData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Distribuição por Gênero</h2>
              <SimpleChart
                title="Distribuição de Gênero"
                data={genderData}
                type="pie"
                height={300}
                showLegend
              />
            </Card>
          )}

          {ethnicityData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Distribuição Étnica</h2>
              <SimpleChart
                title="Distribuição Étnica"
                data={ethnicityData}
                type="pie"
                height={300}
                showLegend
              />
            </Card>
          )}

          {ageGroupData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Distribuição por Idade</h2>
              <SimpleChart
                title="Distribuição por Faixa Etária"
                data={ageGroupData}
                type="bar"
                height={300}
              />
            </Card>
          )}

          {payEquityData.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Equidade Salarial</h2>
              <SimpleChart
                title="Gap Salarial por Categoria"
                data={payEquityData}
                type="bar"
                height={300}
              />
            </Card>
          )}
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Recomendações DEIB</h2>
          <div className="space-y-3">
            {deibData?.recommendations?.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  rec.priority === 'HIGH'
                    ? 'bg-red-50 border-red-200'
                    : rec.priority === 'MEDIUM'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Impacto esperado: {rec.expectedImpact}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      rec.priority === 'HIGH'
                        ? 'bg-red-200 text-red-800'
                        : rec.priority === 'MEDIUM'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

