import { ModuleConfig, getAllModules, canAccessModule, canAccessAdmin } from '../types/modules';
import { Permission } from '../types/modules';

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
  adminPath?: string;
}

export function buildModuleNavigation(userPermissions: Permission[]): NavigationGroup[] {
  const modules = getAllModules();
  
  const groups: Record<string, NavigationGroup> = {
    Principal: {
      id: 'principal',
      label: 'Principal',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/employee/dashboard', label: 'Meu Dashboard', icon: '👤' },
      ],
    },
  };

  modules.forEach((module) => {
    if (!canAccessModule(userPermissions, module.id)) {
      return;
    }

    const groupKey = getModuleGroup(module.id);
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        id: groupKey.toLowerCase(),
        label: groupKey,
        items: [],
      };
    }

    groups[groupKey].items.push({
      path: module.route,
      label: module.name,
      icon: module.icon,
      adminPath: canAccessAdmin(userPermissions, module.id) ? module.adminRoute : undefined,
    });
  });

  return Object.values(groups);
}

function getModuleGroup(moduleId: string): string {
  const groupMap: Record<string, string> = {
    recruitment: 'Recrutamento',
    employees: 'Gestão',
    leaves: 'Gestão',
    attendance: 'Gestão',
    performance: 'Desenvolvimento',
    development: 'Desenvolvimento',
    'people-cycles': 'Desenvolvimento',
    projects: 'Projetos',
    analytics: 'Relatórios',
    benefits: 'Gestão',
    settings: 'Configurações',
  };

  return groupMap[moduleId] || 'Outros';
}

export function getModuleByPath(path: string): ModuleConfig | null {
  const modules = getAllModules();
  return modules.find((m) => path.startsWith(m.route) || path.startsWith(m.adminRoute)) || null;
}

