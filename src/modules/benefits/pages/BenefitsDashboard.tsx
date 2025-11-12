import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { DashboardTile } from '../../../components/common/DashboardTile';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { formatCurrency } from '../../../utils/formatters';

// Mock Types
interface Benefit {
  id: string;
  name: string;
  provider: string;
  category: string;
  cost: number;
  status: 'ACTIVE' | 'PENDING';
  enrollmentDate: string;
}

export const BenefitsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setBenefits([
        { id: '1', name: 'Plano de Saúde Premium', provider: 'Unimed', category: 'Saúde', cost: 450.00, status: 'ACTIVE', enrollmentDate: '2023-01-15' },
        { id: '2', name: 'Vale Alimentação', provider: 'Sodexo', category: 'Alimentação', cost: 0.00, status: 'ACTIVE', enrollmentDate: '2023-01-15' }, // Custo 0 para o empregado (exemplo)
        { id: '3', name: 'Gympass', provider: 'Gympass', category: 'Bem-estar', cost: 29.90, status: 'ACTIVE', enrollmentDate: '2023-06-01' },
        { id: '4', name: 'Seguro de Vida', provider: 'Porto Seguro', category: 'Seguros', cost: 12.50, status: 'PENDING', enrollmentDate: '2023-11-10' },
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalCost = benefits.reduce((acc, b) => acc + b.cost, 0);
  const activeBenefits = benefits.filter(b => b.status === 'ACTIVE').length;

  return (
    <ModuleLayout moduleId="benefits">
      <div className="space-y-6">
        <PageHeader
          title="Benefícios"
          subtitle="Visualize e gerencie seus benefícios"
          actions={[
            {
              label: 'Meus Benefícios',
              onClick: () => navigate('/benefits/my'),
              variant: 'primary',
              icon: '💎',
            },
          ]}
        />

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardTile
                title="Custo Mensal"
                icon="💰"
                description={formatCurrency(totalCost)}
                status="open"
                onClick={() => {}}
              />
              <DashboardTile
                title="Benefícios Ativos"
                icon="💎"
                count={activeBenefits}
                status="open"
                description="Planos contratados"
                onClick={() => {}}
              />
              <DashboardTile
                title="Inscrições Abertas"
                icon="📝"
                count={1}
                status="pending"
                description="Janela de inscrição ativa"
                onClick={() => {}}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meus Planos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <Card key={benefit.id} className="hover:shadow-lg transition-all">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit.name}</h4>
                          <p className="text-sm text-gray-500">{benefit.provider} • {benefit.category}</p>
                        </div>
                        <Badge variant={benefit.status === 'ACTIVE' ? 'success' : 'warning'}>
                          {benefit.status === 'ACTIVE' ? 'Ativo' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-500">Custo para você</p>
                          <p className="font-bold text-gray-900">{formatCurrency(benefit.cost)}<span className="text-xs font-normal text-gray-500">/mês</span></p>
                        </div>
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ModuleLayout>
  );
};

