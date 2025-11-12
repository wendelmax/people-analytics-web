import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

interface CompensationRule {
  id: string;
  name: string;
  type: 'bonus' | 'plr' | 'salary_adjustment' | 'promotion';
  enabled: boolean;
  minRating: number;
  maxRating: number;
  percentage: number;
  fixedAmount?: number;
  conditions: string[];
}

export const CompensationConfig: React.FC = () => {
  const [rules, setRules] = useState<CompensationRule[]>([
    {
      id: '1',
      name: 'Bônus por Performance Excepcional',
      type: 'bonus',
      enabled: true,
      minRating: 4.5,
      maxRating: 5.0,
      percentage: 15,
      conditions: ['Avaliação acima de 4.5', 'Metas principais atingidas'],
    },
    {
      id: '2',
      name: 'PLR Baseada em Avaliação',
      type: 'plr',
      enabled: true,
      minRating: 3.5,
      maxRating: 5.0,
      percentage: 20,
      conditions: ['Avaliação acima de 3.5', 'Sem advertências no período'],
    },
    {
      id: '3',
      name: 'Ajuste Salarial por Mérito',
      type: 'salary_adjustment',
      enabled: true,
      minRating: 4.0,
      maxRating: 5.0,
      percentage: 8,
      conditions: ['Avaliação consistente acima de 4.0', 'Pelo menos 2 ciclos consecutivos'],
    },
    {
      id: '4',
      name: 'Bônus por Superação',
      type: 'bonus',
      enabled: false,
      minRating: 4.8,
      maxRating: 5.0,
      fixedAmount: 5000,
      conditions: ['Avaliação acima de 4.8', 'Projetos especiais concluídos'],
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<CompensationRule | null>(null);

  const handleToggle = (id: string) => {
    setRules(prev =>
      prev.map(rule => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
    );
  };

  const handleEdit = (rule: CompensationRule) => {
    setEditingId(rule.id);
    setEditingRule({ ...rule });
  };

  const handleSave = () => {
    if (editingRule) {
      setRules(prev =>
        prev.map(rule => (rule.id === editingRule.id ? editingRule : rule))
      );
      setEditingId(null);
      setEditingRule(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingRule(null);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      bonus: 'Bônus',
      plr: 'PLR',
      salary_adjustment: 'Ajuste Salarial',
      promotion: 'Promoção',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      bonus: '💰',
      plr: '💵',
      salary_adjustment: '📈',
      promotion: '⬆️',
    };
    return icons[type as keyof typeof icons] || '💼';
  };

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Amarrar Avaliação"
          subtitle="Configure integração entre avaliações e compensação (Bônus, PLR, Promoções)"
        />

        <Card className="bg-blue-50 border-blue-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Integração com Compensação
            </h3>
            <p className="text-sm text-blue-800">
              Configure regras automáticas para vincular resultados de avaliação a bônus, PLR,
              ajustes salariais e promoções. As regras serão aplicadas automaticamente ao final
              de cada ciclo de avaliação.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <div className="p-6">
                {editingId === rule.id && editingRule ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Regra
                      </label>
                      <Input
                        value={editingRule.name}
                        onChange={(e) =>
                          setEditingRule({ ...editingRule, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avaliação Mínima
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={editingRule.minRating}
                          onChange={(e) =>
                            setEditingRule({
                              ...editingRule,
                              minRating: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avaliação Máxima
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={editingRule.maxRating}
                          onChange={(e) =>
                            setEditingRule({
                              ...editingRule,
                              maxRating: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Percentual (%)
                        </label>
                        <Input
                          type="number"
                          value={editingRule.percentage}
                          onChange={(e) =>
                            setEditingRule({
                              ...editingRule,
                              percentage: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      {editingRule.fixedAmount !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valor Fixo (R$)
                          </label>
                          <Input
                            type="number"
                            value={editingRule.fixedAmount}
                            onChange={(e) =>
                              setEditingRule({
                                ...editingRule,
                                fixedAmount: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      )}
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
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl">{getTypeIcon(rule.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                              {getTypeLabel(rule.type)}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${
                                rule.enabled
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {rule.enabled ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <span className="text-xs text-gray-500">Faixa de Avaliação: </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {rule.minRating} - {rule.maxRating}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Valor: </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {rule.fixedAmount
                                  ? `R$ ${rule.fixedAmount.toLocaleString('pt-BR')}`
                                  : `${rule.percentage}%`}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Condições:</p>
                            <ul className="space-y-1">
                              {rule.conditions.map((condition, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-gray-600"
                                >
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span>{condition}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button variant="outline" size="sm" onClick={() => handleToggle(rule.id)}>
                        {rule.enabled ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(rule)}>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Nova Regra</h3>
            <Button variant="primary">➕ Adicionar Regra de Compensação</Button>
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

