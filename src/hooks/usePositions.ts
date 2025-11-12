import { useState, useEffect } from 'react';
import { positionService } from '../services/positionService';
import { Position, CreatePositionDto, UpdatePositionDto } from '../types';

export const usePositions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    setError(null);
    const data = await positionService.getAll();
    setPositions(data);
    setLoading(false);
  };

  const createPosition = async (data: CreatePositionDto) => {
    const newPosition = await positionService.create(data);
    setPositions([...positions, newPosition]);
    return newPosition;
  };

  const updatePosition = async (id: string, data: UpdatePositionDto) => {
    const updated = await positionService.update(id, data);
    setPositions(positions.map((pos) => (pos.id === id ? updated : pos)));
    return updated;
  };

  const deletePosition = async (id: string) => {
    await positionService.delete(id);
    setPositions(positions.filter((pos) => pos.id !== id));
  };

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
  };
};


