import React, { useState, useEffect, useCallback } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Review180360Data, ReviewSubmission, ReviewQuestion } from '../../../types/review180360';
import { PerformanceCycle } from '../../../types/performanceCycle';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { review180360Service } from '../../../services/review180360Service';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const mockQuestions: ReviewQuestion[] = [
  {
    id: 'q1',
    question: 'Quais são os principais pontos fortes desta pessoa?',
    category: 'performance',
    required: true,
  },
  {
    id: 'q2',
    question: 'Quais áreas precisam de desenvolvimento?',
    category: 'skills',
    required: true,
  },
  {
    id: 'q3',
    question: 'Como você avalia a colaboração e trabalho em equipe?',
    category: 'collaboration',
    required: true,
  },
  {
    id: 'q4',
    question: 'Dê exemplos concretos de contribuições desta pessoa',
    category: 'performance',
    required: false,
  },
];

interface PeerReviewAssignment {
  id: string;
  cycleId: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeName: string;
  revieweePosition: string;
  reviewerType: 'PEER_MANAGER_SELECTED';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedBy: string;
  assignedAt: string;
}

export const Review180360: React.FC = () => {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState<PerformanceCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [review, setReview] = useState<Review180360Data | null>(null);
  const [peerAssignments, setPeerAssignments] = useState<PeerReviewAssignment[]>([]);
  const [currentStep, setCurrentStep] = useState<'cycles' | 'overview' | 'self' | 'peer' | 'results'>('cycles');
  const [selfReviewAnswers, setSelfReviewAnswers] = useState<Record<string, string>>({});
  const [peerReviewAnswers, setPeerReviewAnswers] = useState<Record<string, Record<string, string>>>({});
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    setLoading(true);
    const allCycles = await performanceCycleService.getAllCycles();
    const cyclesWithReview = allCycles.filter(c => c.review180360?.enabled);
    setCycles(cyclesWithReview);
    setLoading(false);
  };

  const loadReviewData = useCallback(async () => {
    if (!selectedCycleId) return;
    
    const employeeId = 'emp-1';
    const reviewData = await review180360Service.getReviewByCycleId(selectedCycleId, employeeId);
    
    if (reviewData) {
      setReview(reviewData);
      
      if (reviewData.status === 'IN_PROGRESS') {
        const assignments = await review180360Service.getPeerReviewAssignments(selectedCycleId, employeeId) as PeerReviewAssignment[];
        setPeerAssignments(assignments);
      }
      
      setCurrentStep('overview');
    } else {
      setReview(null);
      setCurrentStep('overview');
    }
  }, [selectedCycleId]);

  useEffect(() => {
    if (selectedCycleId) {
      loadReviewData();
    }
  }, [selectedCycleId, loadReviewData]);

  const handleCycleSelect = (cycleId: string) => {
    setSelectedCycleId(cycleId);
  };

  const handleSelfReviewSubmit = async () => {
    if (!review || !selectedCycleId) return;
    
    const submission: ReviewSubmission = {
      id: `submission-${Date.now()}`,
      cycleId: review.cycleId,
      revieweeId: review.employeeId,
      revieweeName: review.employeeName,
      reviewerId: review.employeeId,
      reviewerName: review.employeeName,
      reviewerType: 'SELF',
      answers: Object.entries(selfReviewAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };

    setReview({
      ...review,
      selfReview: submission,
      status: review.managerReview ? 'COMPLETED' : 'IN_PROGRESS',
    });
    
    setCurrentStep('overview');
  };

  const handlePeerReviewSubmit = async (assignment: PeerReviewAssignment) => {
    if (!review || !selectedCycleId) return;
    
    const answers = Object.entries(peerReviewAnswers[assignment.id] || {}).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    await review180360Service.submitPeerReview(
      selectedCycleId,
      review.employeeId,
      assignment.revieweeId,
      answers
    );

    setPeerAssignments(prev => 
      prev.map(a => 
        a.id === assignment.id ? { ...a, status: 'COMPLETED' } : a
      )
    );
    
    setCurrentStep('overview');
    setSelectedPeerId(null);
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando ciclos...</p>
        </div>
      </ModuleLayout>
    );
  }

  if (currentStep === 'cycles') {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="space-y-6">
          <PageHeader
            title="Avaliação 180/360"
            subtitle="Selecione um ciclo para visualizar ou realizar avaliações"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cycles.map((cycle) => (
              <Card
                key={cycle.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleCycleSelect(cycle.id)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{cycle.name}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        cycle.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : cycle.status === 'ACTIVE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {cycle.status === 'COMPLETED' ? 'Finalizado' : cycle.status === 'ACTIVE' ? 'Em Andamento' : 'Rascunho'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Período:</span>{' '}
                      {format(new Date(cycle.startDate), 'dd/MM/yyyy')} - {format(new Date(cycle.endDate), 'dd/MM/yyyy')}
                    </p>
                    <p>
                      <span className="font-medium">Progresso:</span> {cycle.progress}%
                    </p>
                    <p>
                      <span className="font-medium">Participantes:</span> {cycle.participantsCount}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button variant="primary" className="w-full">
                      {cycle.status === 'COMPLETED' ? 'Ver Resultados' : 'Acessar Avaliação'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ModuleLayout>
    );
  }

  if (!review) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setCurrentStep('cycles')}>
              ← Voltar aos Ciclos
            </Button>
            <PageHeader
              title="Avaliação 180/360"
              subtitle="Nenhuma avaliação encontrada para este ciclo"
            />
          </div>
        </div>
      </ModuleLayout>
    );
  }

  const selectedCycle = cycles.find(c => c.id === selectedCycleId);
  const isCompleted = review.status === 'COMPLETED' || selectedCycle?.status === 'COMPLETED';

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setCurrentStep('cycles')}>
            ← Voltar aos Ciclos
          </Button>
          <PageHeader
            title={`Avaliação ${review.reviewType}° - ${selectedCycle?.name || ''}`}
            subtitle={
              isCompleted
                ? 'Visualize os resultados e resumo da avaliação finalizada'
                : `Complete sua avaliação ${review.reviewType}° para o ciclo atual`
            }
          />
        </div>

        {isCompleted && review.finalReport && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📊</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Resultados da Avaliação</h3>
                  <p className="text-sm text-gray-600">Ciclo {selectedCycle?.name} - Finalizado</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Avaliação Geral</p>
                  <p className="text-3xl font-bold text-blue-600">{review.finalReport.overallRating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">de 5.0</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tipo de Avaliação</p>
                  <p className="text-xl font-semibold text-gray-900">{review.reviewType}°</p>
                  <p className="text-xs text-gray-500">
                    {review.reviewType === '180' ? 'Autoavaliação + Gestor' : 'Autoavaliação + Gestor + Pares'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Cargo no Ciclo</p>
                  <p className="text-xl font-semibold text-gray-900">{review.employeePosition}</p>
                  <p className="text-xs text-gray-500">Não era Senior</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🤖</span> Resumo Gerado por IA
                </h4>
                <p className="text-gray-700 leading-relaxed">{review.finalReport.aiSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-5 rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span>✅</span> Pontos Fortes
                  </h4>
                  <ul className="space-y-2">
                    {review.finalReport.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                    <span>📈</span> Áreas de Desenvolvimento
                  </h4>
                  <ul className="space-y-2">
                    {review.finalReport.areasForImprovement.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <span>💡</span> Recomendações
                </h4>
                <ul className="space-y-2">
                  {review.finalReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {review.finalReport.managerFeedback && (
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span>👔</span> Feedback do Gestor
                  </h4>
                  <p className="text-blue-800 leading-relaxed">{review.finalReport.managerFeedback}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/people-cycles/review-report?cycleId=${selectedCycleId}`)}
                >
                  Ver Relatório Completo
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!isCompleted && currentStep === 'overview' && (
          <>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Avaliação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">👤</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Autoavaliação</p>
                        <p className="text-sm text-gray-500">Sua própria avaliação</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          review.selfReview
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {review.selfReview ? 'Concluído' : 'Pendente'}
                      </span>
                      {!review.selfReview && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setCurrentStep('self')}
                        >
                          Iniciar Autoavaliação
                        </Button>
                      )}
                    </div>
                  </div>

                  {review.reviewType === '360' && peerAssignments.length > 0 && (
                    <>
                      <div className="mt-6 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Pessoas Indicadas pelo Gestor para Avaliar
                        </h4>
                        <p className="text-sm text-gray-600">
                          Seu gestor indicou as seguintes pessoas para você avaliar neste ciclo 360°
                        </p>
                      </div>
                      {peerAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold">🤝</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{assignment.revieweeName}</p>
                              <p className="text-sm text-gray-500">
                                {assignment.revieweePosition} • Indicado por {assignment.assignedBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                assignment.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {assignment.status === 'COMPLETED' ? 'Concluído' : 'Pendente'}
                            </span>
                            {assignment.status !== 'COMPLETED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPeerId(assignment.id);
                                  setCurrentStep('peer');
                                }}
                              >
                                Avaliar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}

        {!isCompleted && currentStep === 'self' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Autoavaliação</h3>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep('overview')}>
                  Voltar
                </Button>
              </div>
              <div className="space-y-6">
                {mockQuestions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                      value={selfReviewAnswers[question.id] || ''}
                      onChange={(e) =>
                        setSelfReviewAnswers({
                          ...selfReviewAnswers,
                          [question.id]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      required={question.required}
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setCurrentStep('overview')}>
                    Salvar Rascunho
                  </Button>
                  <Button variant="primary" onClick={handleSelfReviewSubmit}>
                    Submeter Autoavaliação
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!isCompleted && currentStep === 'peer' && selectedPeerId && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Avaliar: {peerAssignments.find(a => a.id === selectedPeerId)?.revieweeName}
                </h3>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep('overview')}>
                  Voltar
                </Button>
              </div>
              <div className="space-y-6">
                {mockQuestions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                      value={peerReviewAnswers[selectedPeerId]?.[question.id] || ''}
                      onChange={(e) =>
                        setPeerReviewAnswers({
                          ...peerReviewAnswers,
                          [selectedPeerId]: {
                            ...peerReviewAnswers[selectedPeerId],
                            [question.id]: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      required={question.required}
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setCurrentStep('overview')}>
                    Salvar Rascunho
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      const assignment = peerAssignments.find(a => a.id === selectedPeerId);
                      if (assignment) {
                        handlePeerReviewSubmit(assignment);
                      }
                    }}
                  >
                    Submeter Avaliação
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

export default Review180360;
