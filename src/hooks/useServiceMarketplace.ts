import { useState, useEffect } from 'react';
import { ServiceRequest, ServiceProposal, ServiceBooking, CreateServiceRequestDto, CreateServiceProposalDto, CreateBookingDto } from '../types';
import { mockServiceRequests, mockServiceProposals, mockServiceBookings } from '../api/mockData';

export const useServiceRequests = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      setRequests([...mockServiceRequests]);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (data: CreateServiceRequestDto) => {
    const newRequest: ServiceRequest = {
      id: Math.random().toString(36).substring(7),
      ...data,
      status: 'OPEN' as any,
      createdBy: '1',
      createdByName: 'João Silva',
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockServiceRequests.unshift(newRequest);
    setRequests([...mockServiceRequests]);
    return newRequest;
  };

  const getRequest = (id: string) => {
    return mockServiceRequests.find(r => r.id === id);
  };

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    getRequest,
  };
};

export const useServiceProposals = (requestId?: string) => {
  const [proposals, setProposals] = useState<ServiceProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProposals();
  }, [requestId]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      const filtered = requestId 
        ? mockServiceProposals.filter(p => p.serviceRequestId === requestId)
        : mockServiceProposals;
      setProposals(filtered);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (data: CreateServiceProposalDto) => {
    const newProposal: ServiceProposal = {
      id: Math.random().toString(36).substring(7),
      ...data,
      status: 'SUBMITTED' as any,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockServiceProposals.push(newProposal);
    setProposals([...mockServiceProposals.filter(p => p.serviceRequestId === data.serviceRequestId)]);
    return newProposal;
  };

  return {
    proposals,
    loading,
    error,
    refetch: fetchProposals,
    createProposal,
  };
};

export const useServiceBookings = () => {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookings(mockServiceBookings);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (data: CreateBookingDto) => {
    const newBooking: ServiceBooking = {
      id: Math.random().toString(36).substring(7),
      ...data,
      duration: 60,
      status: 'SCHEDULED' as any,
      createdBy: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockServiceBookings.push(newBooking);
    setBookings([...mockServiceBookings]);
    return newBooking;
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
  };
};

