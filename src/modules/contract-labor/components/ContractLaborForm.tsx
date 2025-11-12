import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateContractLaborDto, UpdateContractLaborDto, ContractLabor, ContractLaborStatus } from '../../../types';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { useContractors } from '../../../hooks/useContractLabor';
import { useProjects } from '../../../hooks/useProjects';

interface ContractLaborFormProps {
  onSubmit: (data: CreateContractLaborDto | UpdateContractLaborDto) => Promise<void>;
  initialData?: ContractLabor;
  onCancel?: () => void;
}

export const ContractLaborForm: React.FC<ContractLaborFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const { contractors, loading: contractorsLoading } = useContractors();
  const { projects, loading: projectsLoading } = useProjects();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateContractLaborDto | UpdateContractLaborDto>({
    defaultValues: initialData || {
      name: '',
      skill: '',
      wage: 0,
      currency: 'BRL',
      status: ContractLaborStatus.ACTIVE,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        const value = initialData[key as keyof ContractLabor];
        if (key === 'startDate' || key === 'endDate') {
          if (value) {
            setValue(key as keyof CreateContractLaborDto, new Date(value as string).toISOString().split('T')[0] as any);
          }
        } else {
          setValue(key as keyof CreateContractLaborDto, value as any);
        }
      });
    }
  }, [initialData, setValue]);

  const contractorOptions = contractorsLoading
    ? []
    : contractors.filter(c => c.isActive).map((contractor) => ({
        value: contractor.id,
        label: `${contractor.name} - ${contractor.companyName}`,
      }));

  const projectOptions = projectsLoading
    ? []
    : projects.map((project) => ({
        value: project.id,
        label: project.name,
      }));

  const statusOptions = [
    { value: ContractLaborStatus.ACTIVE, label: 'Ativo' },
    { value: ContractLaborStatus.INACTIVE, label: 'Inativo' },
    { value: ContractLaborStatus.TERMINATED, label: 'Terminado' },
  ];

  const currencyOptions = [
    { value: 'BRL', label: 'BRL - Real' },
    { value: 'USD', label: 'USD - Dólar' },
    { value: 'EUR', label: 'EUR - Euro' },
  ];

  const onSubmitForm = async (data: CreateContractLaborDto | UpdateContractLaborDto) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input
        label="Nome do Trabalhador"
        {...register('name', { required: 'Nome é obrigatório' })}
        error={errors.name?.message}
      />

      <Input
        label="Especialidade/Função"
        {...register('skill', { required: 'Especialidade é obrigatória' })}
        error={errors.skill?.message}
      />

      <Select
        label="Contratado"
        options={contractorOptions}
        {...register('contractorId', { required: 'Contratado é obrigatório' })}
        error={errors.contractorId?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Salário/Valor"
          type="number"
          step="0.01"
          {...register('wage', { 
            required: 'Salário é obrigatório',
            min: { value: 0, message: 'Valor deve ser positivo' }
          })}
          error={errors.wage?.message}
        />

        <Select
          label="Moeda"
          options={currencyOptions}
          {...register('currency')}
          error={errors.currency?.message}
        />
      </div>

      <Select
        label="Status"
        options={statusOptions}
        {...register('status', { required: 'Status é obrigatório' })}
        error={errors.status?.message}
      />

      <Select
        label="Projeto (Opcional)"
        options={[{ value: '', label: 'Nenhum' }, ...projectOptions]}
        {...register('projectId')}
        error={errors.projectId?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Data de Início"
          type="date"
          {...register('startDate', { required: 'Data de início é obrigatória' })}
          error={errors.startDate?.message}
        />

        <Input
          label="Data de Término (Opcional)"
          type="date"
          {...register('endDate')}
          error={errors.endDate?.message}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Atualizar' : 'Criar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

