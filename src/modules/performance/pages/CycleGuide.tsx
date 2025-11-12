import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { performanceCycleService } from '../../../services/performanceCycleService';
import { CycleTemplate } from '../../../types/performanceCycle';

export const CycleGuide: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CycleTemplate | null>(null);
  const [templates, setTemplates] = useState<CycleTemplate[]>([]);

  React.useEffect(() => {
    const loadTemplates = async () => {
      const data = await performanceCycleService.getTemplates();
      setTemplates(data);
      if (data.length > 0) {
        setSelectedTemplate(data[0]);
      }
    };
    loadTemplates();
  }, []);

  return (
    <ModuleLayout moduleId="people-cycles">
      <div className="space-y-6">
        <PageHeader
          title="Guia Explicativo"
          subtitle="Entenda as etapas e características de cada tipo de ciclo"
        />

        {templates.length > 0 && (
          <Card>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Tipo de Ciclo
              </label>
              <select
                value={selectedTemplate?.id || ''}
                onChange={(e) => {
                  const template = templates.find(t => t.id === e.target.value);
                  setSelectedTemplate(template || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        )}

        {selectedTemplate && (
          <>
            <Card>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{selectedTemplate.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedTemplate.name}
                    </h2>
                    {selectedTemplate.companyReference && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                        {selectedTemplate.companyReference}
                      </span>
                    )}
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Etapas do Ciclo
                  </h3>
                  <div className="space-y-4">
                    {selectedTemplate.stages.map((stage, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{stage.name}</h4>
                          {stage.description && (
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          )}
                          {stage.duration && (
                            <p className="text-xs text-gray-500 mt-2">
                              Duração estimada: {stage.duration}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Objetivos e Benefícios
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Objetivos</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Avaliar desempenho de forma estruturada</li>
                        <li>• Alinhar expectativas entre gestores e colaboradores</li>
                        <li>• Identificar áreas de desenvolvimento</li>
                        <li>• Reconhecer e recompensar excelência</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Benefícios</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Melhoria contínua de performance</li>
                        <li>• Desenvolvimento de talentos</li>
                        <li>• Decisões baseadas em dados</li>
                        <li>• Cultura de feedback e crescimento</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Dicas e Boas Práticas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="text-xl">💡</span>
                      <div>
                        <p className="font-medium text-yellow-900">Prepare-se Antecipadamente</p>
                        <p className="text-sm text-yellow-800">
                          Reúna evidências e exemplos concretos antes de cada etapa do ciclo.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-xl">📝</span>
                      <div>
                        <p className="font-medium text-blue-900">Seja Específico</p>
                        <p className="text-sm text-blue-800">
                          Use exemplos concretos e dados mensuráveis ao fornecer feedback.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-xl">🤝</span>
                      <div>
                        <p className="font-medium text-green-900">Colaboração</p>
                        <p className="text-sm text-green-800">
                          Encoraje diálogo aberto e construtivo entre todas as partes envolvidas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {!selectedTemplate && templates.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando guias...</p>
            </div>
          </Card>
        )}
      </div>
    </ModuleLayout>
  );
};

