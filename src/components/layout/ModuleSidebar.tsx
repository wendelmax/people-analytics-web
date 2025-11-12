import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ModuleConfig, ModuleFeature } from '../../types/modules';
import { useAuth } from '../../contexts/AuthContext';

interface ModuleSidebarProps {
  module: ModuleConfig;
  isAdmin?: boolean;
}

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({ module, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(`sidebarCollapsed_${module.id}`);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(`sidebarCollapsed_${module.id}`, JSON.stringify(isCollapsed));
  }, [isCollapsed, module.id]);

  if (!isAuthenticated) return null;

  const features = isAdmin ? module.adminFeatures : module.features;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleFeatureClick = (feature: ModuleFeature) => {
    navigate(feature.route);
  };

  // Helper para renderizar itens de menu consistentes
  const renderMenuItem = (
    label: string,
    icon: string,
    route: string,
    onClick: () => void,
    isActive: boolean
  ) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all group ${
        isActive
          ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600 shadow-sm'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-l-4 hover:border-blue-300'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : undefined}
      aria-label={label}
    >
      <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
        {icon}
      </span>
      
      {!isCollapsed && (
        <>
          <span className="flex-1">{label}</span>
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

  return (
    <aside
      className={`bg-white shadow-sm border-r min-h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">{module.name}</h2>
              <p className="text-xs text-gray-500 mt-1">{module.description}</p>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Dashboard do Módulo */}
          <div className="mb-4">
            {!isCollapsed && (
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Dashboard
              </p>
            )}
            {!isAdmin ? (
              renderMenuItem(
                'Dashboard do Módulo',
                '📊',
                module.route,
                () => navigate(module.route),
                location.pathname === module.route
              )
            ) : (
              renderMenuItem(
                'Admin Dashboard',
                '⚙️',
                module.adminRoute,
                () => navigate(module.adminRoute),
                location.pathname === module.adminRoute
              )
            )}
          </div>

          {/* Funcionalidades do Módulo */}
          {features.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg mb-2 uppercase tracking-wider">
                  {isAdmin ? 'Gestão Administrativa' : 'Funcionalidades'}
                </h3>
              )}
              <div className="space-y-1">
                {features.map((feature) => (
                  <React.Fragment key={feature.id}>
                    {renderMenuItem(
                      feature.name,
                      feature.icon || '•',
                      feature.route,
                      () => handleFeatureClick(feature),
                      location.pathname === feature.route
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Configurações do Módulo */}
          {!isAdmin && (
            <div className="pt-4 border-t border-gray-200">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Configurações
                </h3>
              )}
              {renderMenuItem(
                'Configurações do Módulo',
                '⚙️',
                module.adminRoute,
                () => navigate(module.adminRoute),
                location.pathname.startsWith(module.adminRoute)
              )}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};