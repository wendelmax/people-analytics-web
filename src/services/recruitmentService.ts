import apiClient from '../api/client';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  description: string;
  requirements: string[];
  postedAt: string;
  closedAt?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  status: string;
  appliedAt: string;
  jobId: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  appliedAt: string;
  notes?: string;
}

export interface CreateJobDto {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  status?: string;
}

export interface CreateCandidateDto {
  name: string;
  email: string;
  phone?: string;
  resume?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  order: number;
  color: string;
  isActive: boolean;
  requiredFields?: string[];
  autoAdvanceRules?: {
    condition: string;
    nextStage: string;
  }[];
}

export interface PipelineConfig {
  id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  defaultStages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePipelineConfigDto {
  name: string;
  description?: string;
  stages: Omit<PipelineStage, 'id'>[];
  defaultStages?: string[];
}

export interface InitializePipelineDto {
  jobId: string;
  pipelineConfigId?: string;
  initialStage?: string;
}

export const recruitmentService = {
  getJobs: async (): Promise<Job[]> => {
    return await apiClient.get('/recruitment/jobs');
  },

  getJobById: async (id: string): Promise<Job> => {
    return await apiClient.get(`/recruitment/jobs/${id}`);
  },

  createJob: async (data: CreateJobDto): Promise<Job> => {
    return await apiClient.post('/recruitment/jobs', data);
  },

  updateJob: async (id: string, data: UpdateJobDto): Promise<Job> => {
    return await apiClient.patch(`/recruitment/jobs/${id}`, data);
  },

  deleteJob: async (id: string): Promise<void> => {
    await apiClient.delete(`/recruitment/jobs/${id}`);
  },

  getCandidates: async (jobId?: string): Promise<Candidate[]> => {
    const params = jobId ? { jobId } : {};
    return await apiClient.get('/recruitment/candidates', { params });
  },

  getCandidateById: async (id: string): Promise<Candidate> => {
    return await apiClient.get(`/recruitment/candidates/${id}`);
  },

  createCandidate: async (data: CreateCandidateDto): Promise<Candidate> => {
    return await apiClient.post('/recruitment/candidates', data);
  },

  updateCandidate: async (id: string, data: Partial<CreateCandidateDto>): Promise<Candidate> => {
    return await apiClient.patch(`/recruitment/candidates/${id}`, data);
  },

  getApplications: async (jobId?: string): Promise<Application[]> => {
    const params = jobId ? { jobId } : {};
    return await apiClient.get('/recruitment/applications', { params });
  },

  getMyApplications: async (): Promise<Application[]> => {
    return await apiClient.get('/recruitment/my/applications');
  },

  submitApplication: async (jobId: string, data: { resume?: string; coverLetter?: string }): Promise<Application> => {
    return await apiClient.post(`/recruitment/jobs/${jobId}/apply`, data);
  },

  getPipeline: async (jobId?: string): Promise<Record<string, unknown>> => {
    const params = jobId ? { jobId } : {};
    const response = await apiClient.get<Record<string, unknown>>('/recruitment/pipeline', { params });
    return response.data;
  },

  getPipelineConfigs: async (): Promise<PipelineConfig[]> => {
    return await apiClient.get('/recruitment/pipeline/configs');
  },

  getPipelineConfigById: async (id: string): Promise<PipelineConfig> => {
    return await apiClient.get(`/recruitment/pipeline/configs/${id}`);
  },

  createPipelineConfig: async (data: CreatePipelineConfigDto): Promise<PipelineConfig> => {
    return await apiClient.post('/recruitment/pipeline/configs', data);
  },

  updatePipelineConfig: async (id: string, data: Partial<CreatePipelineConfigDto>): Promise<PipelineConfig> => {
    return await apiClient.patch(`/recruitment/pipeline/configs/${id}`, data);
  },

  deletePipelineConfig: async (id: string): Promise<void> => {
    await apiClient.delete(`/recruitment/pipeline/configs/${id}`);
  },

  initializePipeline: async (data: InitializePipelineDto): Promise<{ success: boolean; message: string }> => {
    return await apiClient.post('/recruitment/pipeline/initialize', data);
  },
};

