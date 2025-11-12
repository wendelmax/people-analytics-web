import React, { useState, useMemo } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Select } from '../../../components/common/Select';
import { useEmployees } from '../../../hooks/useEmployees';
import { useDepartments } from '../../../hooks/useDepartments';
import { Employee } from '../../../types';

interface OrgNode {
  employee: Employee;
  subordinates: OrgNode[];
  level: number;
}

export const OrganizationChart: React.FC = () => {
  const { employees, loading: employeesLoading } = useEmployees();
  const { departments, loading: departmentsLoading } = useDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

  const buildOrgTree = (employees: Employee[], managerId?: string, level = 0): OrgNode[] => {
    return employees
      .filter(emp => emp.managerId === managerId)
      .map(employee => ({
        employee,
        subordinates: buildOrgTree(employees, employee.id, level + 1),
        level
      }));
  };

  const orgTree = useMemo(() => {
    if (!employees.length) return [];

    // Encontrar funcionários sem manager (top level)
    const topLevelEmployees = employees.filter(emp => !emp.managerId);
    return buildOrgTree(employees, undefined, 0);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (selectedDepartment === 'all') return employees;
    return employees.filter(emp => emp.departmentId === selectedDepartment);
  }, [employees, selectedDepartment]);

  const departmentStats = useMemo(() => {
    const stats: Record<string, { count: number; costCenter?: string }> = {};

    employees.forEach(emp => {
      if (!stats[emp.departmentId]) {
        const dept = departments.find(d => d.id === emp.departmentId);
        stats[emp.departmentId] = {
          count: 0,
          costCenter: dept?.costCenter
        };
      }
      stats[emp.departmentId].count++;
    });

    return stats;
  }, [employees, departments]);

  const renderOrgNode = (node: OrgNode): JSX.Element => {
    const { employee, subordinates, level } = node;
    const department = departments.find(d => d.id === employee.departmentId);

    return (
      <div key={employee.id} className="org-node">
        <div
          className={`
            inline-block p-4 bg-white border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow
            ${level === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}
          style={{ marginLeft: level * 40 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{employee.name}</h4>
              <p className="text-sm text-gray-600">{employee.position?.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {department?.name || 'Sem departamento'}
                </Badge>
                {department?.costCenter && (
                  <Badge variant="secondary" className="text-xs">
                    CC: {department.costCenter}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {subordinates.length > 0 && (
          <div className="mt-4 ml-8">
            {subordinates.map(subNode => renderOrgNode(subNode))}
          </div>
        )}
      </div>
    );
  };

  const renderEmployeeList = () => {
    const groupedByDepartment = filteredEmployees.reduce((acc, emp) => {
      const deptId = emp.departmentId;
      if (!acc[deptId]) acc[deptId] = [];
      acc[deptId].push(emp);
      return acc;
    }, {} as Record<string, Employee[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedByDepartment).map(([deptId, deptEmployees]) => {
          const department = departments.find(d => d.id === deptId);
          const stats = departmentStats[deptId];

          return (
            <Card key={deptId}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {department?.name || 'Sem departamento'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stats?.count || 0} funcionários
                    </p>
                    {stats?.costCenter && (
                      <p className="text-xs text-gray-500 mt-1">
                        Centro de Custo: {stats.costCenter}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {stats?.count || 0} membros
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deptEmployees.map(employee => {
                    const manager = employees.find(e => e.id === employee.managerId);

                    return (
                      <div key={employee.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {employee.name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {employee.position?.title}
                            </p>
                            {manager && (
                              <p className="text-xs text-gray-500">
                                Reporta para: {manager.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  if (employeesLoading || departmentsLoading) {
    return (
      <ModuleLayout moduleId="employees">
        <div className="space-y-6">
          <PageHeader title="Organograma" subtitle="Carregando..." />
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="employees">
      <div className="space-y-6">
        <PageHeader
          title="Organograma e Estrutura"
          subtitle="Visualize a hierarquia organizacional e distribuição por departamento"
          actions={[
            {
              label: viewMode === 'tree' ? 'Ver Lista' : 'Ver Árvore',
              onClick: () => setViewMode(viewMode === 'tree' ? 'list' : 'tree'),
              variant: 'outline',
              icon: viewMode === 'tree' ? '📋' : '🌳'
            }
          ]}
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Departamento
            </label>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              options={[
                { value: 'all', label: 'Todos os Departamentos' },
                ...departments.map(dept => ({
                  value: dept.id,
                  label: `${dept.name} (${departmentStats[dept.id]?.count || 0} funcionários)${dept.costCenter ? ` - CC: ${dept.costCenter}` : ''}`
                }))
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
            <div className="text-sm text-gray-600">Total de Funcionários</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">{departments.length}</div>
            <div className="text-sm text-gray-600">Departamentos</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {departments.filter(d => d.costCenter).length}
            </div>
            <div className="text-sm text-gray-600">Centros de Custo</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.max(...orgTree.map(node => node.level + 1), 1)}
            </div>
            <div className="text-sm text-gray-600">Níveis Hierárquicos</div>
          </Card>
        </div>

        {viewMode === 'tree' ? (
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Estrutura Hierárquica</h3>
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {orgTree.length > 0 ? (
                    <div className="space-y-6">
                      {orgTree.map(node => renderOrgNode(node))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Nenhum funcionário encontrado na estrutura hierárquica
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          renderEmployeeList()
        )}
      </div>
    </ModuleLayout>
  );
};
