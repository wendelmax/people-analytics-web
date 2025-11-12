import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Review180360Data, ReviewFinalReport } from '../../../types/review180360';

export const ReviewReport: React.FC = () => {
  const [review, setReview] = useState<Review180360Data | null>(null);
  const [report, setReport] = useState<ReviewFinalReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockReview: Review180360Data = {
      id: 'review-1',
      cycleId: 'cycle-1',
      employeeId: 'emp-1',
      employeeName: 'João Silva',
      employeePosition: 'Analista Pleno',
      isSenior: false,
      reviewType: '180',
      status: 'COMPLETED',
      peerReviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockReport: ReviewFinalReport = {
      id: 'report-1',
      reviewId: 'review-1',
      overallRating: 4.2,
      aiSummary: `João demonstrou excelente desempenho durante o período avaliado, com destaque para suas habilidades técnicas e capacidade de entrega. Sua colaboração com a equipe foi consistente e ele mostrou proatividade na resolução de problemas complexos. As áreas de desenvolvimento identificadas incluem comunicação mais assertiva em reuniões e maior autonomia na tomada de decisões estratégicas.`,
      strengths: [
        'Excelente conhecimento técnico e capacidade de resolução de problemas',
        'Alta produtividade e entrega consistente de resultados',
        'Boa colaboração e trabalho em equipe',
        'Proatividade e iniciativa em projetos',
      ],
      areasForImprovement: [
        'Comunicação mais assertiva em apresentações e reuniões',
        'Maior autonomia na tomada de decisões estratégicas',
        'Desenvolvimento de habilidades de liderança',
        'Melhor gestão de tempo em projetos complexos',
      ],
      recommendations: [
        'Participar de treinamentos em comunicação e apresentação',
        'Assumir mais responsabilidades em projetos estratégicos',
        'Buscar mentoria com líderes sênior',
        'Desenvolver habilidades de negociação e influência',
      ],
      managerFeedback: `João tem sido um membro valioso da equipe, sempre entregando resultados de alta qualidade. Sua dedicação e comprometimento são evidentes. Recomendo focar no desenvolvimento de habilidades de comunicação e liderança para prepará-lo para próximos desafios na carreira.`,
      generatedAt: new Date().toISOString(),
    };

    setReview(mockReview);
    setReport(mockReport);
    setLoading(false);
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </ModuleLayout>
    );
  }

  if (!review || !report) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum relatório disponível</p>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Relatório de Avaliação"
          subtitle={`Relatório final da avaliação ${review.reviewType}° - ${review.employeeName}`}
          actions={[
            {
              label: 'Exportar PDF',
              onClick: () => {},
              variant: 'outline',
              icon: '📄',
            },
          ]}
        />

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{review.employeeName}</h3>
                <p className="text-sm text-gray-500">{review.employeePosition}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Avaliação Geral</p>
                <p className="text-4xl font-bold text-blue-600">{report.overallRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">de 5.0</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${(report.overallRating / 5) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-semibold text-gray-900">Resumo por IA</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{report.aiSummary}</p>
            <p className="text-xs text-gray-500 mt-4">
              Gerado em {new Date(report.generatedAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⭐</span>
                <h3 className="text-lg font-semibold text-gray-900">Pontos Fortes</h3>
              </div>
              <ul className="space-y-3">
                {report.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📈</span>
                <h3 className="text-lg font-semibold text-gray-900">Áreas de Desenvolvimento</h3>
              </div>
              <ul className="space-y-3">
                {report.areasForImprovement.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">→</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-semibold text-gray-900">Recomendações</h3>
            </div>
            <ul className="space-y-3">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {report.managerFeedback && (
          <Card className="bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">👔</span>
                <h3 className="text-lg font-semibold text-blue-900">Feedback do Gestor Imediato</h3>
              </div>
              <p className="text-blue-800 leading-relaxed">{report.managerFeedback}</p>
            </div>
          </Card>
        )}

        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Tipo de Avaliação</p>
                <p className="text-lg font-semibold text-gray-900">
                  Avaliação {review.reviewType}°
                </p>
              </div>
              <Button variant="outline" onClick={() => window.print()}>
                Imprimir Relatório
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

