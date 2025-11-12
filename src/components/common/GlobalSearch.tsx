import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../hooks/useEmployees';
import { useProjects } from '../../hooks/useProjects';
import { useDepartments } from '../../hooks/useDepartments';
import { Employee, Project, Department } from '../../types';

interface SearchResult {
  id: string;
  type: 'employee' | 'project' | 'department' | 'module';
  title: string;
  subtitle?: string;
  icon: string;
  route: string;
  module?: string;
}

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { employees } = useEmployees();
  const { projects } = useProjects();
  const { departments } = useDepartments();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Buscar funcionários
    employees
      .filter((emp) => emp.name.toLowerCase().includes(searchTerm) || emp.email?.toLowerCase().includes(searchTerm))
      .slice(0, 5)
      .forEach((emp) => {
        searchResults.push({
          id: emp.id,
          type: 'employee',
          title: emp.name,
          subtitle: emp.position || emp.email,
          icon: '👤',
          route: `/employees/${emp.id}`,
          module: 'employees',
        });
      });

    // Buscar projetos
    projects
      .filter((proj) => proj.name.toLowerCase().includes(searchTerm) || proj.description?.toLowerCase().includes(searchTerm))
      .slice(0, 5)
      .forEach((proj) => {
        searchResults.push({
          id: proj.id,
          type: 'project',
          title: proj.name,
          subtitle: proj.description,
          icon: '📁',
          route: `/projects/${proj.id}`,
          module: 'projects',
        });
      });

    // Buscar departamentos
    departments
      .filter((dept) => dept.name.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .forEach((dept) => {
        searchResults.push({
          id: dept.id,
          type: 'department',
          title: dept.name,
          subtitle: dept.description,
          icon: '🏢',
          route: `/settings/admin/departments`,
          module: 'settings',
        });
      });

    // Buscar módulos
    const modules = [
      { name: 'Funcionários', route: '/employees', icon: '👥', module: 'employees' },
      { name: 'Projetos', route: '/projects', icon: '📁', module: 'projects' },
      { name: 'Licenças', route: '/leaves', icon: '🏖️', module: 'leaves' },
      { name: 'Presença', route: '/attendance', icon: '⏰', module: 'attendance' },
      { name: 'Performance', route: '/performance', icon: '⭐', module: 'performance' },
      { name: 'Desenvolvimento', route: '/development', icon: '🎓', module: 'development' },
      { name: 'Analytics', route: '/analytics', icon: '📈', module: 'analytics' },
    ];

    modules
      .filter((mod) => mod.name.toLowerCase().includes(searchTerm))
      .forEach((mod) => {
        searchResults.push({
          id: mod.module,
          type: 'module',
          title: mod.name,
          subtitle: `Ir para ${mod.name}`,
          icon: mod.icon,
          route: mod.route,
          module: mod.module,
        });
      });

    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, employees, projects, departments]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelectResult(results[selectedIndex]);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.route);
    setIsOpen(false);
    setQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (query.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Buscar funcionários, projetos, departamentos..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="py-1">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelectResult(result)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{result.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {result.type === 'employee' && 'Funcionário'}
                        {result.type === 'project' && 'Projeto'}
                        {result.type === 'department' && 'Departamento'}
                        {result.type === 'module' && 'Módulo'}
                      </span>
                    </div>
                    {result.subtitle && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{result.subtitle}</p>
                    )}
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-4">
          <p className="text-center text-sm text-gray-500">Nenhum resultado encontrado</p>
        </div>
      )}
    </div>
  );
};

