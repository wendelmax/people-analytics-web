import { useState, useEffect } from 'react';
import { knowledgeBaseService } from '../services/knowledgeBaseService';
import {
  KnowledgeArticle,
  CreateKnowledgeArticleDto,
  UpdateKnowledgeArticleDto,
} from '../types';

export const useKnowledgeBase = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    
  };

  const updateArticle = async (id: string, data: UpdateKnowledgeArticleDto) => {
    
  };

  const deleteArticle = async (id: string) => {
    
  };

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};


