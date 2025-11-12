import { useState, useEffect } from 'react';
import { performanceService } from '../services/performanceService';
import {
  PerformanceReview,
  CreatePerformanceReviewDto,
  UpdatePerformanceReviewDto,
} from '../types';

export const usePerformanceReviews = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await performanceService.getAll();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (data: CreatePerformanceReviewDto) => {
    try {
      const newReview = await performanceService.create(data);
      setReviews([...reviews, newReview]);
      return newReview;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar avaliação');
      throw err;
    }
  };

  const updateReview = async (id: string, data: UpdatePerformanceReviewDto) => {
    try {
      const updated = await performanceService.update(id, data);
      setReviews(reviews.map((review) => (review.id === id ? updated : review)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar avaliação');
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await performanceService.delete(id);
      setReviews(reviews.filter((review) => review.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar avaliação');
      throw err;
    }
  };

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    createReview,
    updateReview,
    deleteReview,
  };
};


