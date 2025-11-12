import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Select } from '../../../components/common/Select';
import { useRecruitment } from '../../../hooks/useRecruitment';

export const Pipeline: React.FC = () => {
  const { jobs, loading, error, getPipeline } = useRecruitment();
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [pipelineData, setPipelineData] = useState<Record<string, any> | null>(null);
  const [loadingPipeline, setLoadingPipeline] = useState(false);

  useEffect(() => {
    loadPipeline();
  }, [selectedJob]);

  const loadPipeline = async () => {
    setLoadingPipeline(true);
    try {
      const data = await getPipeline(selectedJob);
      setPipelineData(data);
    } catch (err) {
    } finally {
      setLoadingPipeline(false);
    }
  };

  const jobOptions = [
    { value: '', label: 'Todas as vagas' },
    ...jobs.map((job) => ({
      value: job.id,
      label: job.title,
    })),
  ];

  const stages = [
    { id: 'new', label: 'Novos', color: 'bg-blue-100 border-blue-300' },
    { id: 'screening', label: 'Triagem', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'interview', label: 'Entrevista', color: 'bg-purple-100 border-purple-300' },
    { id: 'offer', label: 'Oferta', color: 'bg-green-100 border-green-300' },
    { id: 'hired', label: 'Contratado', color: 'bg-emerald-100 border-emerald-300' },
  ];

  if (loading) {
    return (
      <ModuleLayout moduleId="recruitment">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="recruitment">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="recruitment">
      <div className="space-y-6">
        <PageHeader
          title="Pipeline de Recrutamento"
          subtitle="Visualize o progresso dos candidatos no processo seletivo"
        />

        <Card>
          <div className="p-4">
            <Select
              label="Filtrar por Vaga"
              options={jobOptions}
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            />
          </div>
        </Card>

        {loadingPipeline ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stages.map((stage) => (
              <Card key={stage.id} className={`border-2 ${stage.color}`}>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{stage.label}</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {pipelineData?.[stage.id]?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">candidatos</p>

                  {pipelineData?.[stage.id] && pipelineData[stage.id].length > 0 && (
                    <div className="mt-4 space-y-2">
                      {pipelineData[stage.id].slice(0, 3).map((candidate: any) => (
                        <div
                          key={candidate.id}
                          className="p-2 bg-white rounded border border-gray-200 text-sm"
                        >
                          <p className="font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-xs text-gray-500">{candidate.email}</p>
                        </div>
                      ))}
                      {pipelineData[stage.id].length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{pipelineData[stage.id].length - 3} mais
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

