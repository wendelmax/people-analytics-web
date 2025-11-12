import React from 'react';
import { useLocation } from 'react-router-dom';
import { ModuleSidebar } from './ModuleSidebar';
import { ModulesTopNav } from './ModulesTopNav';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ModuleId, ModuleConfig, getModuleConfig } from '../../types/modules';

interface ModuleLayoutProps {
  moduleId: ModuleId;
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  moduleId,
  children,
  showBreadcrumbs = true,
}) => {
  const location = useLocation();
  const module = getModuleConfig(moduleId);

  const isAdminRoute = location.pathname.includes('/admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ModulesTopNav />
      <div className="flex flex-1">
        <ModuleSidebar module={module} isAdmin={isAdminRoute} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {showBreadcrumbs && (
              <div className="mb-6">
                <Breadcrumbs />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

