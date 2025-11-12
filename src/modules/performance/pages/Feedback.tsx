import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useFeedback } from '../../../hooks/useFeedback';
import { FeedbackList } from '../../../components/feedback/FeedbackList';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateFeedbackDto, FeedbackType, SentimentType } from '../../../types';
import { useEmployees } from '../../../hooks/useEmployees';
import * as yup from 'yup';

const feedbackSchema = yup.object({
  authorId: yup.string().required('Autor é obrigatório'),
  recipientId: yup.string().required('Destinatário é obrigatório'),
  type: yup.string().oneOf(Object.values(FeedbackType)).required('Tipo é obrigatório'),
  sentiment: yup.string().oneOf(Object.values(SentimentType)).required('Sentimento é obrigatório'),
  title: yup.string().required('Título é obrigatório'),
  content: yup.string().required('Conteúdo é obrigatório'),
  rating: yup.number().min(1).max(5).optional(),
  tags: yup.array().of(yup.string()).optional(),
});

export const Feedback: React.FC = () => {
  const { feedbacks, loading, error, createFeedback } = useFeedback();
  const { employees } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateFeedbackDto>({
    // resolver: yupResolver(feedbackSchema), // TODO: Fix yup resolver types
  });

  const handleCreate = async (data: CreateFeedbackDto) => {
    await createFeedback(data);
    reset();
    setIsModalOpen(false);
  };

  const employeeOptions = [
    { value: '', label: 'Selecione um funcionário' },
    ...employees.map((emp) => ({
      value: emp.id,
      label: emp.name,
    })),
  ];

  const typeOptions = Object.values(FeedbackType).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  const sentimentOptions = Object.values(SentimentType).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  if (loading) {
    return (
      <ModuleLayout moduleId="performance">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="performance">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="performance">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Feedback</Button>
      </div>
      {feedbacks.length === 0 ? (
        <EmptyState title="Nenhum feedback encontrado" />
      ) : (
        <FeedbackList />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Novo Feedback"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Select
            label="Autor"
            options={employeeOptions}
            {...register('authorId')}
            error={errors.authorId?.message}
          />
          <Select
            label="Destinatário"
            options={employeeOptions}
            {...register('recipientId')}
            error={errors.recipientId?.message}
          />
          <Select
            label="Tipo"
            options={typeOptions}
            {...register('type')}
            error={errors.type?.message}
          />
          <Select
            label="Sentimento"
            options={sentimentOptions}
            {...register('sentiment')}
            error={errors.sentiment?.message}
          />
          <Input label="Título" {...register('title')} error={errors.title?.message} />
          <Input
            label="Conteúdo"
            {...register('content')}
            error={errors.content?.message}
          />
          <Input
            label="Avaliação (1-5)"
            type="number"
            min="1"
            max="5"
            {...register('rating')}
            error={errors.rating?.message}
          />
          <div className="flex gap-2">
            <Button type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </ModuleLayout>
  );
};

