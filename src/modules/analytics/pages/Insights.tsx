import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useInsights } from '../../../hooks/useInsights';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { Card } from '../../../components/common/Card';
import { formatDate } from '../../../utils/formatters';

export const Insights: React.FC = () => {
  const { insights, loading, error } = useInsights();

  if (loading) {
    return (
      <ModuleLayout moduleId="analytics">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="analytics">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Insights</h1>
          <p className="text-gray-600">Visualize insights e previsões do sistema</p>
        </div>

        {insights.length === 0 ? (
          <EmptyState title="Nenhum insight encontrado" />
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                  <p className="text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex gap-2 items-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {insight.type}
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      {insight.priority}
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {formatDate(insight.createdAt)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

