import { useState, useEffect } from 'react';
import { separationService } from '../services/separationService';
import { Separation, CreateSeparationDto, UpdateSeparationDto } from '../types';

export const useSeparations = () => {
  const [separations, setSeparations] = useState<Separation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeparations();
  }, []);

  const fetchSeparations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await separationService.getAll();
      setSeparations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar desligamentos');
      console.error('Erro ao carregar desligamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSeparation = async (data: CreateSeparationDto) => {
    const newSeparation = await separationService.create(data);
    setSeparations([...separations, newSeparation]);
    return newSeparation;
  };

  const updateSeparation = async (id: string, data: UpdateSeparationDto) => {
    const updated = await separationService.update(id, data);
    setSeparations(separations.map((sep) => (sep.id === id ? updated : sep)));
    return updated;
  };

  const deleteSeparation = async (id: string) => {
    // Note: separationService.delete method doesn't exist, but we can filter locally
    setSeparations(separations.filter((sep) => sep.id !== id));
  };

  return {
    separations,
    loading,
    error,
    refetch: fetchSeparations,
    createSeparation,
    updateSeparation,
  };
};

export const useSeparation = (id: string | undefined) => {
  const [separation, setSeparation] = useState<Separation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSeparation();
    }
  }, [id]);

  const fetchSeparation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await separationService.getById(id!);
      setSeparation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar desligamento');
    } finally {
      setLoading(false);
    }
  };

  return { separation, loading, error, refetch: fetchSeparation };
};


