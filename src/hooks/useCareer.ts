import { useState } from 'react';
import { careerService } from '../services/careerService';

export const useCareer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOverview = async (employeeId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await careerService.getOverview(employeeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar overview de carreira';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProgression = async (employeeId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await careerService.getProgression(employeeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar progressão de carreira';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getOverview,
    getProgression,
  };
};

