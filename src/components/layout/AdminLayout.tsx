import React from 'react';
import { ModuleLayout } from './ModuleLayout';
import { ModuleId } from '../../types/modules';

interface AdminLayoutProps {
  moduleId: ModuleId;
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  moduleId,
  children,
  showBreadcrumbs = true,
}) => {
  return (
    <ModuleLayout moduleId={moduleId} showBreadcrumbs={showBreadcrumbs} showHeader={true}>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
        </div>
      </div>
      {children}
    </ModuleLayout>
  );
};

