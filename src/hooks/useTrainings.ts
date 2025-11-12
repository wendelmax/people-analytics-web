import { useState, useEffect } from 'react';
import { trainingService } from '../services/trainingService';
import { Training, CreateTrainingDto, UpdateTrainingDto } from '../types';

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    const data = await trainingService.getAll();
    setTrainings(data);
    setLoading(false);
  };

  const createTraining = async (data: CreateTrainingDto) => {
    const newTraining = await trainingService.create(data);
    setTrainings([...trainings, newTraining]);
    return newTraining;
  };

  const updateTraining = async (id: string, data: UpdateTrainingDto) => {
    const updated = await trainingService.update(id, data);
    setTrainings(trainings.map((training) => (training.id === id ? updated : training)));
    return updated;
  };

  const deleteTraining = async (id: string) => {
    await trainingService.delete(id);
    setTrainings(trainings.filter((training) => training.id !== id));
  };

  return {
    trainings,
    loading,
    error,
    refetch: fetchTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
  };
};


