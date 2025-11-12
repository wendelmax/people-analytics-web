import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Permission, ModuleId, hasPermission, canAccessModule, canAccessAdmin } from '../types/modules';

export function usePermissions() {
  const { token } = useAuth();

  const userPermissions = useMemo<Permission[]>(() => {
    if (!token) return [];
    
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.permissions || [];
      }
    } catch (error) {
      // Invalid user permissions data - fallback to empty permissions
    }
    
    return [];
  }, [token]);

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(userPermissions, permission);
  };

  const checkModuleAccess = (moduleId: ModuleId): boolean => {
    return canAccessModule(userPermissions, moduleId);
  };

  const checkAdminAccess = (moduleId: ModuleId): boolean => {
    return canAccessAdmin(userPermissions, moduleId);
  };

  const isAdmin = useMemo(() => {
    return userPermissions.includes('admin');
  }, [userPermissions]);

  return {
    permissions: userPermissions,
    checkPermission,
    checkModuleAccess,
    checkAdminAccess,
    isAdmin,
  };
}

