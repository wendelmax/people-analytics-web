import { useState, useEffect } from 'react';
import { employeeSelfService } from '../services/employeeSelfService';
import { DashboardData } from '../types';

export const useEmployeeDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await employeeSelfService.getMyDashboard();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: loadDashboard };
};

