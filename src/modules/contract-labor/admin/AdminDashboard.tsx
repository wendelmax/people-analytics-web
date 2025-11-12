import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ModuleLayout moduleId="contract-labor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Mão de Obra Terceirizada</h1>
          <p className="text-gray-600">Gerencie contratados e trabalhadores terceirizados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contract-labor/admin/contractors')}>
            <div className="space-y-4">
              <div className="text-4xl">🏢</div>
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Contratados</h3>
              <p className="text-sm text-gray-600">Gerenciar contratados</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contract-labor/admin/labor')}>
            <div className="space-y-4">
              <div className="text-4xl">👷</div>
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Mão de Obra</h3>
              <p className="text-sm text-gray-600">Gerenciar trabalhadores</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contract-labor/admin/attendance')}>
            <div className="space-y-4">
              <div className="text-4xl">⏰</div>
              <h3 className="text-lg font-semibold text-gray-900">Presença</h3>
              <p className="text-sm text-gray-600">Controle de presença</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contract-labor/admin/billing')}>
            <div className="space-y-4">
              <div className="text-4xl">💰</div>
              <h3 className="text-lg font-semibold text-gray-900">Faturamento</h3>
              <p className="text-sm text-gray-600">Faturamento de contratados</p>
              <Button variant="primary" className="w-full">Acessar</Button>
            </div>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
};

