import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleConfig } from '../../types/modules';
import { useAuth } from '../../contexts/AuthContext';

interface ModuleHeaderProps {
  module: ModuleConfig;
  isAdmin?: boolean;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ module, isAdmin = false }) => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const handleAdminToggle = () => {
    if (isAdmin) {
      navigate(module.route);
    } else {
      navigate(module.adminRoute);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Voltar ao Dashboard Principal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Dashboard Principal</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isAdmin ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <span className="text-2xl">{module.icon}</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{module.name}</h1>
                {isAdmin ? (
                  <span className="text-xs text-blue-600 font-medium">Modo Administrativo</span>
                ) : (
                  <span className="text-xs text-gray-500">{module.description}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAdminToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAdmin
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isAdmin ? '← Modo Normal' : '⚙️ Modo Admin'}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

