import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { getAllModules, ModuleConfig } from '../types/modules';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';

export const ModulesHome: React.FC = () => {
  const navigate = useNavigate();
  const modules = getAllModules();
  const [searchTerm, setSearchTerm] = useState('');

  const groups: Record<string, string[]> = {
    'Gestão de Pessoas': ['employees', 'leaves', 'attendance', 'benefits', 'payroll', 'separation', 'contract-labor'],
    'Talento e Desenvolvimento': ['recruitment', 'performance', 'development', 'people-cycles'],
    'Operações': ['projects', 'facilities', 'travel', 'expenses', 'policies'],
    'Estratégia': ['analytics', 'surveys'],
    'Sistema': ['settings'],
  };

  const getModuleGroup = (moduleId: string): string => {
    for (const [groupName, moduleIds] of Object.entries(groups)) {
      if (moduleIds.includes(moduleId)) return groupName;
    }
    return 'Outros';
  };

  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return modules;
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modules, searchTerm]);

  const groupedModules = useMemo(() => {
    const grouped: Record<string, ModuleConfig[]> = {};
    
    filteredModules.forEach((module) => {
      const group = getModuleGroup(module.id);
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(module);
    });

    // Sort groups based on the defined order in `groups`
    const sortedGroups: Record<string, ModuleConfig[]> = {};
    Object.keys(groups).forEach(group => {
      if (grouped[group]) sortedGroups[group] = grouped[group];
    });
    // Add 'Outros' if exists
    if (grouped['Outros']) sortedGroups['Outros'] = grouped['Outros'];

    return sortedGroups;
  }, [filteredModules]);

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Módulos do Sistema</h1>
            <p className="text-gray-500 mt-1">Acesse todas as funcionalidades disponíveis</p>
          </div>
          <div className="w-full md:w-72">
            <Input
              placeholder="Buscar módulos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<span className="text-gray-400">🔍</span>}
            />
          </div>
        </div>

        {Object.entries(groupedModules).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum módulo encontrado para "{searchTerm}"</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedModules).map(([group, groupModules]) => (
              <section key={group} className="animate-fadeIn">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                  {group}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupModules.map((module) => (
                    <Card
                      key={module.id}
                      className="hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-blue-200 group"
                      onClick={() => navigate(module.route)}
                    >
                      <div className="p-4 flex items-start gap-4">
                        <div className={`
                          p-3 rounded-lg bg-gray-50 text-2xl group-hover:scale-110 transition-transform duration-300
                        `}>
                          {module.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {module.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      {/* Rodapé do Card com Links Rápidos (Opcional) */}
                      {module.features.length > 0 && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                          <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                            <span>Acessar</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

