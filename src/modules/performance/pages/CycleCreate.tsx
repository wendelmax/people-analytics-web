import React, { useEffect, useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Input } from '../../../components/common/Input';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { CycleTemplate, Review180360Mode, CycleStageType } from '../../../types/performanceCycle';
import { useNavigate } from 'react-router-dom';
import { format, addDays, addWeeks, addMonths, parseISO } from 'date-fns';

interface StageDateConfig {
  id: string;
  name: string;
  type: CycleStageType;
  startDate: string;
  endDate: string;
  suggestedDuration: number;
  durationUnit: 'days' | 'weeks' | 'months';
}

const getSuggestedDuration = (type: CycleStageType): { duration: number; unit: 'days' | 'weeks' | 'months' } => {
  switch (type) {
    case 'GOAL_SETTING':
      return { duration: 4, unit: 'weeks' };
    case 'SELF_REVIEW':
      return { duration: 3, unit: 'weeks' };
    case 'MANAGER_REVIEW':
      return { duration: 2, unit: 'weeks' };
    case 'PEER_REVIEW':
      return { duration: 3, unit: 'weeks' };
    case 'REVIEW_180_360':
      return { duration: 4, unit: 'weeks' };
    case 'CALIBRATION':
      return { duration: 2, unit: 'weeks' };
    case 'FEEDBACK':
      return { duration: 2, unit: 'weeks' };
    case 'CLOSING':
      return { duration: 1, unit: 'weeks' };
    default:
      return { duration: 2, unit: 'weeks' };
  }
};

const calculateEndDate = (startDate: string, duration: number, unit: 'days' | 'weeks' | 'months'): string => {
  const start = parseISO(startDate);
  let end: Date;
  
  if (unit === 'days') {
    end = addDays(start, duration);
  } else if (unit === 'weeks') {
    end = addWeeks(start, duration);
  } else {
    end = addMonths(start, duration);
  }
  
  return format(end, 'yyyy-MM-dd');
};

export const CycleCreate: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<CycleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [review180360Enabled, setReview180360Enabled] = useState(false);
  const [review180360Mode, setReview180360Mode] = useState<Review180360Mode>('BOTH');
  const [seniorLevelThreshold, setSeniorLevelThreshold] = useState('Senior');
  const [cycleStartDate, setCycleStartDate] = useState<string>(() => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  });
  const [cycleEndDate, setCycleEndDate] = useState<string>(() => {
    const nextYear = addMonths(new Date(), 12);
    return format(nextYear, 'yyyy-MM-dd');
  });
  const [stageDates, setStageDates] = useState<StageDateConfig[]>([]);
  const [currentStep, setCurrentStep] = useState<'template' | 'config' | 'dates'>('template');

  useEffect(() => {
    const loadTemplates = async () => {
      const data = await performanceCycleService.getTemplates();
      setTemplates(data);
      setLoading(false);
    };
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplateId && currentStep === 'dates' && templates.length > 0) {
      initializeStageDates();
    }
  }, [selectedTemplateId, review180360Enabled, currentStep, cycleStartDate, templates]);

  const initializeStageDates = () => {
    if (!selectedTemplateId) return;
    
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    let stages = [...template.stages];
    
    if (review180360Enabled) {
      const reviewStageIndex = stages.findIndex(s => s.type === 'SELF_REVIEW' || s.type === 'MANAGER_REVIEW');
      if (reviewStageIndex !== -1) {
        stages.splice(reviewStageIndex + 1, 0, {
          name: 'Avaliação 180/360',
          type: 'REVIEW_180_360',
          description: review180360Mode === 'BOTH' 
            ? `Avaliação 180° para cargos abaixo de ${seniorLevelThreshold} e 360° para ${seniorLevelThreshold} e acima`
            : review180360Mode === '180_ONLY'
            ? 'Avaliação 180° para todos: Autoavaliação + Gestor'
            : 'Avaliação 360° para todos: Autoavaliação + Gestor + Pares'
        });
      }
    }

    const cycleStart = parseISO(cycleStartDate);
    let currentDate = cycleStart;
    const dates: StageDateConfig[] = [];

    stages.forEach((stage, index) => {
      const suggestion = getSuggestedDuration(stage.type);
      const startDateStr = format(currentDate, 'yyyy-MM-dd');
      const endDateStr = calculateEndDate(startDateStr, suggestion.duration, suggestion.unit);
      
      dates.push({
        id: `stage-${index}`,
        name: stage.name,
        type: stage.type,
        startDate: startDateStr,
        endDate: endDateStr,
        suggestedDuration: suggestion.duration,
        durationUnit: suggestion.unit,
      });

      currentDate = parseISO(endDateStr);
      currentDate = addDays(currentDate, 1);
    });

    setStageDates(dates);
  };

  const handleNextToConfig = () => {
    if (selectedTemplateId) {
      setCurrentStep('config');
    }
  };

  const handleNextToDates = () => {
    setCurrentStep('dates');
  };

  const handleStageDateChange = (stageId: string, field: 'startDate' | 'endDate', value: string) => {
    setStageDates(prev => {
      const updated = prev.map(stage => {
        if (stage.id === stageId) {
          const newStage = { ...stage, [field]: value };
          
          if (field === 'startDate') {
            const endDate = calculateEndDate(value, stage.suggestedDuration, stage.durationUnit);
            newStage.endDate = endDate;
          }
          
          return newStage;
        }
        return stage;
      });

      const sorted = [...updated].sort((a, b) => {
        const dateA = parseISO(a.startDate);
        const dateB = parseISO(b.startDate);
        return dateA.getTime() - dateB.getTime();
      });

      for (let i = 1; i < sorted.length; i++) {
        const prevEnd = parseISO(sorted[i - 1].endDate);
        const currentStart = parseISO(sorted[i].startDate);
        
        if (currentStart <= prevEnd) {
          sorted[i].startDate = format(addDays(prevEnd, 1), 'yyyy-MM-dd');
          sorted[i].endDate = calculateEndDate(sorted[i].startDate, sorted[i].suggestedDuration, sorted[i].durationUnit);
        }
      }

      return sorted;
    });
  };

  const handleCreate = async () => {
    if (!selectedTemplateId || stageDates.length === 0) return;
    
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    const stages = stageDates.map((stageDate, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: stageDate.name,
      type: stageDate.type,
      startDate: new Date(stageDate.startDate).toISOString(),
      endDate: new Date(stageDate.endDate).toISOString(),
      status: index === 0 ? 'IN_PROGRESS' : 'PENDING',
      description: template.stages.find(s => s.name === stageDate.name)?.description || 
                   (stageDate.type === 'REVIEW_180_360' 
                     ? (review180360Mode === 'BOTH' 
                        ? `Avaliação 180° para cargos abaixo de ${seniorLevelThreshold} e 360° para ${seniorLevelThreshold} e acima`
                        : review180360Mode === '180_ONLY'
                        ? 'Avaliação 180° para todos: Autoavaliação + Gestor'
                        : 'Avaliação 360° para todos: Autoavaliação + Gestor + Pares')
                     : undefined),
    }));

    await performanceCycleService.createCycle({
      name: `Novo ${template.name}`,
      templateId: template.id,
      startDate: new Date(cycleStartDate).toISOString(),
      endDate: new Date(cycleEndDate).toISOString(),
      stages,
      review180360: review180360Enabled ? {
        enabled: true,
        mode: review180360Mode,
        seniorLevelThreshold: review180360Mode === 'BOTH' ? seniorLevelThreshold : '',
      } : undefined,
    });

    navigate('/people-cycles');
  };

  const selectedTemplate = selectedTemplateId ? templates.find(t => t.id === selectedTemplateId) : null;

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6 max-w-5xl mx-auto">
        <PageHeader
          title="Criar Novo Ciclo"
          subtitle={
            currentStep === 'template' ? 'Escolha um modelo de ciclo para começar' :
            currentStep === 'config' ? 'Configure a avaliação 180/360' :
            'Configure as datas das etapas do ciclo'
          }
        />

        {currentStep === 'template' && (
          <>
            {loading ? (
              <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all border-2 hover:shadow-lg relative ${
                      selectedTemplateId === template.id 
                        ? 'border-blue-600 ring-2 ring-blue-100' 
                        : 'border-transparent hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    {selectedTemplateId === template.id && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="p-6 flex flex-col h-full">
                      <div className="text-4xl mb-4">{template.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                      
                      <p className="text-sm text-gray-600 mb-6 flex-1">
                        {template.description}
                      </p>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Etapas do Ciclo:</p>
                        {template.stages.map((stage, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            {stage.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {selectedTemplateId && (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => navigate('/people-cycles')}>Cancelar</Button>
                <Button variant="primary" onClick={handleNextToConfig}>
                  Próximo: Configurar 180/360
                </Button>
              </div>
            )}
          </>
        )}

        {currentStep === 'config' && selectedTemplate && (
          <>
            <Card>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Template Selecionado</h3>
                  <p className="text-sm text-gray-600">{selectedTemplate.name}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração de Avaliação 180/360</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enable180360"
                      checked={review180360Enabled}
                      onChange={(e) => setReview180360Enabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="enable180360" className="text-sm font-medium text-gray-700">
                      Habilitar Avaliação 180/360 neste ciclo
                    </label>
                  </div>

                  {review180360Enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Modo de Avaliação
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="reviewMode"
                              value="180_ONLY"
                              checked={review180360Mode === '180_ONLY'}
                              onChange={(e) => setReview180360Mode(e.target.value as Review180360Mode)}
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
                              name="reviewMode"
                              value="360_ONLY"
                              checked={review180360Mode === '360_ONLY'}
                              onChange={(e) => setReview180360Mode(e.target.value as Review180360Mode)}
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
                              name="reviewMode"
                              value="BOTH"
                              checked={review180360Mode === 'BOTH'}
                              onChange={(e) => setReview180360Mode(e.target.value as Review180360Mode)}
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

                      {review180360Mode === 'BOTH' && (
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
                        <p className="text-sm text-blue-800">
                          {review180360Mode === '180_ONLY' && 'Apenas avaliação 180° para todos: Autoavaliação + Avaliação do Gestor Imediato'}
                          {review180360Mode === '360_ONLY' && 'Apenas avaliação 360° para todos: Autoavaliação + Gestor + Pares indicados'}
                          {review180360Mode === 'BOTH' && `Diferenciação por cargo: Abaixo de ${seniorLevelThreshold} = 180° | ${seniorLevelThreshold} e acima = 360°`}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setCurrentStep('template')}>Voltar</Button>
              <Button variant="primary" onClick={handleNextToDates}>
                Próximo: Configurar Datas
              </Button>
            </div>
          </>
        )}

        {currentStep === 'dates' && stageDates.length > 0 && (
          <>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Datas do Ciclo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início do Ciclo
                    </label>
                    <Input
                      type="date"
                      value={cycleStartDate}
                      onChange={(e) => setCycleStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Término do Ciclo
                    </label>
                    <Input
                      type="date"
                      value={cycleEndDate}
                      onChange={(e) => setCycleEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurar Datas das Etapas</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configure as datas de início e fim de cada etapa. Sugestões de duração são fornecidas baseadas no tipo de etapa.
                </p>
                
                <div className="space-y-6">
                  {stageDates.map((stage, index) => {
                    const suggestion = getSuggestedDuration(stage.type);
                    return (
                      <div key={stage.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Duração sugerida: {suggestion.duration} {suggestion.unit === 'days' ? 'dias' : suggestion.unit === 'weeks' ? 'semanas' : 'meses'}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {index + 1}ª Etapa
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Data de Início
                            </label>
                            <Input
                              type="date"
                              value={stage.startDate}
                              onChange={(e) => handleStageDateChange(stage.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Data de Término
                            </label>
                            <Input
                              type="date"
                              value={stage.endDate}
                              onChange={(e) => handleStageDateChange(stage.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const suggestion = getSuggestedDuration(stage.type);
                            const endDate = calculateEndDate(stage.startDate, suggestion.duration, suggestion.unit);
                            handleStageDateChange(stage.id, 'endDate', endDate);
                          }}
                          className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Aplicar duração sugerida ({suggestion.duration} {suggestion.unit === 'days' ? 'dias' : suggestion.unit === 'weeks' ? 'semanas' : 'meses'})
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setCurrentStep('config')}>Voltar</Button>
              <Button variant="primary" onClick={handleCreate}>
                Criar Ciclo
              </Button>
            </div>
          </>
        )}
      </div>
    </ModuleLayout>
  );
};
