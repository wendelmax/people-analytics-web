import { useState, useEffect } from 'react';
import { payrollService } from '../services/payrollService';
import { Payroll, CreatePayrollDto, UpdatePayrollDto } from '../types';

export const usePayroll = (period?: string) => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayrolls();
  }, [period]);

  const fetchPayrolls = async () => {
    
  };

  const updatePayroll = async (id: string, data: UpdatePayrollDto) => {
    
  };

  const processPeriod = async (period: string) => {
    
  };

  return {
    payrolls,
    loading,
    error,
    refetch: fetchPayrolls,
    createPayroll,
    updatePayroll,
    processPeriod,
  };
};

export const useMyPayslips = () => {
  const [payslips, setPayslips] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyPayslips();
  }, []);

  const fetchMyPayslips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payrollService.getMyPayslips();
      setPayslips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar holerites');
    } finally {
      setLoading(false);
    }
  };

  return { payslips, loading, error, refetch: fetchMyPayslips };
};


