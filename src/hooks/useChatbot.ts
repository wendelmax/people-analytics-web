import { useState } from 'react';
import { chatbotService } from '../services/chatbotService';
import { ChatbotMessage } from '../types';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, context?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatbotService.interact(message, context);
      setMessages([...messages, response]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzePerformance = async (employeeId: string, detailLevel?: string) => {
    try {
      setLoading(true);
      setError(null);
      return await chatbotService.analyzePerformance(employeeId, detailLevel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar performance';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    analyzePerformance,
    clearMessages,
  };
};

