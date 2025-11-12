import React from 'react';
import { Navigate } from 'react-router-dom';
import { ModuleId } from '../../types/modules';
import { usePermissions } from '../../hooks/usePermissions';

interface ModuleRouteProps {
  moduleId: ModuleId;
  requireAdmin?: boolean;
  children: React.ReactNode;
}

export const ModuleRoute: React.FC<ModuleRouteProps> = ({
  moduleId,
  requireAdmin = false,
  children,
}) => {
  const { checkModuleAccess, checkAdminAccess } = usePermissions();

  const hasAccess = requireAdmin
    ? checkAdminAccess(moduleId)
    : checkModuleAccess(moduleId);

  if (!hasAccess) {
    return <Navigate to="/modules" replace />;
  }

  return <>{children}</>;
};

