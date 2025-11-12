import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { employeeService } from '../../../services/employeeService';
import { skillService } from '../../../services/skillService';
import { useGoals } from '../../../hooks/useGoals';
import { useProjects } from '../../../hooks/useProjects';
import { useLeaveRequests } from '../../../hooks/useLeaveRequests';
import { Employee, EmployeeSkill } from '../../../types';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { QuickActions } from '../../../components/common/QuickActions';
import { RelatedData } from '../../../components/common/RelatedData';
import { formatDate } from '../../../utils/formatters';
import { formatSkillLevel } from '../../../utils/formatters';

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [skills, setSkills] = useState<EmployeeSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { goals } = useGoals();
  const { projects } = useProjects();
  const { requests: leaveRequests } = useLeaveRequests();

  useEffect(() => {
    if (id) {
      fetchEmployee();
      fetchSkills();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getById(id!);
      setEmployee(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar funcionário');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const data = await skillService.getEmployeeProficiencies(id!);
      setSkills(data);
    } catch (err) {
      // Failed to load skills - continue with empty skills
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="employees">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error || !employee) {
    return (
      <ModuleLayout moduleId="employees">
        <ErrorMessage message={error || 'Funcionário não encontrado'} />
      </ModuleLayout>
    );
  }

  const employeeGoals = goals.filter((g) => g.employeeId === id);
  const employeeProjects = projects.filter((p) => p.employees?.some((e) => e.id === id) || false);
  const employeeLeaves = leaveRequests.filter((l) => l.employeeId === id);

  return (
    <ModuleLayout moduleId="employees">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/employees')} className="mb-4">
          ← Voltar para lista
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-gray-600 mt-1">{employee.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <QuickActions context="employees" employeeId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {employee.email}
            </p>
            {employee.phone && (
              <p>
                <span className="font-medium">Telefone:</span> {employee.phone}
              </p>
            )}
            <p>
              <span className="font-medium">Data de Contratação:</span>{' '}
              {formatDate(employee.hireDate)}
            </p>
            {employee.department && (
              <p>
                <span className="font-medium">Departamento:</span> {employee.department.name}
              </p>
            )}
            {employee.position && (
              <p>
                <span className="font-medium">Posição:</span> {employee.position.title}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Habilidades</h2>
          {skills.length === 0 ? (
            <p className="text-gray-500">Nenhuma habilidade cadastrada</p>
          ) : (
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.skillId} className="flex justify-between items-center">
                  <span>{skill.skill?.name || 'Habilidade'}</span>
                  <span className="text-sm text-gray-600">
                    {formatSkillLevel(skill.proficiency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <RelatedData
          title="Objetivos"
          items={employeeGoals.map((goal) => ({
            id: goal.id,
            title: goal.title,
            subtitle: `${Math.round((goal.progress || 0) * 100)}% completo`,
            icon: '🎯',
            route: `/goals/${goal.id}`,
            badge: goal.status,
          }))}
          emptyMessage="Nenhum objetivo atribuído"
          viewAllRoute="/goals"
        />

        <RelatedData
          title="Projetos"
          items={employeeProjects.map((project) => ({
            id: project.id,
            title: project.name,
            subtitle: project.status,
            icon: '📁',
            route: `/projects/${project.id}`,
            badge: project.status,
          }))}
          emptyMessage="Nenhum projeto atribuído"
          viewAllRoute="/projects"
        />

        <RelatedData
          title="Licenças Recentes"
          items={employeeLeaves.slice(0, 5).map((leave) => ({
            id: leave.id,
            title: leave.leaveType?.name || 'Licença',
            subtitle: `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`,
            icon: '🏖️',
            route: `/leaves?leaveId=${leave.id}`,
            badge: leave.status,
          }))}
          emptyMessage="Nenhuma licença registrada"
          viewAllRoute="/leaves"
        />
      </div>
    </ModuleLayout>
  );
};

