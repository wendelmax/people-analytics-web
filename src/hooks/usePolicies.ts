import { useState, useEffect } from 'react';
import { policyService } from '../services/policyService';
import { PolicyDocument, PolicyAcknowledgment, CreatePolicyDto, UpdatePolicyDto } from '../types';

export const usePolicies = () => {
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await policyService.getAll();
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar políticas');
    } finally {
      setLoading(false);
    }
  };

  const createPolicy = async (data: CreatePolicyDto) => {
    const newPolicy = await policyService.create(data);
    setPolicies([...policies, newPolicy]);
    return newPolicy;
  };

  const updatePolicy = async (id: string, data: UpdatePolicyDto) => {
    const updated = await policyService.update(id, data);
    setPolicies(policies.map((policy) => (policy.id === id ? updated : policy)));
    return updated;
  };

  const deletePolicy = async (id: string) => {
    await policyService.delete(id);
    setPolicies(policies.filter((policy) => policy.id !== id));
  };

  const acknowledgePolicy = async (policyId: string) => {
    await policyService.acknowledgePolicy(policyId);
    // Optionally update the policy status or acknowledgment count
  };

  return {
    policies,
    loading,
    error,
    refetch: fetchPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    acknowledgePolicy,
  };
};

export const usePolicy = (id: string | undefined) => {
  const [policy, setPolicy] = useState<PolicyDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPolicy();
    }
  }, [id]);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await policyService.getById(id!);
      setPolicy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar política');
    } finally {
      setLoading(false);
    }
  };

  return { policy, loading, error, refetch: fetchPolicy };
};

export const usePolicyAcknowledgments = (policyId: string | undefined) => {
  const [acknowledgments, setAcknowledgments] = useState<PolicyAcknowledgment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (policyId) {
      fetchAcknowledgments();
    }
  }, [policyId]);

  const fetchAcknowledgments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await policyService.getAcknowledgments(policyId!);
      setAcknowledgments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar aceites');
    } finally {
      setLoading(false);
    }
  };

  return { acknowledgments, loading, error, refetch: fetchAcknowledgments };
};


