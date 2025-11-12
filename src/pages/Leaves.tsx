import React from 'react';
import { Layout } from '../components/layout/Layout';
import { LeaveRequestForm } from '../components/leaves/LeaveRequestForm';
import { LeaveList } from '../components/leaves/LeaveList';
import { LeaveBalances } from '../components/leaves/LeaveBalances';
import { Tabs } from '../components/common/Tabs';

export const Leaves: React.FC = () => {
  const tabs = [
    {
      id: 'balances',
      label: 'Saldos',
      content: <LeaveBalances />,
    },
    {
      id: 'request',
      label: 'Solicitar Licença',
      content: <LeaveRequestForm />,
    },
    {
      id: 'list',
      label: 'Minhas Solicitações',
      content: <LeaveList />,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Licenças</h1>
          <p className="text-gray-600">Visualize seus saldos, solicite e gerencie suas licenças</p>
        </div>

        <Tabs tabs={tabs} />
      </div>
    </Layout>
  );
};

