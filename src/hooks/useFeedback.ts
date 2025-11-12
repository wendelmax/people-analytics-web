import { useState, useEffect } from 'react';
import { feedbackService } from '../services/feedbackService';
import { Feedback, CreateFeedbackDto, UpdateFeedbackDto } from '../types';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getAll();
      setFeedbacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const createFeedback = async (data: CreateFeedbackDto) => {
    try {
      const newFeedback = await feedbackService.create(data);
      setFeedbacks([...feedbacks, newFeedback]);
      return newFeedback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar feedback');
      throw err;
    }
  };

  const updateFeedback = async (id: string, data: UpdateFeedbackDto) => {
    try {
      const updated = await feedbackService.update(id, data);
      setFeedbacks(feedbacks.map((feedback) => (feedback.id === id ? updated : feedback)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar feedback');
      throw err;
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      await feedbackService.delete(id);
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar feedback');
      throw err;
    }
  };

  return {
    feedbacks,
    loading,
    error,
    refetch: fetchFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  };
};


