import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useDepartments } from '../../../hooks/useDepartments';
import { usePositions } from '../../../hooks/usePositions';
import { useSkills } from '../../../hooks/useSkills';

export const SettingsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { departments, loading: loadingDepts } = useDepartments();
  const { positions, loading: loadingPos } = usePositions();
  const { skills, loading: loadingSkills } = useSkills();

  const loading = loadingDepts || loadingPos || loadingSkills;

  if (loading) {
    return (
      <ModuleLayout moduleId="settings">
        <div className="space-y-6">
          <PageHeader
            title="Configurações"
            subtitle="Carregando..."
            actions={[{ label: 'Novo', onClick: () => {}, variant: 'primary', icon: '➕' }]}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="settings">
      <div className="space-y-6">
        <PageHeader
          title="Configurações"
          subtitle="Gerencie as configurações do sistema"
          actions={[
            {
              label: 'Novo',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardTile
            title="Departamentos"
            icon="🏢"
            count={departments.length}
            timestamp="20m ago"
            status="open"
            description="Gerencie os departamentos da empresa"
            onClick={() => navigate('/settings/admin/departments')}
          />

          <DashboardTile
            title="Posições"
            icon="💼"
            count={positions.length}
            timestamp="20m ago"
            status="open"
            description="Gerencie as posições e cargos"
            onClick={() => navigate('/settings/admin/positions')}
          />

          <DashboardTile
            title="Habilidades"
            icon="🎯"
            count={skills.length}
            timestamp="20m ago"
            status="open"
            description="Gerencie as habilidades do sistema"
            onClick={() => navigate('/settings/admin/skills')}
          />
        </div>
      </div>
    </ModuleLayout>
  );
};

