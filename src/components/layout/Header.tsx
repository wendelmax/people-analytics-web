import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { NotificationBell } from '../notifications/NotificationBell';
import { GlobalSearch } from '../common/GlobalSearch';
import { Avatar } from '../common/Avatar';
import { Popover } from '../common/Popover';

export const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchIn, setSearchIn] = useState('All');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/modules') return 'General Overview';
    if (path.startsWith('/employees')) return 'Employee Management';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/leaves')) return 'Leave & Attendance';
    if (path.startsWith('/performance')) return 'Performance Assessment';
    if (path.startsWith('/analytics')) return 'Reports & Analytics';
    return 'People Analytics';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-xl font-bold text-blue-600">People Analytics</div>
                  <div className="hidden lg:block text-sm text-gray-500">|</div>
                  <div className="hidden lg:block text-sm font-medium text-gray-700">
                    {getPageTitle()}
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 flex-1 max-w-md ml-4">
                  <select
                    value={searchIn}
                    onChange={(e) => setSearchIn(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-l-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Employees">Employees</option>
                    <option value="Projects">Projects</option>
                    <option value="Documents">Documents</option>
                  </select>
                  <div className="flex-1">
                    <GlobalSearch />
                  </div>
                </div>
              </>
            )}
          </div>

          {isAuthenticated && (
            <nav className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {}}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Help"
                title="Help"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <NotificationBell />

              <Popover
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-1">
                    <Avatar name={user?.name || 'Usuário'} size="sm" status="online" />
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name || 'Usuário'}
                    </span>
                  </div>
                }
                content={
                  <div className="w-48 py-1">
                    <button
                      onClick={() => navigate('/employee/dashboard')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Meu Perfil
                    </button>
                    <button
                      onClick={() => navigate('/notifications')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Configurações
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sair
                    </button>
                  </div>
                }
                position="bottom"
                align="end"
              />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

