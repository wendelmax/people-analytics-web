import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { Modal } from '../../../components/common/Modal';
import { payrollManagementService } from '../../../services/payrollManagementService';
import { PayrollCycle, PayrollApproval } from '../../../types/payroll';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';

export const PayrollApprovals: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastContext();
  
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<PayrollCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<PayrollCycle | null>(null);
  const [approvals, setApprovals] = useState<PayrollApproval[]>([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCycle) {
      loadApprovals(selectedCycle.id);
    }
  }, [selectedCycle]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await payrollManagementService.getAllCycles();
      // Filtrar apenas ciclos que precisam de aprovação
      const pendingCycles = data.filter(c => 
        c.status === 'PENDING_APPROVAL' || c.status === 'CALCULATED'
      );
      setCycles(pendingCycles);
      if (pendingCycles.length > 0) {
        setSelectedCycle(pendingCycles[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar ciclos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadApprovals = async (cycleId: string) => {
    try {
      const data = await payrollManagementService.getApprovals(cycleId);
      setApprovals(data);
    } catch (error) {
      console.error('Erro ao carregar aprovações:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedCycle) return;
    try {
      await payrollManagementService.approveCycle(selectedCycle.id, {
        comments: approvalComments,
      });
      toast.success('Folha aprovada com sucesso!');
      setShowApproveModal(false);
      setApprovalComments('');
      loadData();
    } catch (error) {
      toast.error('Erro ao aprovar folha');
      console.error(error);
    }
  };

  const handleRequestApproval = async (approverId: string) => {
    if (!selectedCycle) return;
    try {
      await payrollManagementService.requestApproval(selectedCycle.id, approverId);
      toast.success('Solicitação de aprovação enviada!');
      loadApprovals(selectedCycle.id);
    } catch (error) {
      toast.error('Erro ao solicitar aprovação');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="payroll">
        <div className="space-y-6">
          <PageHeader title="Aprovações de Folha" subtitle="Carregando..." />
          <SkeletonCard />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="payroll">
      <div className="space-y-6">
        <PageHeader
          title="Aprovações de Folha"
          subtitle="Aprove ou solicite aprovação para ciclos de folha"
        />

        {cycles.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">Nenhum ciclo aguardando aprovação.</p>
            <Button onClick={() => navigate('/payroll/processing')}>
              Ir para Processamento
            </Button>
          </Card>
        ) : (
          <>
            {/* Lista de Ciclos Pendentes */}
            <div className="space-y-4">
              {cycles.map((cycle) => (
                <Card 
                  key={cycle.id} 
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedCycle?.id === cycle.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCycle(cycle)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            Folha de {new Date(cycle.referenceMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                          </h3>
                          <Badge variant={cycle.status === 'PENDING_APPROVAL' ? 'warning' : 'info'}>
                            {cycle.status === 'PENDING_APPROVAL' ? 'Aguardando Aprovação' : 'Calculado'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Funcionários:</span>
                            <p className="font-medium">{cycle.totalEmployees}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Bruto:</span>
                            <p className="font-medium">{formatCurrency(cycle.totalGross)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Descontos:</span>
                            <p className="font-medium text-red-600">{formatCurrency(cycle.totalDeductions)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Líquido:</span>
                            <p className="font-bold text-green-600">{formatCurrency(cycle.totalNet)}</p>
                          </div>
                        </div>
                        {cycle.calculatedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Calculado em: {formatDate(cycle.calculatedAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCycle(cycle);
                            setShowApproveModal(true);
                          }}
                        >
                          ✅ Aprovar
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payroll/processing/${cycle.id}`);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Histórico de Aprovações do Ciclo Selecionado */}
            {selectedCycle && approvals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Histórico de Aprovações
                </h3>
                <Card>
                  <div className="p-6">
                    <div className="space-y-4">
                      {approvals.map((approval) => (
                        <div key={approval.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {approval.approver?.name || `Aprovador ${approval.approverId}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(approval.createdAt)}
                              </p>
                              {approval.comments && (
                                <p className="text-sm text-gray-600 mt-2">{approval.comments}</p>
                              )}
                            </div>
                            <Badge variant={approval.status === 'APPROVED' ? 'success' : 'warning'}>
                              {approval.status === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Aprovação */}
      {showApproveModal && selectedCycle && (
        <Modal
          isOpen={showApproveModal}
          onClose={() => {
            setShowApproveModal(false);
            setApprovalComments('');
          }}
          title="Aprovar Folha de Pagamento"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                Folha de {new Date(selectedCycle.referenceMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bruto:</span>
                  <span className="font-medium">{formatCurrency(selectedCycle.totalGross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Descontos:</span>
                  <span className="font-medium text-red-600">{formatCurrency(selectedCycle.totalDeductions)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium">Total Líquido:</span>
                  <span className="font-bold text-green-600">{formatCurrency(selectedCycle.totalNet)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentários (opcional)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                placeholder="Adicione observações sobre a aprovação..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowApproveModal(false);
                  setApprovalComments('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleApprove}
              >
                ✅ Aprovar Folha
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ModuleLayout>
  );
};

