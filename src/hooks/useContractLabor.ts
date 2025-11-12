import { useState, useEffect } from 'react';
import { contractLaborService } from '../services/contractLaborService';
import { Contractor, ContractLabor, CreateContractorDto, UpdateContractorDto, CreateContractLaborDto, UpdateContractLaborDto, ContractLaborAttendance } from '../types';

export const useContractors = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractLaborService.getContractors();
      setContractors(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar contratados');
    } finally {
      setLoading(false);
    }
  };

  const createContractor = async (data: CreateContractorDto) => {
    const newContractor = await contractLaborService.createContractor(data);
    setContractors([...contractors, newContractor]);
    return newContractor;
  };

  const updateContractor = async (id: string, data: UpdateContractorDto) => {
    const updated = await contractLaborService.updateContractor(id, data);
    setContractors(contractors.map((contractor) => (contractor.id === id ? updated : contractor)));
    return updated;
  };

  const deleteContractor = async (id: string) => {
    await contractLaborService.deleteContractor(id);
    setContractors(contractors.filter((contractor) => contractor.id !== id));
  };

  return {
    contractors,
    loading,
    error,
    refetch: fetchContractors,
    createContractor,
    updateContractor,
    deleteContractor,
  };
};

export const useContractLabor = () => {
  const [labor, setLabor] = useState<ContractLabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLabor();
  }, []);

  const fetchLabor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractLaborService.getAll();
      setLabor(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar mão de obra');
    } finally {
      setLoading(false);
    }
  };

  const createLabor = async (data: CreateContractLaborDto) => {
    const newLabor = await contractLaborService.create(data);
    setLabor([...labor, newLabor]);
    return newLabor;
  };

  const updateLabor = async (id: string, data: UpdateContractLaborDto) => {
    const updated = await contractLaborService.update(id, data);
    setLabor(labor.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteLabor = async (id: string) => {
    await contractLaborService.delete(id);
    setLabor(labor.filter((item) => item.id !== id));
  };

  return {
    labor,
    loading,
    error,
    refetch: fetchLabor,
    createLabor,
    updateLabor,
    deleteLabor,
  };
};

export const useContractLaborAttendance = (laborId: string | undefined, startDate?: string, endDate?: string) => {
  const [attendance, setAttendance] = useState<ContractLaborAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (laborId) {
      fetchAttendance();
    }
  }, [laborId, startDate, endDate]);

  const fetchAttendance = async () => {
    if (!laborId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await contractLaborService.getAttendance(laborId, startDate, endDate);
      setAttendance(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar presença');
    } finally {
      setLoading(false);
    }
  };

  const recordAttendance = async (data: Omit<ContractLaborAttendance, 'id' | 'laborId'>) => {
    if (!laborId) throw new Error('laborId é obrigatório');
    const recorded = await contractLaborService.recordAttendance(laborId, data);
    setAttendance([...attendance, recorded]);
    return recorded;
  };

  return { attendance, loading, error, refetch: fetchAttendance, recordAttendance };
};


