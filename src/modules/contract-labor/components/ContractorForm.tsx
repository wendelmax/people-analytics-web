import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateContractorDto, UpdateContractorDto, Contractor } from '../../../types';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

interface ContractorFormProps {
  onSubmit: (data: CreateContractorDto | UpdateContractorDto) => Promise<void>;
  initialData?: Contractor;
  onCancel?: () => void;
}

export const ContractorForm: React.FC<ContractorFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateContractorDto | UpdateContractorDto>({
    defaultValues: initialData || {
      name: '',
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      taxId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof CreateContractorDto, initialData[key as keyof Contractor] as any);
      });
    }
  }, [initialData, setValue]);

  const onSubmitForm = async (data: CreateContractorDto | UpdateContractorDto) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input
        label="Nome do Contato"
        {...register('name', { required: 'Nome é obrigatório' })}
        error={errors.name?.message}
      />

      <Input
        label="Nome da Empresa"
        {...register('companyName', { required: 'Nome da empresa é obrigatório' })}
        error={errors.companyName?.message}
      />

      <Input
        label="Email de Contato"
        type="email"
        {...register('contactEmail', { 
          required: 'Email é obrigatório',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        })}
        error={errors.contactEmail?.message}
      />

      <Input
        label="Telefone de Contato"
        {...register('contactPhone', { required: 'Telefone é obrigatório' })}
        error={errors.contactPhone?.message}
      />

      <Input
        label="Endereço"
        {...register('address')}
        error={errors.address?.message}
      />

      <Input
        label="CPF/CNPJ"
        {...register('taxId')}
        error={errors.taxId?.message}
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Ativo
        </label>
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

