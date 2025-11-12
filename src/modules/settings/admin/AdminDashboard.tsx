import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Card } from '../../../components/common/Card';
import { StatCard } from '../../../components/dashboard/StatCard';
import { Button } from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useDepartments } from '../hooks/useDepartments';
import { usePositions } from '../hooks/usePositions';
import { useSkills } from '../hooks/useSkills';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { departments, loading: deptLoading } = useDepartments();
  const { positions, loading: posLoading } = usePositions();
  const { skills, loading: skillsLoading } = useSkills();

  return (
    <AdminLayout moduleId="settings">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total de Departamentos"
            value={deptLoading ? '...' : departments.length.toString()}
            icon="🏢"
          />
          <StatCard
            title="Total de Posições"
            value={posLoading ? '...' : positions.length.toString()}
            icon="💼"
          />
          <StatCard
            title="Total de Habilidades"
            value={skillsLoading ? '...' : skills.length.toString()}
            icon="🎯"
          />
        </div>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/settings/admin/departments')}
              >
                Gerenciar Departamentos
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/settings/admin/positions')}
              >
                Gerenciar Posições
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/settings/admin/skills')}
              >
                Gerenciar Habilidades
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

