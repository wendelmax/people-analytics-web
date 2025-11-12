import { useState, useEffect } from 'react';
import { surveyService } from '../services/surveyService';
import { Survey, SurveyResponse, CreateSurveyDto, UpdateSurveyDto, SubmitSurveyResponseDto } from '../types';

export const useSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);
    setError(null);
    const data = await surveyService.getAll();
    setSurveys(data);
    setLoading(false);
  };

  const createSurvey = async (data: CreateSurveyDto) => {
    const newSurvey = await surveyService.create(data);
    setSurveys([...surveys, newSurvey]);
    return newSurvey;
  };

  const updateSurvey = async (id: string, data: UpdateSurveyDto) => {
    const updated = await surveyService.update(id, data);
    setSurveys(surveys.map((survey) => (survey.id === id ? updated : survey)));
    return updated;
  };

  const deleteSurvey = async (id: string) => {
    await surveyService.delete(id);
    setSurveys(surveys.filter((survey) => survey.id !== id));
  };

  return {
    surveys,
    loading,
    error,
    refetch: fetchSurveys,
    createSurvey,
    updateSurvey,
    deleteSurvey,
  };
};

export const useAvailableSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableSurveys();
  }, []);

  const fetchAvailableSurveys = async () => {
    setLoading(true);
    setError(null);
    const data = await surveyService.getAvailable();
    setSurveys(data);
    setLoading(false);
  };

  return { surveys, loading, error, refetch: fetchAvailableSurveys, submitResponse };
};

export const useMySurveyResponses = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyResponses();
  }, []);

  const fetchMyResponses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await surveyService.getMyResponses();
      setResponses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar respostas');
    } finally {
      setLoading(false);
    }
  };

  return { responses, loading, error, refetch: fetchMyResponses };
};


