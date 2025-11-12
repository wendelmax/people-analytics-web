import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { Badge } from '../../../components/common/Badge';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useRecruitment } from '../../../hooks/useRecruitment';
import { PipelineStage, PipelineConfig } from '../../../services/recruitmentService';
import { useForm } from 'react-hook-form';

interface StageFormData {
  name: string;
  description: string;
  color: string;
}

export const PipelineConfig: React.FC = () => {
  const { jobs } = useRecruitment();
  const [configs, setConfigs] = useState<PipelineConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<PipelineConfig | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerConfig,
    handleSubmit: handleSubmitConfig,
    formState: { errors: configErrors },
    reset: resetConfig,
  } = useForm<{ name: string; description?: string }>();

  const {
    register: registerStage,
    handleSubmit: handleSubmitStage,
    formState: { errors: stageErrors },
    reset: resetStage,
    setValue: setStageValue,
  } = useForm<StageFormData>();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const defaultConfig: PipelineConfig = {
        id: 'default',
        name: 'Pipeline Padrão',
        description: 'Configuração padrão do pipeline de recrutamento',
        stages: [
          {
            id: 'new',
            name: 'Novos',
            description: 'Candidatos que acabaram de se inscrever',
            order: 1,
            color: 'bg-blue-100 border-blue-300',
            isActive: true,
          },
          {
            id: 'screening',
            name: 'Triagem',
            description: 'Análise inicial de currículos',
            order: 2,
            color: 'bg-yellow-100 border-yellow-300',
            isActive: true,
          },
          {
            id: 'interview',
            name: 'Entrevista',
            description: 'Entrevistas técnicas e comportamentais',
            order: 3,
            color: 'bg-purple-100 border-purple-300',
            isActive: true,
          },
          {
            id: 'offer',
            name: 'Oferta',
            description: 'Proposta enviada ao candidato',
            order: 4,
            color: 'bg-green-100 border-green-300',
            isActive: true,
          },
          {
            id: 'hired',
            name: 'Contratado',
            description: 'Candidato aceitou a oferta',
            order: 5,
            color: 'bg-emerald-100 border-emerald-300',
            isActive: true,
          },
        ],
        defaultStages: ['new', 'screening', 'interview', 'offer', 'hired'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConfigs([defaultConfig]);
      setSelectedConfig(defaultConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfig = async (data: { name: string; description?: string }) => {
    try {
      const newConfig: PipelineConfig = {
        id: `config-${Date.now()}`,
        name: data.name,
        description: data.description,
        stages: [],
        defaultStages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConfigs([...configs, newConfig]);
      setSelectedConfig(newConfig);
      setIsConfigModalOpen(false);
      resetConfig();
    } catch (err) {
      alert('Erro ao criar configuração');
    }
  };

  const handleEditStage = (stage: PipelineStage) => {
    setEditingStage(stage);
    setStageValue('name', stage.name);
    setStageValue('description', stage.description);
    setStageValue('color', stage.color);
    setIsStageModalOpen(true);
  };

  const handleSaveStage = async (data: StageFormData) => {
    if (!selectedConfig) return;

    try {
      const updatedStages = editingStage
        ? selectedConfig.stages.map((s) =>
            s.id === editingStage.id
              ? { ...s, name: data.name, description: data.description, color: data.color }
              : s
          )
        : [
            ...selectedConfig.stages,
            {
              id: `stage-${Date.now()}`,
              name: data.name,
              description: data.description,
              order: selectedConfig.stages.length + 1,
              color: data.color,
              isActive: true,
            },
          ];

      const updatedConfig: PipelineConfig = {
        ...selectedConfig,
        stages: updatedStages,
        updatedAt: new Date().toISOString(),
      };

      setConfigs(configs.map((c) => (c.id === selectedConfig.id ? updatedConfig : c)));
      setSelectedConfig(updatedConfig);
      setIsStageModalOpen(false);
      setEditingStage(null);
      resetStage();
    } catch (err) {
      alert('Erro ao salvar estágio');
    }
  };

  const handleDeleteStage = (stageId: string) => {
    if (!selectedConfig) return;
    if (!window.confirm('Tem certeza que deseja remover este estágio?')) return;

    const updatedStages = selectedConfig.stages
      .filter((s) => s.id !== stageId)
      .map((s, index) => ({ ...s, order: index + 1 }));

    const updatedConfig: PipelineConfig = {
      ...selectedConfig,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    };

    setConfigs(configs.map((c) => (c.id === selectedConfig.id ? updatedConfig : c)));
    setSelectedConfig(updatedConfig);
  };

  const handleMoveStage = (stageId: string, direction: 'up' | 'down') => {
    if (!selectedConfig) return;

    const stages = [...selectedConfig.stages];
    const currentIndex = stages.findIndex((s) => s.id === stageId);

    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === stages.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [stages[currentIndex], stages[newIndex]] = [stages[newIndex], stages[currentIndex]];

    const updatedStages = stages.map((s, index) => ({ ...s, order: index + 1 }));

    const updatedConfig: PipelineConfig = {
      ...selectedConfig,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    };

    setConfigs(configs.map((c) => (c.id === selectedConfig.id ? updatedConfig : c)));
    setSelectedConfig(updatedConfig);
  };

  const handleToggleStage = (stageId: string) => {
    if (!selectedConfig) return;

    const updatedStages = selectedConfig.stages.map((s) =>
      s.id === stageId ? { ...s, isActive: !s.isActive } : s
    );

    const updatedConfig: PipelineConfig = {
      ...selectedConfig,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    };

    setConfigs(configs.map((c) => (c.id === selectedConfig.id ? updatedConfig : c)));
    setSelectedConfig(updatedConfig);
  };

  if (loading) {
    return (
      <AdminLayout moduleId="recruitment">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout moduleId="recruitment">
        <ErrorMessage message={error} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout moduleId="recruitment">
      <div className="space-y-6">
        <PageHeader
          title="Configuração de Pipeline"
          subtitle="Configure os estágios do processo de recrutamento"
          actions={[
            {
              label: 'Nova Configuração',
              onClick: () => {
                resetConfig();
                setIsConfigModalOpen(true);
              },
              variant: 'primary',
              icon: '➕',
            },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Configurações</h3>
                <div className="space-y-2">
                  {configs.map((config) => (
                    <button
                      key={config.id}
                      onClick={() => setSelectedConfig(config)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedConfig?.id === config.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{config.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.stages.length} estágios
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedConfig ? (
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedConfig.name}</h3>
                      {selectedConfig.description && (
                        <p className="text-sm text-gray-600 mt-1">{selectedConfig.description}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        setEditingStage(null);
                        resetStage();
                        setIsStageModalOpen(true);
                      }}
                      variant="primary"
                    >
                      Adicionar Estágio
                    </Button>
                  </div>

                  {selectedConfig.stages.length === 0 ? (
                    <EmptyState
                      title="Nenhum estágio configurado"
                      message="Adicione estágios para começar a configurar o pipeline"
                    />
                  ) : (
                    <div className="space-y-3">
                      {selectedConfig.stages
                        .sort((a, b) => a.order - b.order)
                        .map((stage, index) => (
                          <div
                            key={stage.id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              stage.isActive
                                ? stage.color
                                : 'bg-gray-100 border-gray-300 opacity-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => handleMoveStage(stage.id, 'up')}
                                    disabled={index === 0}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Mover para cima"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    onClick={() => handleMoveStage(stage.id, 'down')}
                                    disabled={index === selectedConfig.stages.length - 1}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Mover para baixo"
                                  >
                                    ↓
                                  </button>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900">{stage.name}</h4>
                                    <Badge variant={stage.isActive ? 'success' : 'secondary'}>
                                      {stage.isActive ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">Ordem: {stage.order}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStage(stage.id)}
                                >
                                  {stage.isActive ? 'Desativar' : 'Ativar'}
                                </Button>
                                <Button size="sm" onClick={() => handleEditStage(stage)}>
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeleteStage(stage.id)}
                                >
                                  Remover
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="p-6">
                  <EmptyState
                    title="Nenhuma configuração selecionada"
                    message="Selecione uma configuração ou crie uma nova"
                  />
                </div>
              </Card>
            )}
          </div>
        </div>

        <Modal
          isOpen={isConfigModalOpen}
          onClose={() => {
            setIsConfigModalOpen(false);
            resetConfig();
          }}
          title="Nova Configuração de Pipeline"
        >
          <form onSubmit={handleSubmitConfig(handleCreateConfig)} className="space-y-4">
            <Input
              label="Nome da Configuração"
              {...registerConfig('name', { required: 'Nome é obrigatório' })}
              error={configErrors.name?.message}
            />
            <Input
              label="Descrição"
              {...registerConfig('description')}
              error={configErrors.description?.message}
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                Criar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsConfigModalOpen(false);
                  resetConfig();
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isStageModalOpen}
          onClose={() => {
            setIsStageModalOpen(false);
            setEditingStage(null);
            resetStage();
          }}
          title={editingStage ? 'Editar Estágio' : 'Novo Estágio'}
        >
          <form onSubmit={handleSubmitStage(handleSaveStage)} className="space-y-4">
            <Input
              label="Nome do Estágio"
              {...registerStage('name', { required: 'Nome é obrigatório' })}
              error={stageErrors.name?.message}
            />
            <Input
              label="Descrição"
              {...registerStage('description', { required: 'Descrição é obrigatória' })}
              error={stageErrors.description?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
              <select
                {...registerStage('color', { required: 'Cor é obrigatória' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bg-blue-100 border-blue-300">Azul</option>
                <option value="bg-yellow-100 border-yellow-300">Amarelo</option>
                <option value="bg-purple-100 border-purple-300">Roxo</option>
                <option value="bg-green-100 border-green-300">Verde</option>
                <option value="bg-emerald-100 border-emerald-300">Verde Esmeralda</option>
                <option value="bg-red-100 border-red-300">Vermelho</option>
                <option value="bg-orange-100 border-orange-300">Laranja</option>
                <option value="bg-pink-100 border-pink-300">Rosa</option>
              </select>
              {stageErrors.color && (
                <p className="text-red-500 text-sm mt-1">{stageErrors.color.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                {editingStage ? 'Salvar' : 'Adicionar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsStageModalOpen(false);
                  setEditingStage(null);
                  resetStage();
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};
