import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { Modal } from '../../../components/common/Modal';
import { benefitsService, Benefit, Enrollment, Dependent } from '../../../services/benefitsService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';

export const MyBenefitsDashboard: React.FC = () => {
  const toast = useToastContext();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'available'>('active');
  const [allBenefits, setAllBenefits] = useState<Benefit[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDependentsModal, setShowDependentsModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [expandedEnrollmentId, setExpandedEnrollmentId] = useState<string | null>(null);
  const [newDependent, setNewDependent] = useState<Partial<Dependent>>({
    name: '',
    relationship: 'CHILD',
    birthDate: '',
    cpf: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [benefits, enrollments] = await Promise.all([
        benefitsService.getAll(),
        benefitsService.getMyEnrollments(),
      ]);
      setAllBenefits(benefits);
      setMyEnrollments(enrollments);
    } catch (error) {
      toast.error('Erro ao carregar benefícios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedBenefit) return;

    try {
      await benefitsService.enroll({
        benefitId: selectedBenefit.id,
        effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      toast.success(`Solicitação de ${selectedBenefit.name} realizada com sucesso!`);
      setShowEnrollModal(false);
      setSelectedBenefit(null);
      loadData();
    } catch (error) {
      toast.error('Erro ao solicitar benefício');
      console.error(error);
    }
  };

  const handleCancelEnrollment = async (enrollmentId: string) => {
    if (!confirm('Deseja realmente cancelar este benefício?')) return;

    try {
      await benefitsService.cancelEnrollment(enrollmentId);
      toast.success('Benefício cancelado com sucesso');
      loadData();
    } catch (error) {
      toast.error('Erro ao cancelar benefício');
      console.error(error);
    }
  };

  const handleAddDependent = async () => {
    if (!selectedEnrollment || !newDependent.name || !newDependent.birthDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await benefitsService.addDependent(selectedEnrollment.id, newDependent as Omit<Dependent, 'id'>);
      toast.success('Dependente adicionado com sucesso!');
      setShowDependentsModal(false);
      setNewDependent({ name: '', relationship: 'CHILD', birthDate: '', cpf: '' });
      loadData();
    } catch (error) {
      toast.error('Erro ao adicionar dependente');
      console.error(error);
    }
  };

  const handleRemoveDependent = async (enrollmentId: string, dependentId: string) => {
    if (!confirm('Deseja remover este dependente?')) return;

    try {
      await benefitsService.removeDependent(enrollmentId, dependentId);
      toast.success('Dependente removido');
      loadData();
    } catch (error) {
      toast.error('Erro ao remover dependente');
      console.error(error);
    }
  };

  const availableBenefits = allBenefits.filter(
    (b) => !myEnrollments.find((e) => e.benefitId === b.id && e.status === 'ACTIVE')
  );

  const totalMonthlyCost = myEnrollments
    .filter((e) => e.status === 'ACTIVE')
    .reduce((sum, enrollment) => {
      const benefit = allBenefits.find((b) => b.id === enrollment.benefitId);
      return sum + (benefit?.employeeCost || 0);
    }, 0);

  return (
    <ModuleLayout moduleId="benefits">
      <div className="space-y-6">
        <PageHeader
          title="Meus Benefícios"
          subtitle="Gerencie seus benefícios e dependentes"
        />

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonCard />
          </div>
        ) : (
          <>
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Custo Mensal</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyCost)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    💎
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Benefícios Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myEnrollments.filter((e) => e.status === 'ACTIVE').length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Disponíveis</p>
                    <p className="text-2xl font-bold text-gray-900">{availableBenefits.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === 'active'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  💎 Meus Benefícios Ativos
                </button>
                <button
                  onClick={() => setActiveTab('available')}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === 'available'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  📝 Benefícios Disponíveis ({availableBenefits.length})
                </button>
              </nav>
            </div>

            {/* Benefícios Ativos */}
            {activeTab === 'active' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meus Planos Ativos</h3>
              {myEnrollments.filter((e) => e.status === 'ACTIVE').length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">Você ainda não possui benefícios ativos.</p>
                  <p className="text-sm text-gray-400 mt-2">Confira os benefícios disponíveis abaixo!</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myEnrollments
                    .filter((e) => e.status === 'ACTIVE')
                    .map((enrollment) => {
                      const benefit = allBenefits.find((b) => b.id === enrollment.benefitId);
                      if (!benefit) return null;

                      const isExpanded = expandedEnrollmentId === enrollment.id;

                      return (
                        <Card 
                          key={enrollment.id} 
                          className="hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => setExpandedEnrollmentId(isExpanded ? null : enrollment.id)}
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-900 text-lg">{benefit.name}</h4>
                                  <span className="text-gray-400 transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    ▼
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">{benefit.category}</p>
                              </div>
                              <Badge variant="success">Ativo</Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">{benefit.description}</p>

                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Seu custo mensal</span>
                                <span className="font-bold text-gray-900">
                                  {formatCurrency(benefit.employeeCost || 0)}
                                </span>
                              </div>
                            </div>

                            {/* Detalhes Expandidos */}
                            {isExpanded && (
                              <div className="border-t pt-4 mb-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">Data de início:</span>
                                    <p className="font-medium text-gray-900">{formatDate(enrollment.effectiveDate)}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Inscrito em:</span>
                                    <p className="font-medium text-gray-900">{formatDate(enrollment.enrolledAt)}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">Cobertura</p>
                                  <p className="text-sm text-gray-800">{benefit.coverage}</p>
                                </div>

                                {benefit.cost && (
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Custo total (empresa):</span>
                                    <span className="font-medium text-gray-700">{formatCurrency(benefit.cost)}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Dependentes */}
                            {benefit.allowsDependents && (
                              <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-medium text-gray-700">
                                    Dependentes ({enrollment.dependents?.length || 0})
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEnrollment(enrollment);
                                      setShowDependentsModal(true);
                                    }}
                                  >
                                    ➕ Adicionar
                                  </Button>
                                </div>

                                {enrollment.dependents && enrollment.dependents.length > 0 && (
                                  <div className="space-y-2">
                                    {enrollment.dependents.map((dep) => (
                                      <div
                                        key={dep.id}
                                        className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                                      >
                                        <div>
                                          <span className="font-medium">{dep.name}</span>
                                          <span className="text-gray-500 ml-2">
                                            ({dep.relationship === 'SPOUSE' ? 'Cônjuge' : dep.relationship === 'CHILD' ? 'Filho(a)' : 'Outro'})
                                          </span>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveDependent(enrollment.id, dep.id);
                                          }}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2 mt-4 pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelEnrollment(enrollment.id);
                                }}
                                className="text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                Cancelar Benefício
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              )}
            </div>
            )}

            {/* Benefícios Disponíveis */}
            {activeTab === 'available' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Benefícios Disponíveis</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Solicite novos benefícios para você e seus dependentes
                  </p>
                </div>

                {availableBenefits.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">Você já está inscrito em todos os benefícios disponíveis! 🎉</p>
                  </Card>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableBenefits.map((benefit) => (
                    <Card key={benefit.id} className="hover:shadow-lg transition-all">
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">{benefit.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{benefit.description}</p>

                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Custo para você</span>
                            <span className="font-bold text-blue-600">
                              {formatCurrency(benefit.employeeCost || 0)}/mês
                            </span>
                          </div>
                        </div>

                        {benefit.allowsDependents && (
                          <p className="text-xs text-green-600 mb-3">✓ Extensível para dependentes</p>
                        )}

                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedBenefit(benefit);
                            setShowEnrollModal(true);
                          }}
                        >
                          Solicitar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Solicitação */}
      {showEnrollModal && selectedBenefit && (
        <Modal
          isOpen={showEnrollModal}
          onClose={() => {
            setShowEnrollModal(false);
            setSelectedBenefit(null);
          }}
          title="Solicitar Benefício"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{selectedBenefit.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedBenefit.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Custo mensal para você:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(selectedBenefit.employeeCost || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data de vigência:</span>
                <span className="font-medium text-gray-700">
                  {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                </span>
              </div>
            </div>

            {selectedBenefit.allowsDependents && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  ℹ️ Este benefício pode ser estendido para dependentes após a ativação.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedBenefit(null);
                }}
              >
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleEnroll}>
                Confirmar Solicitação
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Adicionar Dependente */}
      {showDependentsModal && selectedEnrollment && (
        <Modal
          isOpen={showDependentsModal}
          onClose={() => {
            setShowDependentsModal(false);
            setSelectedEnrollment(null);
            setNewDependent({ name: '', relationship: 'CHILD', birthDate: '', cpf: '' });
          }}
          title="Adicionar Dependente"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDependent.name}
                onChange={(e) => setNewDependent({ ...newDependent, name: e.target.value })}
                placeholder="Nome do dependente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parentesco *
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDependent.relationship}
                onChange={(e) =>
                  setNewDependent({ ...newDependent, relationship: e.target.value as any })
                }
              >
                <option value="SPOUSE">Cônjuge</option>
                <option value="CHILD">Filho(a)</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDependent.birthDate}
                onChange={(e) => setNewDependent({ ...newDependent, birthDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF (opcional)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDependent.cpf}
                onChange={(e) => setNewDependent({ ...newDependent, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDependentsModal(false);
                  setSelectedEnrollment(null);
                  setNewDependent({ name: '', relationship: 'CHILD', birthDate: '', cpf: '' });
                }}
              >
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleAddDependent}>
                Adicionar Dependente
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ModuleLayout>
  );
};

