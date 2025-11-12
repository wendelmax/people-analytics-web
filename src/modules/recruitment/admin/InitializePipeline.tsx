import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { useRecruitment } from '../../../hooks/useRecruitment';
import { recruitmentService } from '../../../services/recruitmentService';
import { useToastContext } from '../../../contexts/ToastContext';

export const InitializePipeline: React.FC = () => {
  const { jobs, refresh } = useRecruitment();
  const { success, error: showError } = useToastContext();
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedConfig, setSelectedConfig] = useState<string>('default');
  const [initialStage, setInitialStage] = useState<string>('new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jobOptions = [
    { value: '', label: 'Selecione uma vaga' },
    ...jobs
      .filter((job) => job.status === 'OPEN' || job.status === 'open')
      .map((job) => ({
        value: job.id,
        label: `${job.title} - ${job.department}`,
      })),
  ];

  const configOptions = [
    { value: 'default', label: 'Pipeline Padrão' },
  ];

  const stageOptions = [
    { value: 'new', label: 'Novos' },
    { value: 'screening', label: 'Triagem' },
    { value: 'interview', label: 'Entrevista' },
    { value: 'offer', label: 'Oferta' },
    { value: 'hired', label: 'Contratado' },
  ];

  const handleInitialize = async () => {
    if (!selectedJob) {
      showError('Selecione uma vaga');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await recruitmentService.initializePipeline({
        jobId: selectedJob,
        pipelineConfigId: selectedConfig,
        initialStage,
      });

      success('Pipeline inicializado com sucesso!');
      setSelectedJob('');
      refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inicializar pipeline';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout moduleId="recruitment">
      <div className="space-y-6">
        <PageHeader
          title="Inicializar Pipeline"
          subtitle="Configure e inicialize o pipeline de recrutamento para uma vaga"
        />

        <Card>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuração do Pipeline
              </h3>

              <div className="space-y-4">
                <Select
                  label="Vaga"
                  options={jobOptions}
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  required
                />

                <Select
                  label="Configuração de Pipeline"
                  options={configOptions}
                  value={selectedConfig}
                  onChange={(e) => setSelectedConfig(e.target.value)}
                />

                <Select
                  label="Estágio Inicial"
                  options={stageOptions}
                  value={initialStage}
                  onChange={(e) => setInitialStage(e.target.value)}
                  helpText="Estágio onde os novos candidatos serão colocados automaticamente"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <ErrorMessage message={error} />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleInitialize}
                isLoading={loading}
                disabled={!selectedJob || loading}
                variant="primary"
              >
                Inicializar Pipeline
              </Button>
              <Button
                onClick={() => {
                  setSelectedJob('');
                  setError(null);
                }}
                variant="outline"
                disabled={loading}
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>O que é inicializar o pipeline?</strong>
              </p>
              <p>
                Ao inicializar o pipeline para uma vaga, você está configurando o processo seletivo
                que será usado para gerenciar os candidatos dessa vaga. O pipeline define os
                estágios pelos quais os candidatos passarão.
              </p>
              <p className="mt-4">
                <strong>Estágio Inicial:</strong> Todos os novos candidatos que se candidatarem a
                esta vaga serão automaticamente colocados no estágio inicial selecionado.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

