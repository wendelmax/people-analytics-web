import { useState, useEffect } from 'react';
import { allocationService } from '../services/allocationService';
import {
  ProjectAllocation,
  TaskAllocation,
  CreateProjectAllocationDto,
  UpdateProjectAllocationDto,
  CreateTaskAllocationDto,
  UpdateTaskAllocationDto,
} from '../types/allocation';

export const useProjectAllocations = (projectId?: string) => {
  const [allocations, setAllocations] = useState<ProjectAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllocations();
  }, [projectId]);

  const loadAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await allocationService.getProjectAllocations(projectId);
      setAllocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alocações');
    } finally {
      setLoading(false);
    }
  };

  const createAllocation = async (data: CreateProjectAllocationDto) => {
    const newAllocation = await allocationService.createProjectAllocation(data);
    setAllocations([...allocations, newAllocation]);
    return newAllocation;
  };

  const updateAllocation = async (id: string, data: UpdateProjectAllocationDto) => {
    const updated = await allocationService.updateProjectAllocation(id, data);
    setAllocations(allocations.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteAllocation = async (id: string) => {
    await allocationService.deleteProjectAllocation(id);
    setAllocations(allocations.filter((a) => a.id !== id));
  };

  return {
    allocations,
    loading,
    error,
    refetch: loadAllocations,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  };
};

export const useTaskAllocations = (taskId?: string) => {
  const [allocations, setAllocations] = useState<TaskAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllocations();
  }, [taskId]);

  const loadAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await allocationService.getTaskAllocations(taskId);
      setAllocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alocações');
    } finally {
      setLoading(false);
    }
  };

  const createAllocation = async (data: CreateTaskAllocationDto) => {
    const newAllocation = await allocationService.createTaskAllocation(data);
    setAllocations([...allocations, newAllocation]);
    return newAllocation;
  };

  const updateAllocation = async (id: string, data: UpdateTaskAllocationDto) => {
    const updated = await allocationService.updateTaskAllocation(id, data);
    setAllocations(allocations.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteAllocation = async (id: string) => {
    await allocationService.deleteTaskAllocation(id);
    setAllocations(allocations.filter((a) => a.id !== id));
  };

  return {
    allocations,
    loading,
    error,
    refetch: loadAllocations,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  };
};

