import React, { useEffect, useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonCard } from '../../../components/common/Skeleton';

interface PromotionCandidate {
  id: string;
  employeeName: string;
  currentPosition: string;
  proposedPosition: string;
  department: string;
  performanceRating: number;
  readinessScore: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  cycleId: string;
  cycleName: string;
  recommendedBy: string;
  notes?: string;
}

export const CyclePromotions: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockPromotions: PromotionCandidate[] = [
      {
        id: '1',
        employeeName: 'Maria Silva',
        currentPosition: 'Analista Sênior',
        proposedPosition: 'Especialista',
        department: 'Tecnologia',
        performanceRating: 4.8,
        readinessScore: 92,
        status: 'pending',
        cycleId: 'cycle-1',
        cycleName: 'Ciclo 2024',
        recommendedBy: 'João Santos',
        notes: 'Excelente desempenho consistente e liderança técnica',
      },
      {
        id: '2',
        employeeName: 'Pedro Costa',
        currentPosition: 'Coordenador',
        proposedPosition: 'Gerente',
        department: 'Vendas',
        performanceRating: 4.5,
        readinessScore: 88,
        status: 'in_review',
        cycleId: 'cycle-1',
        cycleName: 'Ciclo 2024',
        recommendedBy: 'Ana Oliveira',
      },
      {
        id: '3',
        employeeName: 'Julia Ferreira',
        currentPosition: 'Assistente',
        proposedPosition: 'Analista',
        department: 'RH',
        performanceRating: 4.2,
        readinessScore: 85,
        status: 'approved',
        cycleId: 'cycle-1',
        cycleName: 'Ciclo 2024',
        recommendedBy: 'Carlos Mendes',
      },
    ];
    setPromotions(mockPromotions);
    setLoading(false);
  };

  const filteredPromotions = promotions.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      in_review: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovada',
      rejected: 'Rejeitada',
      in_review: 'Em Revisão',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Possíveis Promoções"
          subtitle="Gerencie promoções baseadas em avaliações de performance"
          actions={[
            {
              label: 'Nova Promoção',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas ({promotions.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendentes ({promotions.filter(p => p.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Aprovadas ({promotions.filter(p => p.status === 'approved').length})
          </Button>
          <Button
            variant={filter === 'rejected' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
          >
            Rejeitadas ({promotions.filter(p => p.status === 'rejected').length})
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredPromotions.map((promotion) => (
            <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {promotion.employeeName}
                      </h3>
                      {getStatusBadge(promotion.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>
                        <strong>De:</strong> {promotion.currentPosition}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span>
                        <strong>Para:</strong> {promotion.proposedPosition}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{promotion.department}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium mb-1">Avaliação de Performance</p>
                    <p className="text-2xl font-bold text-blue-900">{promotion.performanceRating.toFixed(1)}</p>
                    <p className="text-xs text-blue-600">de 5.0</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium mb-1">Prontidão</p>
                    <p className="text-2xl font-bold text-green-900">{promotion.readinessScore}%</p>
                    <p className="text-xs text-green-600">Score de prontidão</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-1">Ciclo</p>
                    <p className="text-sm font-semibold text-gray-900">{promotion.cycleName}</p>
                    <p className="text-xs text-gray-600">Recomendado por {promotion.recommendedBy}</p>
                  </div>
                </div>

                {promotion.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-1">Observações</p>
                    <p className="text-sm text-gray-600">{promotion.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {promotion.status === 'pending' && (
                    <>
                      <Button variant="primary" size="sm">
                        Aprovar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Rejeitar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPromotions.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma promoção encontrada</p>
            </div>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

