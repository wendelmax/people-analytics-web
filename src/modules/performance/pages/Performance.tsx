import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { usePerformanceReviews } from '../../../hooks/usePerformanceReviews';
import { PerformanceReviewList } from '../../../components/performance/PerformanceReviewList';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreatePerformanceReviewDto, PerformanceReviewStatus } from '../../../types';
import { useEmployees } from '../../../hooks/useEmployees';
import * as yup from 'yup';

const performanceSchema = yup.object({
  employeeId: yup.string().required('Funcionário é obrigatório'),
  reviewerId: yup.string().required('Avaliador é obrigatório'),
  periodStart: yup.date().required('Data inicial é obrigatória'),
  periodEnd: yup.date().required('Data final é obrigatória'),
  status: yup.string().oneOf(Object.values(PerformanceReviewStatus)).required('Status é obrigatório'),
  overallRating: yup.number().min(0).max(5).optional(),
  strengths: yup.string().required('Pontos fortes são obrigatórios'),
  improvements: yup.string().required('Melhorias são obrigatórias'),
  comments: yup.string().optional(),
});

export const Performance: React.FC = () => {
  const { reviews, loading, error, createReview } = usePerformanceReviews();
  const { employees } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePerformanceReviewDto>({
    resolver: yupResolver(performanceSchema),
  });

  const handleCreate = async (data: CreatePerformanceReviewDto & { strengths: string; improvements: string }) => {
    const reviewData: CreatePerformanceReviewDto = {
      ...data,
      strengths: data.strengths.split(',').map((s: string) => s.trim()).filter(Boolean),
      improvements: data.improvements.split(',').map((s: string) => s.trim()).filter(Boolean),
    };
    await createReview(reviewData);
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

  const statusOptions = Object.values(PerformanceReviewStatus).map((value) => ({
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
        <h1 className="text-3xl font-bold text-gray-900">Avaliações de Performance</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nova Avaliação</Button>
      </div>
      {reviews.length === 0 ? (
        <EmptyState title="Nenhuma avaliação encontrada" />
      ) : (
        <PerformanceReviewList />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Nova Avaliação"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Select
            label="Funcionário"
            options={employeeOptions}
            {...register('employeeId')}
            error={errors.employeeId?.message}
          />
          <Select
            label="Avaliador"
            options={employeeOptions}
            {...register('reviewerId')}
            error={errors.reviewerId?.message}
          />
          <Input
            label="Data Inicial"
            type="date"
            {...register('periodStart')}
            error={errors.periodStart?.message}
          />
          <Input
            label="Data Final"
            type="date"
            {...register('periodEnd')}
            error={errors.periodEnd?.message}
          />
          <Select
            label="Status"
            options={statusOptions}
            {...register('status')}
            error={errors.status?.message}
          />
          <Input
            label="Pontos Fortes (separados por vírgula)"
            {...register('strengths')}
            error={errors.strengths?.message}
          />
          <Input
            label="Melhorias (separadas por vírgula)"
            {...register('improvements')}
            error={errors.improvements?.message}
          />
          <Input
            label="Comentários"
            {...register('comments')}
            error={errors.comments?.message}
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

