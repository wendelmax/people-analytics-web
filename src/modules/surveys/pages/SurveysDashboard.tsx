import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useAvailableSurveys } from '../../../hooks/useSurveys';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate } from '../../../utils/formatters';
import { SurveyStatus } from '../../../types';

export const SurveysDashboard: React.FC = () => {
  const { surveys, loading, error } = useAvailableSurveys();

  if (loading) {
    return (
      <ModuleLayout moduleId="surveys">
        <div className="space-y-6">
          <PageHeader
            title="Pesquisas Disponíveis"
            subtitle="Carregando..."
            actions={[{ label: 'Nova Pesquisa', onClick: () => {}, variant: 'primary', icon: '➕' }]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="surveys">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const getStatusColor = (status: SurveyStatus) => {
    switch (status) {
      case SurveyStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case SurveyStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      case SurveyStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case SurveyStatus.ARCHIVED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeSurveys = surveys.filter((s) => s.status === SurveyStatus.ACTIVE).length;

  return (
    <ModuleLayout moduleId="surveys">
      <div className="space-y-6">
        <PageHeader
          title="Pesquisas Disponíveis"
          subtitle={`${activeSurveys} pesquisas ativas`}
          actions={[
            {
              label: 'Nova Pesquisa',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                    {survey.description && (
                      <p className="text-sm text-gray-500 mt-1">{survey.description}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      survey.status
                    )}`}
                  >
                    {survey.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <p>
                    {formatDate(survey.startDate)} - {formatDate(survey.endDate)}
                  </p>
                  <p>{survey.questions.length} perguntas</p>
                  {survey.anonymous && <p className="text-blue-600">Anônimo</p>}
                </div>
                {survey.status === SurveyStatus.ACTIVE && (
                  <Button variant="primary" className="w-full">
                    Responder Pesquisa
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {surveys.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma pesquisa disponível</p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

