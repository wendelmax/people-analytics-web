import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

export const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout moduleId="performance">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Avaliações Pendentes" value="0" icon="⏳" />
          <StatCard title="Avaliações Concluídas" value="0" icon="✅" />
          <StatCard title="Média de Performance" value="0.0" icon="⭐" />
        </div>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Gerenciar Avaliações</Button>
              <Button variant="secondary">Gerenciar Objetivos</Button>
              <Button variant="secondary">Calibração</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

