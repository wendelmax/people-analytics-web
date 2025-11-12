import { useState, useEffect } from 'react';
import { travelService } from '../services/travelService';
import { TravelRequest, CreateTravelRequestDto, UpdateTravelRequestDto } from '../types';

export const useTravel = () => {
  const [travels, setTravels] = useState<TravelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    
  };

  const updateTravel = async (id: string, data: UpdateTravelRequestDto) => {
    
  };

  const deleteTravel = async (id: string) => {
    
  };

  return {
    travels,
    loading,
    error,
    refetch: fetchTravels,
    createTravel,
    updateTravel,
    deleteTravel,
  };
};

export const useMyTravels = () => {
  const [travels, setTravels] = useState<TravelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyTravels();
  }, []);

  const fetchMyTravels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await travelService.getMyTravels();
      setTravels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar viagens');
    } finally {
      setLoading(false);
    }
  };

  return { travels, loading, error, refetch: fetchMyTravels };
};


