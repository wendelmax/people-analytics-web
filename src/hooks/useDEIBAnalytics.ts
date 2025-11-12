import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { DEIBAnalytics } from '../types';

export const useDEIBAnalytics = () => {
  const [deibData, setDeibData] = useState<DEIBAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDEIBData();
  }, []);

  const fetchDEIBData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getDEIBAnalytics();
      setDeibData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados DEIB');
    } finally {
      setLoading(false);
    }
  };

  return {
    deibData,
    loading,
    error,
    refetch: fetchDEIBData,
  };
};

