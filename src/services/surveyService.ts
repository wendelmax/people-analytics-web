import apiClient from '../api/client';
import { Survey, SurveyResponse, CreateSurveyDto, UpdateSurveyDto, SubmitSurveyResponseDto } from '../types';

export const surveyService = {
  getAll: async (): Promise<Survey[]> => {
    return await apiClient.get('/surveys');
  },

  getById: async (id: string): Promise<Survey> => {
    return await apiClient.get(`/surveys/${id}`);
  },

  create: async (data: CreateSurveyDto): Promise<Survey> => {
    return await apiClient.post('/surveys', data);
  },

  update: async (id: string, data: UpdateSurveyDto): Promise<Survey> => {
    return await apiClient.patch(`/surveys/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/surveys/${id}`);
  },

  getAvailable: async (): Promise<Survey[]> => {
    return await apiClient.get('/surveys/available');
  },

  submitResponse: async (surveyId: string, data: SubmitSurveyResponseDto): Promise<SurveyResponse> => {
    return await apiClient.post(`/surveys/${surveyId}/responses`, data);
  },

  getMyResponses: async (): Promise<SurveyResponse[]> => {
    return await apiClient.get('/surveys/my/responses');
  },

  getResults: async (surveyId: string): Promise<Record<string, unknown>> => {
    const response = await apiClient.get<Record<string, unknown>>(`/surveys/${surveyId}/results`);
    return response.data;
  },
};

