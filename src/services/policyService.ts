import apiClient from '../api/client';
import { PolicyDocument, PolicyAcknowledgment, CreatePolicyDto, UpdatePolicyDto } from '../types';

export const policyService = {
  getAll: async (): Promise<PolicyDocument[]> => {
    const response = await apiClient.get('/policies');
    return response.data;
  },

  getById: async (id: string): Promise<PolicyDocument> => {
    const response = await apiClient.get(`/policies/${id}`);
    return response.data;
  },

  create: async (data: CreatePolicyDto): Promise<PolicyDocument> => {
    const response = await apiClient.post('/policies', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePolicyDto): Promise<PolicyDocument> => {
    const response = await apiClient.patch(`/policies/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/policies/${id}`);
  },

  acknowledgePolicy: async (policyId: string): Promise<PolicyAcknowledgment> => {
    const response = await apiClient.post(`/policies/${policyId}/acknowledge`);
    return response.data;
  },

  getAcknowledgments: async (policyId: string): Promise<PolicyAcknowledgment[]> => {
    const response = await apiClient.get(`/policies/${policyId}/acknowledgments`);
    return response.data;
  },

  getMyAcknowledgments: async (): Promise<PolicyAcknowledgment[]> => {
    const response = await apiClient.get('/policies/my/acknowledgments');
    return response.data;
  },
};

