import { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import { LeaveRequest, CreateLeaveRequestDto, UpdateLeaveRequestDto } from '../types';

export const useLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    const data = await leaveService.getRequests();
    setRequests(data);
    setLoading(false);
  };

  const createRequest = async (data: CreateLeaveRequestDto) => {
    const newRequest = await leaveService.create(data);
    setRequests([...requests, newRequest]);
    return newRequest;
  };

  const updateRequest = async (id: string, data: UpdateLeaveRequestDto) => {
    const updated = await leaveService.update(id, data);
    setRequests(requests.map((req) => (req.id === id ? updated : req)));
    return updated;
  };

  const deleteRequest = async (id: string) => {
    await leaveService.delete(id);
    setRequests(requests.filter((req) => req.id !== id));
  };

  const approveRequest = async (id: string) => {
    const updated = await leaveService.approve(id);
    setRequests(requests.map((req) => (req.id === id ? updated : req)));
  };

  const rejectRequest = async (id: string) => {
    const updated = await leaveService.reject(id);
    setRequests(requests.map((req) => (req.id === id ? updated : req)));
  };

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    rejectRequest,
  };
};
