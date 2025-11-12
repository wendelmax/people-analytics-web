import apiClient from '../api/client';
import { ChatbotMessage } from '../types';

export const chatbotService = {
  interact: async (message: string, context?: string): Promise<ChatbotMessage> => {
    const url = context
      ? `/chatbot/interact?context=${encodeURIComponent(context)}`
      : '/chatbot/interact';
    const response = await apiClient.post(url, { message });
    return response.data;
  },

  analyzePerformance: async (employeeId: string, detailLevel?: string): Promise<Record<string, unknown>> => {
    const url = detailLevel
      ? `/chatbot/analyze-performance?employeeId=${employeeId}&detailLevel=${detailLevel}`
      : `/chatbot/analyze-performance?employeeId=${employeeId}`;
    const response = await apiClient.post(url, {});
    return response.data;
  },
};

