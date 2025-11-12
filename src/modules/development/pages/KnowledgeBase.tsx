import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useKnowledgeBase } from '../../../hooks/useKnowledgeBase';
import { useAuth } from '../../../contexts/AuthContext';
import { Table } from '../../../components/common/Table';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateKnowledgeArticleDto, KnowledgeCategory, KnowledgeArticle } from '../../../types';
import { useDepartments } from '../../../hooks/useDepartments';
import { formatDate } from '../../../utils/formatters';
import * as yup from 'yup';

const knowledgeSchema = yup.object({
  title: yup.string().required('Título é obrigatório').min(3, 'Título deve ter pelo menos 3 caracteres'),
  content: yup.string().required('Conteúdo é obrigatório'),
  category: yup.string().oneOf(Object.values(KnowledgeCategory)).required('Categoria é obrigatória'),
  departmentId: yup.string().optional(),
  authorId: yup.string().required('Autor é obrigatório'),
});

export const KnowledgeBase: React.FC = () => {
  const { articles, loading, error, createArticle } = useKnowledgeBase();
  const { departments } = useDepartments();
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateKnowledgeArticleDto>({
    resolver: yupResolver(knowledgeSchema),
    defaultValues: {
      authorId: 'current-user-id',
    },
  });

  const handleCreate = async (data: CreateKnowledgeArticleDto) => {
    await createArticle(data);
    reset();
    setIsModalOpen(false);
  };

  const categoryOptions = Object.values(KnowledgeCategory).map((value) => ({
    value,
    label: value.replace('_', ' '),
  }));

  const departmentOptions = [
    { value: '', label: 'Todos os departamentos' },
    ...departments.map((dept) => ({
      value: dept.id,
      label: dept.name,
    })),
  ];

  const columns = [
    { key: 'title', header: 'Título' },
    { key: 'category', header: 'Categoria' },
    {
      key: 'createdAt',
      header: 'Data',
      render: (item: KnowledgeArticle) => formatDate(item.createdAt),
    },
  ];

  if (loading) {
    return (
      <ModuleLayout moduleId="development">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="development">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="development">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Base de Conhecimento</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Artigo</Button>
      </div>
      {articles.length === 0 ? (
        <EmptyState title="Nenhum artigo encontrado" />
      ) : (
        <Table data={articles} columns={columns} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Novo Artigo"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input label="Título" {...register('title')} error={errors.title?.message} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <textarea
              {...register('content')}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o conteúdo do artigo..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>
          <Select
            label="Categoria"
            options={categoryOptions}
            {...register('category')}
            error={errors.category?.message}
          />
          <Select
            label="Departamento"
            options={departmentOptions}
            {...register('departmentId')}
            error={errors.departmentId?.message}
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

