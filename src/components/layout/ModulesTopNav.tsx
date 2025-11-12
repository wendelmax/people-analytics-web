import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllModules, canAccessModule, getModuleConfig, ModuleId } from '../../types/modules';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/AuthContext';

export const ModulesTopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions } = usePermissions();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const modules = getAllModules();
  const accessibleModules = modules.filter((module) => canAccessModule(permissions, module.id));

  // Detectar módulo atual baseado na rota
  const getCurrentModule = (): ModuleId | null => {
    const path = location.pathname;
    if (path.startsWith('/employees')) return 'employees';
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/leaves')) return 'leaves';
    if (path.startsWith('/attendance')) return 'attendance';
    if (path.startsWith('/performance')) return 'performance';
    if (path.startsWith('/development')) return 'development';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/recruitment')) return 'recruitment';
    if (path.startsWith('/benefits')) return 'benefits';
    if (path.startsWith('/settings')) return 'settings';
    return null;
  };

  const currentModuleId = getCurrentModule();
  const currentModule = currentModuleId ? getModuleConfig(currentModuleId) : null;

  // Só mostrar se estiver dentro de um módulo
  if (!currentModuleId) return null;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Módulo Atual */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/modules')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold">People Analytics</span>
            </button>

            {currentModule && (
              <>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentModule.icon}</span>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{currentModule.name}</h2>
                    <p className="text-xs text-gray-500">{currentModule.description}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Menu de Módulos */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {currentModule ? 'Trocar Módulo' : 'Módulos'}
              </span>
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Navegar para Módulo</h3>
                    <div className="space-y-1">
                      {accessibleModules.map((module) => {
                        const isActive = currentModuleId === module.id;
                        return (
                          <button
                            key={module.id}
                            onClick={() => {
                              navigate(module.route);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-2xl">{module.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium">{module.name}</div>
                              <div className="text-xs text-gray-500">{module.description}</div>
                            </div>
                            {isActive && (
                              <span className="px-2 py-0.5 text-xs bg-blue-200 text-blue-800 rounded-full font-semibold">
                                Ativo
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

