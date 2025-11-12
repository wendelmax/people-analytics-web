import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { PerformanceCycle, Review180360Mode } from '../../../types/performanceCycle';

export const Review180360Config: React.FC = () => {
  const [cycles, setCycles] = useState<PerformanceCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Review180360Mode>('BOTH');
  const [seniorLevelThreshold, setSeniorLevelThreshold] = useState('Senior');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCycles();
  }, []);

  useEffect(() => {
    if (selectedCycleId) {
      const cycle = cycles.find(c => c.id === selectedCycleId);
      if (cycle?.review180360) {
        setEnabled(cycle.review180360.enabled);
        setMode(cycle.review180360.mode);
        setSeniorLevelThreshold(cycle.review180360.seniorLevelThreshold);
      } else {
        setEnabled(false);
        setMode('BOTH');
        setSeniorLevelThreshold('Senior');
      }
    }
  }, [selectedCycleId, cycles]);

  const loadCycles = async () => {
    try {
      const data = await performanceCycleService.getAllCycles();
      setCycles(data);
      if (data.length > 0) {
        setSelectedCycleId(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCycleId) return;
    
    const cycle = cycles.find(c => c.id === selectedCycleId);
    if (!cycle) return;

    const updatedCycle = {
      ...cycle,
      review180360: {
        enabled,
        mode,
        seniorLevelThreshold,
      },
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Configuração salva:', updatedCycle);
  };

  const getModeDescription = (selectedMode: Review180360Mode) => {
    switch (selectedMode) {
      case '180_ONLY':
        return 'Apenas avaliação 180° para todos: Autoavaliação + Avaliação do Gestor Imediato';
      case '360_ONLY':
        return 'Apenas avaliação 360° para todos: Autoavaliação + Gestor + Pares indicados';
      case 'BOTH':
        return 'Diferenciação por cargo: Abaixo de Senior = 180° | Senior+ = 360°';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="people-cycles">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Configurar Avaliação 180/360"
          subtitle="Configure avaliação 180° e 360° para os ciclos"
        />

        <Card>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Ciclo
              </label>
              <select
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {cycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                  Habilitar Avaliação 180/360
                </label>
              </div>

              {enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modo de Avaliação
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="mode"
                          value="180_ONLY"
                          checked={mode === '180_ONLY'}
                          onChange={(e) => setMode(e.target.value as Review180360Mode)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Apenas 180°</div>
                          <div className="text-sm text-gray-500">
                            Autoavaliação + Avaliação do Gestor Imediato (para todos)
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="mode"
                          value="360_ONLY"
                          checked={mode === '360_ONLY'}
                          onChange={(e) => setMode(e.target.value as Review180360Mode)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Apenas 360°</div>
                          <div className="text-sm text-gray-500">
                            Autoavaliação + Gestor + Pares indicados (para todos)
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="mode"
                          value="BOTH"
                          checked={mode === 'BOTH'}
                          onChange={(e) => setMode(e.target.value as Review180360Mode)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Ambos (Diferenciação por Cargo)</div>
                          <div className="text-sm text-gray-500">
                            Abaixo de Senior = 180° | Senior e acima = 360°
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {mode === 'BOTH' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nível de Cargo para 360° (Threshold)
                      </label>
                      <Input
                        value={seniorLevelThreshold}
                        onChange={(e) => setSeniorLevelThreshold(e.target.value)}
                        placeholder="Ex: Senior, Especialista, Gerente"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Cargos com este nível ou superior terão avaliação 360°. Cargos abaixo terão 180°.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">Como Funciona:</p>
                    <p className="text-sm text-blue-800">{getModeDescription(mode)}</p>
                    {mode === 'BOTH' && (
                      <div className="mt-3 space-y-1 text-sm text-blue-800">
                        <p><strong>180° (Abaixo de {seniorLevelThreshold}):</strong></p>
                        <ul className="list-disc list-inside ml-2">
                          <li>Autoavaliação</li>
                          <li>Avaliação do Gestor Imediato</li>
                        </ul>
                        <p className="mt-2"><strong>360° ({seniorLevelThreshold} e acima):</strong></p>
                        <ul className="list-disc list-inside ml-2">
                          <li>Autoavaliação</li>
                          <li>Avaliação do Gestor Imediato</li>
                          <li>Avaliações de pares indicados pela pessoa</li>
                          <li>Avaliações de pares indicados pelo gestor</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200">
              <Button variant="primary" onClick={handleSave}>
                Salvar Configuração
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ModuleLayout>
  );
};

