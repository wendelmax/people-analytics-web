import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { payrollManagementService } from '../../../services/payrollManagementService';
import { PayrollCycle, DepartmentPayrollSummary } from '../../../types/payroll';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';

export const PayrollManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<PayrollCycle[]>([]);
  const [currentCycleDepartments, setCurrentCycleDepartments] = useState<DepartmentPayrollSummary[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const cyclesData = await payrollManagementService.getAllCycles();
      setCycles(cyclesData);

      // Carregar departamentos do ciclo atual (primeiro da lista)
      if (cyclesData.length > 0) {
        const depts = await payrollManagementService.getDepartmentSummary(cyclesData[0].id);
        setCurrentCycleDepartments(depts);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados de folha');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      DRAFT: { variant: 'outline', label: 'Rascunho' },
      CALCULATING: { variant: 'info', label: 'Calculando' },
      CALCULATED: { variant: 'info', label: 'Calculado' },
      PENDING_APPROVAL: { variant: 'warning', label: 'Aguardando Aprovação' },
      APPROVED: { variant: 'success', label: 'Aprovado' },
      PROCESSING: { variant: 'info', label: 'Processando' },
      PROCESSED: { variant: 'success', label: 'Processado' },
      PAID: { variant: 'success', label: 'Pago' },
      CLOSED: { variant: 'outline', label: 'Fechado' },
    };
    const config = statusMap[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleQuickAction = async (cycleId: string, action: string) => {
    try {
      switch (action) {
        case 'calculate':
          await payrollManagementService.calculateCycle(cycleId);
          toast.success('Folha calculada com sucesso!');
          break;
        case 'approve':
          await payrollManagementService.approveCycle(cycleId, {});
          toast.success('Folha aprovada com sucesso!');
          break;
        case 'process':
          await payrollManagementService.processCycle(cycleId);
          toast.success('Folha processada com sucesso!');
          break;
        case 'notify-finance':
          await payrollManagementService.notifyFinance(cycleId, {});
          toast.success('Financeiro notificado!');
          break;
      }
      loadData();
    } catch (error) {
      toast.error('Erro ao executar ação');
      console.error(error);
    }
  };

  const currentCycle = cycles[0];

  if (loading) {
    return (
      <ModuleLayout moduleId="payroll">
        <div className="space-y-6">
          <PageHeader title="Folha de Pagamento" subtitle="Carregando..." />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="payroll">
      <div className="space-y-6">
        <PageHeader
          title="Gestão de Folha de Pagamento"
          subtitle="Processamento, aprovações e relatórios"
          actions={[
            {
              label: '➕ Novo Ciclo',
              onClick: () => {}, // TODO: Modal de criar ciclo
              variant: 'primary',
            },
          ]}
        />

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardTile
            title="Folha Atual"
            icon="💵"
            description={currentCycle ? formatCurrency(currentCycle.totalNet) : 'N/A'}
            status="open"
            subtitle={currentCycle?.referenceMonth}
          />
          <DashboardTile
            title="Total Funcionários"
            icon="👥"
            count={currentCycle?.totalEmployees || 0}
            description="Colaboradores ativos"
            status="open"
          />
          <DashboardTile
            title="Encargos Totais"
            icon="📊"
            description={currentCycle ? formatCurrency(currentCycle.totalDeductions) : 'N/A'}
            status="open"
          />
          <DashboardTile
            title="Status"
            icon="⚙️"
            description={currentCycle?.status || 'Nenhum ciclo'}
            status={currentCycle?.status === 'PENDING_APPROVAL' ? 'pending' : 'open'}
          />
        </div>

        {/* Ciclo Atual - Ações Rápidas */}
        {currentCycle && (
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Folha de {new Date(currentCycle.referenceMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Data de Pagamento: {formatDate(currentCycle.paymentDate || '')}
                  </p>
                </div>
                {getStatusBadge(currentCycle.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Bruto</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentCycle.totalGross)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Descontos</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(currentCycle.totalDeductions)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Líquido</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(currentCycle.totalNet)}</p>
                </div>
              </div>

              {/* Ações do Ciclo */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {currentCycle.status === 'DRAFT' && (
                  <Button onClick={() => handleQuickAction(currentCycle.id, 'calculate')}>
                    ⚙️ Calcular Folha
                  </Button>
                )}
                {currentCycle.status === 'CALCULATED' && (
                  <>
                    <Button onClick={() => handleQuickAction(currentCycle.id, 'approve')} variant="primary">
                      ✅ Aprovar Folha
                    </Button>
                    <Button variant="outline">📋 Revisar Detalhes</Button>
                  </>
                )}
                {currentCycle.status === 'PENDING_APPROVAL' && (
                  <>
                    <Button onClick={() => handleQuickAction(currentCycle.id, 'approve')} variant="primary">
                      ✅ Aprovar Folha
                    </Button>
                    <Button variant="outline">👁️ Ver Aprovações</Button>
                  </>
                )}
                {currentCycle.status === 'APPROVED' && (
                  <>
                    <Button onClick={() => handleQuickAction(currentCycle.id, 'process')} variant="primary">
                      💳 Processar Pagamento
                    </Button>
                    <Button onClick={() => handleQuickAction(currentCycle.id, 'notify-finance')} variant="outline">
                      📧 Notificar Financeiro
                    </Button>
                  </>
                )}
                {(currentCycle.status === 'PROCESSED' || currentCycle.status === 'PAID') && (
                  <>
                    <Button variant="outline">📄 Gerar Relatórios</Button>
                    <Button variant="outline">📤 Enviar para Contabilidade</Button>
                  </>
                )}
              </div>

              {currentCycle.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800"><strong>Observações:</strong> {currentCycle.notes}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Resumo por Departamento */}
        {currentCycleDepartments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Departamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentCycleDepartments.map((dept) => (
                <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{dept.departmentName}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Funcionários:</span>
                        <span className="font-medium">{dept.employeeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Bruto:</span>
                        <span className="font-medium">{formatCurrency(dept.totalGross)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600 font-medium">Total Líquido:</span>
                        <span className="font-bold text-green-600">{formatCurrency(dept.totalNet)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Histórico de Ciclos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Ciclos</h3>
            <Button variant="outline" size="sm">Ver Todos</Button>
          </div>

          <div className="space-y-3">
            {cycles.slice(0, 5).map((cycle) => (
              <Card key={cycle.id} className="hover:shadow-md transition-shadow">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {new Date(cycle.referenceMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                      </h4>
                      {getStatusBadge(cycle.status)}
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>{cycle.totalEmployees} funcionários</span>
                      <span>Líquido: {formatCurrency(cycle.totalNet)}</span>
                      {cycle.paidAt && <span>Pago em: {formatDate(cycle.paidAt)}</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {cycles.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">Nenhum ciclo de folha encontrado.</p>
            <Button>Criar Primeiro Ciclo</Button>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

