import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { LeaveRequestForm } from '../../../components/leaves/LeaveRequestForm';
import { LeaveList } from '../../../components/leaves/LeaveList';
import { LeaveBalances } from '../../../components/leaves/LeaveBalances';
import { PageHeader } from '../../../components/common/PageHeader';
import { Modal } from '../../../components/common/Modal';
import { useLeaves } from '../../../hooks/useLeaves';

export const LeavesDashboard: React.FC = () => {
  const { myLeaves } = useLeaves();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <ModuleLayout moduleId="leaves">
      <div className="space-y-6">
        <PageHeader
          title="Férias e Ausências"
          subtitle={`${myLeaves.length} solicitações registradas`}
          actions={[
            {
              label: 'Solicitar Licença',
              onClick: () => setIsRequestModalOpen(true),
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda: Saldos e Informações Rápidas */}
          <div className="lg:col-span-1 space-y-6">
             <LeaveBalances />
          </div>

          {/* Coluna da Direita: Histórico de Solicitações */}
          <div className="lg:col-span-2">
            <LeaveList />
          </div>
        </div>

        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          title="Solicitar Licença"
          size="lg"
        >
          <LeaveRequestForm onSuccess={() => setIsRequestModalOpen(false)} />
        </Modal>
      </div>
    </ModuleLayout>
  );
};

