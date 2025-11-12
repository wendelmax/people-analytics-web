import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ModuleLayout moduleId="payroll">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Folha de Pagamento</h1>
          <p className="text-gray-600">Processe e gerencie folha de pagamento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/payroll/admin/management')}>
            <div className="space-y-4">
              <div className="text-4xl">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Folha</h3>
              <p className="text-sm text-gray-600">Processar folha de pagamento</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/payroll/admin/processing')}>
            <div className="space-y-4">
              <div className="text-4xl">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900">Processamento</h3>
              <p className="text-sm text-gray-600">Processar folha mensal</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/payroll/admin/reports')}>
            <div className="space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
              <p className="text-sm text-gray-600">Relatórios de folha</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
};

