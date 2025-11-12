import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useSkills } from '../hooks/useSkills';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { skillSchema } from '../utils/validators';
import { CreateSkillDto, SkillType, SkillCategory, SkillLevel, Skill } from '../types';

export const Skills: React.FC = () => {
  const { skills, loading, error, createSkill } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateSkillDto>({
    // resolver: yupResolver(skillSchema), // TODO: Fix yup resolver types
  });

  const handleCreate = async (data: CreateSkillDto) => {
    await createSkill(data);
    reset();
    setIsModalOpen(false);
  };

  const typeOptions = Object.values(SkillType).map((value) => ({
    value,
    label: value === 'HARD' ? 'Técnica' : 'Comportamental',
  }));

  const categoryOptions = Object.values(SkillCategory).map((value) => ({
    value,
    label: value,
  }));

  const levelOptions = Object.values(SkillLevel).map((value) => ({
    value,
    label: value,
  }));

  const columns = [
    { key: 'name', header: 'Nome' },
    {
      key: 'type',
      header: 'Tipo',
      render: (item: Skill) => (item.type === 'HARD' ? 'Técnica' : 'Comportamental'),
    },
    { key: 'category', header: 'Categoria' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Habilidades</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nova Habilidade</Button>
      </div>
      {skills.length === 0 ? (
        <EmptyState title="Nenhuma habilidade encontrada" />
      ) : (
        <Table data={skills} columns={columns} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Nova Habilidade"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input
            label="Nome"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
          />
          <Select
            label="Tipo"
            options={typeOptions}
            {...register('type')}
            error={errors.type?.message}
          />
          <Select
            label="Categoria"
            options={categoryOptions}
            {...register('category')}
            error={errors.category?.message}
          />
          <Select
            label="Nível Padrão"
            options={levelOptions}
            {...register('defaultLevel')}
            error={errors.defaultLevel?.message}
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
    </Layout>
  );
};

