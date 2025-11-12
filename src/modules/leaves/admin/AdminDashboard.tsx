import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { StatCard } from '../../../components/dashboard/StatCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout moduleId="leaves">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Solicitações Pendentes" value="0" icon="⏳" />
          <StatCard title="Aprovadas Este Mês" value="0" icon="✅" />
          <StatCard title="Rejeitadas Este Mês" value="0" icon="❌" />
        </div>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => navigate('/leaves/management')}>
                Gerenciar Solicitações
              </Button>
              <Button variant="secondary">Relatórios</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

