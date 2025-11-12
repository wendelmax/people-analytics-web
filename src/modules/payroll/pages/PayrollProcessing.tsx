import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { Modal } from '../../../components/common/Modal';
import { payrollManagementService } from '../../../services/payrollManagementService';
import { PayrollCycle, DepartmentPayrollSummary, EmployeePayrollDetail } from '../../../types/payroll';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';

export const PayrollProcessing: React.FC = () => {
  const navigate = useNavigate();
  const { cycleId } = useParams<{ cycleId?: string }>();
  const toast = useToastContext();
  
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<PayrollCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<PayrollCycle | null>(null);
  const [departments, setDepartments] = useState<DepartmentPayrollSummary[]>([]);
  const [employees, setEmployees] = useState<EmployeePayrollDetail[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCycleData, setNewCycleData] = useState({
    referenceMonth: '',
    paymentDate: '',
    notes: '',
  });

  useEffect(() => {
    loadCycles();
  }, []);

  useEffect(() => {
    if (cycleId) {
      loadCycleDetails(cycleId);
    } else if (selectedCycle) {
      loadCycleDetails(selectedCycle.id);
    }
  }, [cycleId, selectedCycle]);

  const loadCycles = async () => {
    try {
      setLoading(true);
      const data = await payrollManagementService.getAllCycles();
      setCycles(data);
      if (cycleId) {
        const cycle = data.find(c => c.id === cycleId);
        if (cycle) setSelectedCycle(cycle);
      } else if (data.length > 0) {
        setSelectedCycle(data[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar ciclos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCycleDetails = async (id: string) => {
    try {
      const [deptsData, employeesData] = await Promise.all([
        payrollManagementService.getDepartmentSummary(id),
        payrollManagementService.getEmployeeDetails(id),
      ]);
      setDepartments(deptsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  const handleCreateCycle = async () => {
    try {
      await payrollManagementService.createCycle(newCycleData);
      toast.success('Ciclo criado com sucesso!');
      setShowCreateModal(false);
      setNewCycleData({ referenceMonth: '', paymentDate: '', notes: '' });
      loadCycles();
    } catch (error) {
      toast.error('Erro ao criar ciclo');
      console.error(error);
    }
  };

  const handleCalculate = async () => {
    if (!selectedCycle) return;
    try {
      await payrollManagementService.calculateCycle(selectedCycle.id);
      toast.success('Folha calculada com sucesso!');
      loadCycles();
    } catch (error) {
      toast.error('Erro ao calcular folha');
      console.error(error);
    }
  };

  const handleApprove = async () => {
    if (!selectedCycle) return;
    try {
      await payrollManagementService.approveCycle(selectedCycle.id, {});
      toast.success('Folha aprovada com sucesso!');
      loadCycles();
    } catch (error) {
      toast.error('Erro ao aprovar folha');
      console.error(error);
    }
  };

  const handleProcess = async () => {
    if (!selectedCycle) return;
    try {
      await payrollManagementService.processCycle(selectedCycle.id);
      toast.success('Folha processada com sucesso!');
      loadCycles();
    } catch (error) {
      toast.error('Erro ao processar folha');
      console.error(error);
    }
  };

  const handleNotifyFinance = async () => {
    if (!selectedCycle) return;
    try {
      await payrollManagementService.notifyFinance(selectedCycle.id, {});
      toast.success('Financeiro notificado!');
    } catch (error) {
      toast.error('Erro ao notificar financeiro');
      console.error(error);
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

  if (loading) {
    return (
      <ModuleLayout moduleId="payroll">
        <div className="space-y-6">
          <PageHeader title="Processamento de Folha" subtitle="Carregando..." />
          <SkeletonCard />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="payroll">
      <div className="space-y-6">
        <PageHeader
          title="Processamento de Folha"
          subtitle="Calcule, revise e processe a folha de pagamento"
          actions={[
            {
              label: '➕ Novo Ciclo',
              onClick: () => setShowCreateModal(true),
              variant: 'primary',
            },
          ]}
        />

        {/* Seletor de Ciclo */}
        <Card>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Ciclo de Folha
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCycle?.id || ''}
              onChange={(e) => {
                const cycle = cycles.find(c => c.id === e.target.value);
                setSelectedCycle(cycle || null);
                navigate(`/payroll/processing/${e.target.value}`);
              }}
            >
              <option value="">Selecione um ciclo...</option>
              {cycles.map(cycle => (
                <option key={cycle.id} value={cycle.id}>
                  {new Date(cycle.referenceMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} - {cycle.status}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {selectedCycle && (
          <>
            {/* Informações do Ciclo */}
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Folha de {new Date(selectedCycle.referenceMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Data de Pagamento: {formatDate(selectedCycle.paymentDate || '')}
                    </p>
                  </div>
                  {getStatusBadge(selectedCycle.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Funcionários</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCycle.totalEmployees}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Bruto</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedCycle.totalGross)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Descontos</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedCycle.totalDeductions)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Líquido</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCycle.totalNet)}</p>
                  </div>
                </div>

                {/* Ações do Ciclo */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  {selectedCycle.status === 'DRAFT' && (
                    <Button onClick={handleCalculate} variant="primary">
                      ⚙️ Calcular Folha
                    </Button>
                  )}
                  {selectedCycle.status === 'CALCULATED' && (
                    <>
                      <Button onClick={handleApprove} variant="primary">
                        ✅ Aprovar Folha
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/payroll/processing/${selectedCycle.id}/review`)}>
                        📋 Revisar Detalhes
                      </Button>
                    </>
                  )}
                  {selectedCycle.status === 'PENDING_APPROVAL' && (
                    <>
                      <Button onClick={handleApprove} variant="primary">
                        ✅ Aprovar Folha
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/payroll/approvals/${selectedCycle.id}`)}>
                        👁️ Ver Aprovações
                      </Button>
                    </>
                  )}
                  {selectedCycle.status === 'APPROVED' && (
                    <>
                      <Button onClick={handleProcess} variant="primary">
                        💳 Processar Pagamento
                      </Button>
                      <Button onClick={handleNotifyFinance} variant="outline">
                        📧 Notificar Financeiro
                      </Button>
                    </>
                  )}
                  {(selectedCycle.status === 'PROCESSED' || selectedCycle.status === 'PAID') && (
                    <>
                      <Button variant="outline" onClick={() => navigate(`/payroll/reports/${selectedCycle.id}`)}>
                        📄 Gerar Relatórios
                      </Button>
                      <Button variant="outline">
                        📤 Enviar para Contabilidade
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Resumo por Departamento */}
            {departments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Departamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">{dept.departmentName}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Funcionários:</span>
                            <span className="font-medium">{dept.employeeCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Bruto:</span>
                            <span className="font-medium">{formatCurrency(dept.totalGross)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Descontos:</span>
                            <span className="font-medium text-red-600">{formatCurrency(dept.totalDeductions)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="text-gray-900 font-medium">Total Líquido:</span>
                            <span className="font-bold text-green-600">{formatCurrency(dept.totalNet)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Funcionários (Colapsável) */}
            {employees.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detalhamento por Funcionário ({employees.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funcionário</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bruto</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Descontos</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Líquido</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((emp) => (
                          <tr key={emp.employeeId} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {emp.employee?.name || emp.employeeId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {emp.departmentId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {formatCurrency(emp.grossSalary)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600">
                              {formatCurrency(emp.totalDeductions)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-green-600">
                              {formatCurrency(emp.netSalary)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <Badge variant={emp.status === 'PAID' ? 'success' : 'info'}>
                                {emp.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {!selectedCycle && cycles.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">Nenhum ciclo de folha encontrado.</p>
            <Button onClick={() => setShowCreateModal(true)}>Criar Primeiro Ciclo</Button>
          </Card>
        )}
      </div>

      {/* Modal de Criar Ciclo */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setNewCycleData({ referenceMonth: '', paymentDate: '', notes: '' });
          }}
          title="Criar Novo Ciclo de Folha"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mês de Referência *
              </label>
              <input
                type="month"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCycleData.referenceMonth}
                onChange={(e) => setNewCycleData({ ...newCycleData, referenceMonth: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Pagamento *
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCycleData.paymentDate}
                onChange={(e) => setNewCycleData({ ...newCycleData, paymentDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={newCycleData.notes}
                onChange={(e) => setNewCycleData({ ...newCycleData, notes: e.target.value })}
                placeholder="Ex: Inclui 13º salário, bônus de performance..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCycleData({ referenceMonth: '', paymentDate: '', notes: '' });
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleCreateCycle}
                disabled={!newCycleData.referenceMonth || !newCycleData.paymentDate}
              >
                Criar Ciclo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ModuleLayout>
  );
};

