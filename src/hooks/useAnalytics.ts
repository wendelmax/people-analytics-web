import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsOverview, PerformanceTrend } from '../types';

export const useAnalytics = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getOverview();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeAnalytics = async (employeeId: string) => {
    return await analyticsService.getEmployeeAnalytics(employeeId);
  };

  const getPerformanceTrend = async (startDate: string, endDate: string) => {
    return await analyticsService.getPerformanceTrend(startDate, endDate);
  };

  return {
    overview,
    loading,
    error,
    refetch: fetchOverview,
    getEmployeeAnalytics,
    getPerformanceTrend,
  };
};

