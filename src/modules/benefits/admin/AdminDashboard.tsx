import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';

export const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout moduleId="benefits">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Benefícios Ativos" value="0" icon="💎" />
          <StatCard title="Inscrições" value="0" icon="📋" />
          <StatCard title="Funcionários Cobertos" value="0" icon="👥" />
        </div>

        <Card>
          <div className="p-6">
            <EmptyState
              title="Módulo em Desenvolvimento"
              message="O módulo de Benefícios está sendo implementado. Em breve você poderá gerenciar benefícios, inscrições e compensação."
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

