import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

interface DataSource {
  id: string;
  name: string;
  type: 'project' | 'goal' | 'kpi' | 'feedback' | 'attendance' | 'custom';
  description: string;
  enabled: boolean;
  weight: number;
  integration?: string;
}

export const DataSourcesConfig: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Entrega de Projetos',
      type: 'project',
      description: 'Avaliação baseada na entrega de projetos no ano',
      enabled: true,
      weight: 30,
      integration: 'Projects Module',
    },
    {
      id: '2',
      name: 'Metas e Objetivos',
      type: 'goal',
      description: 'Avaliação baseada no cumprimento de metas e objetivos',
      enabled: true,
      weight: 25,
      integration: 'Goals Module',
    },
    {
      id: '3',
      name: 'KPIs de Performance',
      type: 'kpi',
      description: 'Indicadores-chave de performance mensuráveis',
      enabled: true,
      weight: 20,
      integration: 'Analytics Module',
    },
    {
      id: '4',
      name: 'Feedback 360°',
      type: 'feedback',
      description: 'Feedback de pares, subordinados e gestores',
      enabled: false,
      weight: 15,
      integration: 'Feedback Module',
    },
    {
      id: '5',
      name: 'Presença e Ponto',
      type: 'attendance',
      description: 'Análise de presença e pontualidade',
      enabled: true,
      weight: 5,
      integration: 'Attendance Module',
    },
    {
      id: '6',
      name: 'Fonte Customizada',
      type: 'custom',
      description: 'Fonte de dados personalizada configurável',
      enabled: false,
      weight: 5,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);

  const handleToggle = (id: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === id ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const handleEdit = (source: DataSource) => {
    setEditingId(source.id);
    setEditingSource({ ...source });
  };

  const handleSave = () => {
    if (editingSource) {
      setDataSources(prev =>
        prev.map(source => (source.id === editingSource.id ? editingSource : source))
      );
      setEditingId(null);
      setEditingSource(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingSource(null);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      project: 'Projetos',
      goal: 'Metas',
      kpi: 'KPIs',
      feedback: 'Feedback',
      attendance: 'Presença',
      custom: 'Customizado',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      project: '📁',
      goal: '🎯',
      kpi: '📊',
      feedback: '💬',
      attendance: '⏰',
      custom: '⚙️',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const totalWeight = dataSources.filter(s => s.enabled).reduce((sum, s) => sum + s.weight, 0);

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Configurar Fontes de Dados"
          subtitle="Configure fontes de dados para medir entrega no ano e fatores de sucesso"
        />

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Peso Total Configurado</h3>
                <p className="text-sm text-gray-500">
                  A soma dos pesos das fontes habilitadas deve ser 100%
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalWeight}%
                </p>
                {totalWeight !== 100 && (
                  <p className="text-xs text-red-600 mt-1">
                    Ajuste necessário: {totalWeight < 100 ? '+' : ''}{100 - totalWeight}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {dataSources.map((source) => (
            <Card key={source.id}>
              <div className="p-6">
                {editingId === source.id && editingSource ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Fonte
                      </label>
                      <Input
                        value={editingSource.name}
                        onChange={(e) =>
                          setEditingSource({ ...editingSource, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={editingSource.description}
                        onChange={(e) =>
                          setEditingSource({ ...editingSource, description: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Peso (%)
                      </label>
                      <Input
                        type="number"
                        value={editingSource.weight}
                        onChange={(e) =>
                          setEditingSource({
                            ...editingSource,
                            weight: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={handleSave}>
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl">{getTypeIcon(source.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {getTypeLabel(source.type)}
                            </span>
                            {source.integration && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                {source.integration}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-xs text-gray-500">Peso: </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {source.weight}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded ${
                                  source.enabled
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {source.enabled ? 'Habilitado' : 'Desabilitado'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(source.id)}
                      >
                        {source.enabled ? 'Desabilitar' : 'Habilitar'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(source)}>
                        Editar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Nova Fonte</h3>
            <Button variant="primary">➕ Adicionar Fonte de Dados</Button>
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

