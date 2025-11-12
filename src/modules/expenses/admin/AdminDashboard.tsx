import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ModuleLayout moduleId="expenses">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Reembolsos</h1>
          <p className="text-gray-600">Aprove e gerencie reembolsos e despesas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/expenses/admin/management')}>
            <div className="space-y-4">
              <div className="text-4xl">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Reembolsos</h3>
              <p className="text-sm text-gray-600">Aprovar e gerenciar reembolsos</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/expenses/admin/reports')}>
            <div className="space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
              <p className="text-sm text-gray-600">Relatórios financeiros</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
};

