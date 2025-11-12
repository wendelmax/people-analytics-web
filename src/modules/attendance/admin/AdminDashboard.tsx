import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

export const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout moduleId="attendance">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Presença Hoje" value="0" icon="✅" />
          <StatCard title="Atrasos Hoje" value="0" icon="⏰" />
          <StatCard title="Ausências Hoje" value="0" icon="❌" />
        </div>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Gerenciar Presença</Button>
              <Button variant="secondary">Relatórios</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

