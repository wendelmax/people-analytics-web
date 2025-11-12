import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useAuth } from '../../../contexts/AuthContext';
import { useEmployeeSelfService } from '../../../hooks/useEmployeeSelfService';
import { PayslipModal } from '../../../components/payroll/PayslipModal';
import { Payroll } from '../../../types';

export const EmployeeSelfService: React.FC = () => {
  const { user } = useAuth();
  const {
    profile,
    leaves,
    attendanceSummary,
    policies,
    acknowledgments,
    payrolls,
    loading,
    requestDocument,
    acknowledgePolicy
  } = useEmployeeSelfService();

  const [activeTab, setActiveTab] = useState('profile');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  const pendingPolicies = (policies || []).filter(policy =>
    !acknowledgments.some(ack => ack.policyId === policy.id)
  );

  const tabs = [
    { id: 'profile', label: 'Perfil' },
    { id: 'documents', label: 'Holerites e Documentos' },
    { id: 'leaves', label: 'Licenças' },
    { id: 'attendance', label: 'Presença' },
    {
      id: 'policies',
      label: `Políticas ${pendingPolicies.length > 0 ? `(${pendingPolicies.length})` : ''}`,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.name || user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.email || user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.phone || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.address || 'Não informado'}</p>
                </div>
              </div>
              <Button variant="outline">Editar Informações</Button>
            </div>
          </Card>
        );

      case 'documents':
        return (
          <Card>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Meus Documentos Financeiros</h3>
                <select 
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Líquido</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponível em</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payrolls
                      .filter(p => p.period.startsWith(String(selectedYear)))
                      .map((payroll) => (
                      <tr key={payroll.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {new Date(payroll.period + '-02').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payroll.items.some(i => i.name.includes('13º')) ? 
                            <Badge variant="warning">13º Salário</Badge> : 
                           payroll.items.some(i => i.name.includes('PLR')) ? 
                            <Badge variant="success">PLR / Bônus</Badge> : 
                            <Badge variant="outline">Folha Mensal</Badge>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                          {formatCurrency(payroll.netSalary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payroll.paidAt || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setSelectedPayroll(payroll)}
                            title="Visualizar Holerite"
                          >
                            👁️ Visualizar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payrolls.filter(p => p.period.startsWith(String(selectedYear))).length === 0 && (
                  <div className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500">Nenhum documento encontrado para {selectedYear}.</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6 mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Solicitações e Declarações</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 border-dashed"
                    onClick={() => requestDocument('declaration')}
                  >
                    <span className="text-xl">📝</span>
                    <span className="text-xs font-medium">Declaração de Vínculo</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 border-dashed"
                    onClick={() => requestDocument('certificate')}
                  >
                    <span className="text-xl">🏥</span>
                    <span className="text-xs font-medium">Enviar Atestado</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 border-dashed"
                    onClick={() => requestDocument('income_report')}
                  >
                    <span className="text-xl">🦁</span>
                    <span className="text-xs font-medium">Informe de Rendimentos</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );

      case 'leaves':
        return (
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Minhas Licenças</h3>
                <Button>Solicitar Nova Licença</Button>
              </div>
              <div className="space-y-4">
                {leaves.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma licença registrada.</p>
                ) : (
                  leaves.map((leave) => (
                    <div key={leave.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{leave.type}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </p>
                      </div>
                      <Badge variant={leave.status === 'APPROVED' ? 'success' : 'secondary'}>
                        {leave.status === 'APPROVED' ? 'Aprovado' : 
                         leave.status === 'PENDING' ? 'Pendente' : leave.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        );

      case 'attendance':
        return (
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Resumo de Presença</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">{attendanceSummary?.presentDays || 0}</div>
                  <div className="text-sm font-medium text-green-800">Dias Presentes</div>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{attendanceSummary?.absentDays || 0}</div>
                  <div className="text-sm font-medium text-yellow-800">Dias Ausentes</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{attendanceSummary?.lateDays || 0}</div>
                  <div className="text-sm font-medium text-blue-800">Atrasos</div>
                </div>
              </div>
            </div>
          </Card>
        );

      case 'policies':
        return (
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Políticas da Empresa</h3>

              {pendingPolicies.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 flex items-center gap-2">
                    ⚠️ Políticas Pendentes de Aceite
                  </h4>
                  <div className="mt-3 space-y-2">
                    {pendingPolicies.map((policy) => (
                      <div key={policy.id} className="flex justify-between items-center bg-white p-3 rounded border border-yellow-100 shadow-sm">
                        <span className="text-sm font-medium text-gray-700">{policy.title}</span>
                        <Button
                          size="sm"
                          onClick={() => acknowledgePolicy(policy.id)}
                        >
                          Ler e Aceitar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Histórico de Aceites</h4>
                {acknowledgments.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma política aceita ainda.</p>
                ) : (
                  acknowledgments.map((ack) => (
                    <div key={ack.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{ack.policyTitle}</p>
                        <p className="text-sm text-gray-500">Aceito em {formatDate(ack.acknowledgedAt)}</p>
                      </div>
                      <Badge variant="success">Aceito</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="employees">
        <div className="space-y-6">
          <PageHeader
            title="Self Service"
            subtitle="Portal do funcionário"
          />
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="employees">
      <div className="space-y-6">
        <PageHeader
          title="Self Service"
          subtitle="Gerencie seus dados e solicitações"
        />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>

        {/* Modals */}
        {selectedPayroll && (
          <PayslipModal 
            payroll={selectedPayroll} 
            onClose={() => setSelectedPayroll(null)} 
          />
        )}
      </div>
    </ModuleLayout>
  );
};
