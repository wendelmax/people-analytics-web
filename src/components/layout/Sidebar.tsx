import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllModules, canAccessModule } from '../../types/modules';
import { usePermissions } from '../../hooks/usePermissions';

interface NavItem {
  path: string;
  label: string;
  icon?: string;
  badge?: number;
  group?: string;
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { permissions } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  if (!isAuthenticated) return null;

  const modules = getAllModules();
  // Por enquanto, mostrar todos os módulos. As permissões serão verificadas no ModuleRoute
  const accessibleModules = modules; // modules.filter((module) => canAccessModule(permissions, module.id));

  function getModuleGroup(moduleId: string): string {
    const groupMap: Record<string, string> = {
      recruitment: 'Recrutamento',
      employees: 'Gestão de Pessoas',
      leaves: 'Gestão de Pessoas',
      attendance: 'Gestão de Pessoas',
      performance: 'Desenvolvimento',
      development: 'Desenvolvimento',
      'people-cycles': 'Desenvolvimento',
      projects: 'Projetos',
      analytics: 'Relatórios',
      benefits: 'Gestão de Pessoas',
      settings: 'Configurações',
    };
    return groupMap[moduleId] || 'Outros';
  }

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', group: 'Principal' },
    { path: '/employee/dashboard', label: 'Meu Dashboard', icon: '👤', group: 'Principal' },
    { path: '/modules', label: 'Módulos', icon: '📦', group: 'Principal' },
    { path: '/chatbot', label: 'Chatbot', icon: '🤖', group: 'Suporte' },
    { path: '/notifications', label: 'Notificações', icon: '🔔', group: 'Suporte' },
  ];

  const groupedItems = navItems.reduce((acc, item) => {
    const group = item.group || 'Outros';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`bg-white shadow-sm border-r min-h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-gray-900">People Analytics</h2>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Seção Principal */}
          {groupedItems['Principal'] && (
            <div>
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Principal
                </h3>
              )}
              <div className="space-y-1">
                {groupedItems['Principal'].map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                      aria-label={item.label}
                    >
                      {item.icon && <span className="text-lg">{item.icon}</span>}
                      {!isCollapsed && <span className="flex-1">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grupos de Módulos */}
          {Object.entries(groupedItems)
            .filter(([group]) => group !== 'Principal' && group !== 'Suporte')
            .map(([group, items]) => (
              <div key={group}>
                {!isCollapsed && (
                  <h3 className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg mb-2 uppercase tracking-wider">
                    {group}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all group ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600 shadow-sm'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-l-4 hover:border-blue-300'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? item.label : undefined}
                        aria-label={item.label}
                      >
                        {item.icon && (
                          <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                            {item.icon}
                          </span>
                        )}
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 font-medium">{item.label}</span>
                            {isActive && (
                              <span className="px-2 py-0.5 text-xs bg-blue-200 text-blue-800 rounded-full font-semibold">
                                Ativo
                              </span>
                            )}
                            {!isActive && (
                              <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Seção Suporte */}
          {groupedItems['Suporte'] && (
            <div className="pt-2 border-t border-gray-200">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Suporte
                </h3>
              )}
              <div className="space-y-1">
                {groupedItems['Suporte'].map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                      aria-label={item.label}
                    >
                      {item.icon && <span className="text-lg">{item.icon}</span>}
                      {!isCollapsed && <span className="flex-1">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

