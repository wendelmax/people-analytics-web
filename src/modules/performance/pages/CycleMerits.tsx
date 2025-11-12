import React, { useEffect, useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonCard } from '../../../components/common/Skeleton';

interface Merit {
  id: string;
  employeeName: string;
  department: string;
  meritType: 'excellence' | 'innovation' | 'leadership' | 'teamwork' | 'customer_focus';
  description: string;
  cycleId: string;
  cycleName: string;
  awardedBy: string;
  awardedDate: string;
  value?: number;
  status: 'pending' | 'approved' | 'awarded';
}

export const CycleMerits: React.FC = () => {
  const [merits, setMerits] = useState<Merit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'excellence' | 'innovation' | 'leadership' | 'teamwork' | 'customer_focus'>('all');

  useEffect(() => {
    loadMerits();
  }, []);

  const loadMerits = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockMerits: Merit[] = [
      {
        id: '1',
        employeeName: 'Ana Paula',
        department: 'Tecnologia',
        meritType: 'excellence',
        description: 'Excelência técnica excepcional no desenvolvimento do projeto X, entregando resultados acima do esperado',
        cycleId: 'cycle-1',
        cycleName: 'Ciclo 2024',
        awardedBy: 'João Santos',
        awardedDate: '2024-01-15',
        value: 5000,
        status: 'awarded',
      },
      {
        id: '2',
        employeeName: 'Carlos Mendes',
        department: 'Vendas',
        meritType: 'innovation',
        description: 'Inovação na abordagem de vendas que resultou em aumento de 30% no fechamento de negócios',
        cycleId: 'cycle-1',
        cycleName: 'Ciclo 2024',
        awardedBy: 'Maria Silva',
        awardedDate: '2024-01-20',
        value: 3000,
        status: 'approved',
      },
      {
        id: '3',
        employeeName: 'Roberto Lima',
        department: 'RH',
        meritType: 'leadership',
        description: 'Liderança exemplar na gestão da equipe, promovendo desenvolvimento e alta performance',
        cycleId: 'cycle-1',
        cycleName: 'Ciclo 2024',
        awardedBy: 'Patricia Costa',
        awardedDate: '2024-01-18',
        status: 'pending',
      },
      {
        id: '4',
        employeeName: 'Fernanda Souza',
        department: 'Atendimento',
        meritType: 'teamwork',
        description: 'Trabalho em equipe excepcional, colaborando efetivamente com múltiplos departamentos',
        cycleId: 'cycle-1',
        cycleName: 'Ciclo 2024',
        awardedBy: 'Ricardo Alves',
        awardedDate: '2024-01-22',
        value: 2000,
        status: 'awarded',
      },
    ];
    setMerits(mockMerits);
    setLoading(false);
  };

  const filteredMerits = merits.filter(m => {
    if (filter === 'all') return true;
    return m.meritType === filter;
  });

  const getMeritTypeLabel = (type: string) => {
    const labels = {
      excellence: 'Excelência',
      innovation: 'Inovação',
      leadership: 'Liderança',
      teamwork: 'Trabalho em Equipe',
      customer_focus: 'Foco no Cliente',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMeritTypeIcon = (type: string) => {
    const icons = {
      excellence: '⭐',
      innovation: '💡',
      leadership: '👑',
      teamwork: '🤝',
      customer_focus: '🎯',
    };
    return icons[type as keyof typeof icons] || '🏆';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      awarded: 'bg-green-100 text-green-800',
    };
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      awarded: 'Concedido',
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
          title="Méritos"
          subtitle="Visualize e gerencie méritos concedidos baseados em avaliações"
          actions={[
            {
              label: 'Novo Mérito',
              onClick: () => {},
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos ({merits.length})
          </Button>
          <Button
            variant={filter === 'excellence' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('excellence')}
          >
            ⭐ Excelência ({merits.filter(m => m.meritType === 'excellence').length})
          </Button>
          <Button
            variant={filter === 'innovation' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('innovation')}
          >
            💡 Inovação ({merits.filter(m => m.meritType === 'innovation').length})
          </Button>
          <Button
            variant={filter === 'leadership' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('leadership')}
          >
            👑 Liderança ({merits.filter(m => m.meritType === 'leadership').length})
          </Button>
          <Button
            variant={filter === 'teamwork' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('teamwork')}
          >
            🤝 Trabalho em Equipe ({merits.filter(m => m.meritType === 'teamwork').length})
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredMerits.map((merit) => (
            <Card key={merit.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{getMeritTypeIcon(merit.meritType)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {merit.employeeName}
                        </h3>
                        {getStatusBadge(merit.status)}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                          {getMeritTypeLabel(merit.meritType)}
                        </span>
                        <span className="text-sm text-gray-500">{merit.department}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{merit.cycleName}</span>
                      </div>
                      <p className="text-sm text-gray-600">{merit.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Concedido por: <strong>{merit.awardedBy}</strong></span>
                    <span>•</span>
                    <span>{new Date(merit.awardedDate).toLocaleDateString('pt-BR')}</span>
                    {merit.value && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-green-600">
                          R$ {merit.value.toLocaleString('pt-BR')}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    {merit.status === 'pending' && (
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
              </div>
            </Card>
          ))}
        </div>

        {filteredMerits.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum mérito encontrado</p>
            </div>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

