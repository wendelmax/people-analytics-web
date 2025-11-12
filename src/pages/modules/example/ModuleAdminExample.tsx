import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { StatCard } from '../../../components/dashboard/StatCard';

export const ModuleAdminExample: React.FC = () => {
  return (
    <AdminLayout moduleId="settings" showBreadcrumbs={true}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total de Itens"
            value="150"
            icon="📊"
          />
          <StatCard
            title="Itens Ativos"
            value="120"
            icon="✅"
          />
          <StatCard
            title="Pendentes"
            value="30"
            icon="⏳"
          />
        </div>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Criar Novo</Button>
              <Button variant="secondary">Importar</Button>
              <Button variant="secondary">Exportar</Button>
              <Button variant="danger">Limpar Cache</Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gestão
            </h3>
            <p className="text-gray-600">
              Esta é uma página de exemplo de administração de módulo.
              Substitua este conteúdo com as funcionalidades específicas do seu módulo.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

