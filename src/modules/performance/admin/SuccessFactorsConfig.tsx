import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

interface SuccessFactor {
  id: string;
  stageId: string;
  stageName: string;
  name: string;
  description: string;
  weight: number;
  criteria: string[];
  enabled: boolean;
}

export const SuccessFactorsConfig: React.FC = () => {
  const [factors, setFactors] = useState<SuccessFactor[]>([
    {
      id: '1',
      stageId: 'stage-1',
      stageName: 'Autoavaliação',
      name: 'Completude da Autoavaliação',
      description: 'Avalia se o colaborador preencheu todos os campos obrigatórios',
      weight: 20,
      criteria: [
        'Todos os objetivos foram avaliados',
        'Feedback detalhado foi fornecido',
        'Evidências foram anexadas',
      ],
      enabled: true,
    },
    {
      id: '2',
      stageId: 'stage-1',
      stageName: 'Autoavaliação',
      name: 'Qualidade do Feedback',
      description: 'Avalia a qualidade e profundidade do feedback fornecido',
      weight: 30,
      criteria: [
        'Feedback específico e construtivo',
        'Exemplos concretos foram fornecidos',
        'Pontos de melhoria identificados',
      ],
      enabled: true,
    },
    {
      id: '3',
      stageId: 'stage-2',
      stageName: 'Avaliação do Gestor',
      name: 'Alinhamento de Expectativas',
      description: 'Verifica se há alinhamento entre autoavaliação e avaliação do gestor',
      weight: 25,
      criteria: [
        'Diferença de avaliação menor que 1 ponto',
        'Justificativas claras para divergências',
        'Consenso em pontos críticos',
      ],
      enabled: true,
    },
    {
      id: '4',
      stageId: 'stage-3',
      stageName: 'Calibração',
      name: 'Consistência entre Gestores',
      description: 'Avalia a consistência das avaliações entre diferentes gestores',
      weight: 15,
      criteria: [
        'Padrões de avaliação consistentes',
        'Calibração realizada com sucesso',
        'Ajustes justificados e documentados',
      ],
      enabled: true,
    },
    {
      id: '5',
      stageId: 'stage-4',
      stageName: 'Feedback Final',
      name: 'Comunicação Efetiva',
      description: 'Avalia a qualidade da comunicação do feedback final',
      weight: 10,
      criteria: [
        'Feedback entregue em tempo hábil',
        'Sessão de feedback realizada',
        'Plano de desenvolvimento discutido',
      ],
      enabled: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFactor, setEditingFactor] = useState<SuccessFactor | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const stages = Array.from(new Set(factors.map(f => f.stageName)));

  const filteredFactors =
    selectedStage === 'all'
      ? factors
      : factors.filter(f => f.stageName === selectedStage);

  const handleEdit = (factor: SuccessFactor) => {
    setEditingId(factor.id);
    setEditingFactor({ ...factor });
  };

  const handleSave = () => {
    if (editingFactor) {
      setFactors(prev =>
        prev.map(factor => (factor.id === editingFactor.id ? editingFactor : factor))
      );
      setEditingId(null);
      setEditingFactor(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingFactor(null);
  };

  const handleToggle = (id: string) => {
    setFactors(prev =>
      prev.map(factor =>
        factor.id === id ? { ...factor, enabled: !factor.enabled } : factor
      )
    );
  };

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Fatores de Sucesso"
          subtitle="Configure fatores de sucesso para cada etapa de avaliação"
        />

        <Card>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Etapa
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas as Etapas</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <div className="space-y-4">
          {filteredFactors.map((factor) => (
            <Card key={factor.id}>
              <div className="p-6">
                {editingId === factor.id && editingFactor ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Fator
                      </label>
                      <Input
                        value={editingFactor.name}
                        onChange={(e) =>
                          setEditingFactor({ ...editingFactor, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={editingFactor.description}
                        onChange={(e) =>
                          setEditingFactor({ ...editingFactor, description: e.target.value })
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
                        value={editingFactor.weight}
                        onChange={(e) =>
                          setEditingFactor({
                            ...editingFactor,
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
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{factor.name}</h3>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                            {factor.stageName}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              factor.enabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {factor.enabled ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
                        <div className="mb-3">
                          <span className="text-xs text-gray-500">Peso: </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {factor.weight}%
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-2">Critérios:</p>
                          <ul className="space-y-1">
                            {factor.criteria.map((criterion, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(factor.id)}
                      >
                        {factor.enabled ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(factor)}>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Fator</h3>
            <Button variant="primary">➕ Adicionar Fator de Sucesso</Button>
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

