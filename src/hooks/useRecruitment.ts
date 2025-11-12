import { useState, useEffect } from 'react';
import { recruitmentService, Job, Candidate, Application, PipelineConfig, PipelineStage, CreatePipelineConfigDto, InitializePipelineDto } from '../services/recruitmentService';

export const useRecruitment = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsData, candidatesData, applicationsData, myAppsData] = await Promise.all([
        recruitmentService.getJobs(),
        recruitmentService.getCandidates(),
        recruitmentService.getApplications(),
        recruitmentService.getMyApplications(),
      ]);
      setJobs(jobsData);
      setCandidates(candidatesData);
      setApplications(applicationsData);
      setMyApplications(myAppsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de recrutamento');
    } finally {
      setLoading(false);
    }
  };

  const getJobById = async (id: string) => {
    try {
      return await recruitmentService.getJobById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vaga');
      throw err;
    }
  };

  const createJob = async (data: any) => {
    try {
      const job = await recruitmentService.createJob(data);
      setJobs((prev) => [...prev, job]);
      return job;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar vaga');
      throw err;
    }
  };

  const updateJob = async (id: string, data: any) => {
    try {
      const job = await recruitmentService.updateJob(id, data);
      setJobs((prev) => prev.map((j) => (j.id === id ? job : j)));
      return job;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar vaga');
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await recruitmentService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar vaga');
      throw err;
    }
  };

  const submitApplication = async (jobId: string, data: { resume?: string; coverLetter?: string }) => {
    try {
      const application = await recruitmentService.submitApplication(jobId, data);
      setApplications((prev) => [...prev, application]);
      setMyApplications((prev) => [...prev, application]);
      return application;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao submeter candidatura');
      throw err;
    }
  };

  const getPipeline = async (jobId?: string) => {
    try {
      return await recruitmentService.getPipeline(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pipeline');
      throw err;
    }
  };

  const getPipelineConfigs = async () => {
    try {
      return await recruitmentService.getPipelineConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
      throw err;
    }
  };

  const createPipelineConfig = async (data: CreatePipelineConfigDto) => {
    try {
      return await recruitmentService.createPipelineConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar configuração');
      throw err;
    }
  };

  const updatePipelineConfig = async (id: string, data: Partial<CreatePipelineConfigDto>) => {
    try {
      return await recruitmentService.updatePipelineConfig(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configuração');
      throw err;
    }
  };

  const initializePipeline = async (data: InitializePipelineDto) => {
    try {
      return await recruitmentService.initializePipeline(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao inicializar pipeline');
      throw err;
    }
  };

  return {
    jobs,
    candidates,
    applications,
    myApplications,
    loading,
    error,
    refresh: loadData,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    submitApplication,
    getPipeline,
    getPipelineConfigs,
    createPipelineConfig,
    updatePipelineConfig,
    initializePipeline,
  };
};

