import { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import {
  LeaveType,
  LeaveRequest,
  LeaveBalance,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
} from '../types';

export const useLeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      setLoading(true);
      const types = await leaveService.getLeaveTypes();
      setLeaveTypes(types);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { leaveTypes, loading, error, refetch: loadLeaveTypes };
};

export const useMyLeaves = (status?: string) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadLeaves();
  }, [status]);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getMyLeaves(status);
      setLeaves(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createLeave = async (data: CreateLeaveRequestDto) => {
    const newLeave = await leaveService.createRequest(data);
    await loadLeaves();
    return newLeave;
  };

  const updateLeave = async (id: string, data: UpdateLeaveRequestDto) => {
    const updated = await leaveService.updateRequest(id, data);
    await loadLeaves();
    return updated;
  };

  const cancelLeave = async (id: string) => {
    await leaveService.cancelRequest(id);
    await loadLeaves();
  };

  return {
    leaves,
    loading,
    error,
    createLeave,
    updateLeave,
    cancelLeave,
    refetch: loadLeaves,
  };
};

export const useMyLeaveBalances = (year?: number) => {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadBalances();
  }, [year]);

  const loadBalances = async () => {
    setLoading(true);
    const data = await leaveService.getMyBalances(year);
    setBalances(data);
    setError(null);
    setLoading(false);
  };

  return { balances, loading, error, refetch: loadBalances };
};

export const useLeaveRequests = (status?: string) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadRequests();
  }, [status]);

  const loadRequests = async () => {
    setLoading(true);
    const data = await leaveService.getRequests(status);
    setRequests(data);
    setError(null);
    setLoading(false);
  };

  const approveRequest = async (id: string, notes?: string) => {
    const approved = await leaveService.approveRequest(id, notes);
    await loadRequests();
    return approved;
  };

  const rejectRequest = async (id: string, rejectedReason: string) => {
    const rejected = await leaveService.rejectRequest(id, rejectedReason);
    await loadRequests();
    return rejected;
  };

  return {
    requests,
    loading,
    error,
    approveRequest,
    rejectRequest,
    refetch: loadRequests,
  };
};

export const useLeaves = () => {
  const myLeavesHook = useMyLeaves();
  return {
    myLeaves: myLeavesHook.leaves,
    loading: myLeavesHook.loading,
    error: myLeavesHook.error,
    createLeave: myLeavesHook.createLeave,
    updateLeave: myLeavesHook.updateLeave,
    cancelLeave: myLeavesHook.cancelLeave,
    refetch: myLeavesHook.refetch,
  };
};

