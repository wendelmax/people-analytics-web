import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { PredictiveAnalytics } from '../types';

export const usePredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState<PredictiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getPredictiveAnalytics();
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar analytics preditivos');
    } finally {
      setLoading(false);
    }
  };

  return {
    predictions,
    loading,
    error,
    refresh: fetchPredictions,
  };
};

