import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { Modal } from '../../../components/common/Modal';
import { payrollManagementService } from '../../../services/payrollManagementService';
import { PayrollCycle } from '../../../types/payroll';
import { formatDate } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';

interface Integration {
  id: string;
  name: string;
  type: 'BANK' | 'ACCOUNTING' | 'TAX' | 'HRIS';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSync?: string;
  description: string;
  icon: string;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Banco do Brasil',
    type: 'BANK',
    status: 'CONNECTED',
    lastSync: '2025-12-20T10:00:00Z',
    description: 'Integração para envio de arquivo de remessa bancária',
    icon: '🏦',
  },
  {
    id: '2',
    name: 'Contábil Online',
    type: 'ACCOUNTING',
    status: 'CONNECTED',
    lastSync: '2025-12-20T09:30:00Z',
    description: 'Sistema de contabilidade integrado',
    icon: '📊',
  },
  {
    id: '3',
    name: 'Receita Federal - eSocial',
    type: 'TAX',
    status: 'CONNECTED',
    lastSync: '2025-12-20T08:00:00Z',
    description: 'Envio automático de eventos do eSocial',
    icon: '📋',
  },
  {
    id: '4',
    name: 'SAP SuccessFactors',
    type: 'HRIS',
    status: 'DISCONNECTED',
    description: 'Integração com sistema de RH',
    icon: '🔗',
  },
];

export const PayrollIntegrations: React.FC = () => {
  const toast = useToastContext();
  
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<PayrollCycle[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedCycle, setSelectedCycle] = useState<PayrollCycle | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await payrollManagementService.getAllCycles();
      setCycles(data);
      if (data.length > 0) {
        setSelectedCycle(data[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar ciclos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      // Simular sincronização
      const integration = integrations.find(i => i.id === integrationId);
      if (integration) {
        integration.status = 'CONNECTED';
        integration.lastSync = new Date().toISOString();
        setIntegrations([...integrations]);
        toast.success(`${integration.name} sincronizado com sucesso!`);
      }
    } catch (error) {
      toast.error('Erro ao sincronizar');
      console.error(error);
    }
  };

  const handleSendToAccounting = async () => {
    if (!selectedCycle) return;
    try {
      // Simular envio
      toast.success('Dados enviados para contabilidade com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar para contabilidade');
      console.error(error);
    }
  };

  const handleSendToBank = async () => {
    if (!selectedCycle) return;
    try {
      // Simular envio
      toast.success('Arquivo bancário gerado e enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar arquivo bancário');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge variant="success">Conectado</Badge>;
      case 'DISCONNECTED':
        return <Badge variant="outline">Desconectado</Badge>;
      case 'ERROR':
        return <Badge variant="error">Erro</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="payroll">
        <div className="space-y-6">
          <PageHeader title="Integrações" subtitle="Carregando..." />
          <SkeletonCard />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="payroll">
      <div className="space-y-6">
        <PageHeader
          title="Integrações de Folha"
          subtitle="Gerencie integrações com banco, contabilidade e sistemas fiscais"
        />

        {/* Seletor de Ciclo */}
        <Card>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Ciclo para Envio
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCycle?.id || ''}
              onChange={(e) => {
                const cycle = cycles.find(c => c.id === e.target.value);
                setSelectedCycle(cycle || null);
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

        {/* Ações Rápidas */}
        {selectedCycle && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="primary"
                  onClick={handleSendToBank}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl mb-2">🏦</span>
                  <span>Enviar Arquivo Bancário</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendToAccounting}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl mb-2">📊</span>
                  <span>Enviar para Contabilidade</span>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Integrações */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrações Configuradas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>

                  {integration.lastSync && (
                    <p className="text-xs text-gray-500 mb-4">
                      Última sincronização: {formatDate(integration.lastSync)}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {integration.status === 'CONNECTED' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(integration.id)}
                        >
                          🔄 Sincronizar Agora
                        </Button>
                        <Button variant="outline" size="sm">
                          ⚙️ Configurar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedIntegration(integration);
                          setShowSyncModal(true);
                        }}
                      >
                        🔌 Conectar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Informações de Integração */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Integração</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">🏦 Bancária</h4>
                <p className="text-sm text-gray-600">
                  Envio automático de arquivos de remessa bancária (CNAB240, OFX) para processamento de pagamentos.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">📊 Contabilidade</h4>
                <p className="text-sm text-gray-600">
                  Exportação de dados contábeis para sistemas ERP e contábeis (XML, CSV, API).
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-gray-900">📋 Fiscal</h4>
                <p className="text-sm text-gray-600">
                  Integração com eSocial, SEFIP, DARF e outros sistemas fiscais governamentais.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">🔗 HRIS</h4>
                <p className="text-sm text-gray-600">
                  Sincronização bidirecional com sistemas de RH (SAP, Workday, Oracle HCM).
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de Conexão */}
      {showSyncModal && selectedIntegration && (
        <Modal
          isOpen={showSyncModal}
          onClose={() => {
            setShowSyncModal(false);
            setSelectedIntegration(null);
          }}
          title={`Conectar ${selectedIntegration.name}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configure as credenciais e parâmetros de conexão para {selectedIntegration.name}.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL/Endpoint
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key / Token
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••••••"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowSyncModal(false);
                  setSelectedIntegration(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  handleSync(selectedIntegration.id);
                  setShowSyncModal(false);
                  setSelectedIntegration(null);
                }}
              >
                Conectar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ModuleLayout>
  );
};

