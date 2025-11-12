import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';
import { Goal, CreateGoalDto, UpdateGoalDto } from '../types';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    const data = await goalService.getAll();
    setGoals(data);
    setLoading(false);
  };

  const createGoal = async (data: CreateGoalDto) => {
    const newGoal = await goalService.create(data);
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const updateGoal = async (id: string, data: UpdateGoalDto) => {
    const updated = await goalService.update(id, data);
    setGoals(goals.map((goal) => (goal.id === id ? updated : goal)));
    return updated;
  };

  const deleteGoal = async (id: string) => {
    await goalService.delete(id);
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};


