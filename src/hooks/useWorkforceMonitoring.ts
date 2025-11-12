import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { WorkforceMonitoring } from '../types';

export const useWorkforceMonitoring = () => {
  const [workforceData, setWorkforceData] = useState<WorkforceMonitoring | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkforceData();
  }, []);

  const fetchWorkforceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getWorkforceMonitoring();
      setWorkforceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de workforce');
    } finally {
      setLoading(false);
    }
  };

  return {
    workforceData,
    loading,
    error,
    refresh: fetchWorkforceData,
  };
};

