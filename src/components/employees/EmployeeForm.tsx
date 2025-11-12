import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { employeeSchema } from '../../utils/validators';
import { CreateEmployeeDto } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useDepartments } from '../../hooks/useDepartments';
import { usePositions } from '../../hooks/usePositions';
import { useSkills } from '../../hooks/useSkills';

interface EmployeeFormProps {
  onSubmit: (data: CreateEmployeeDto) => Promise<void>;
  initialData?: Partial<CreateEmployeeDto>;
  onCancel?: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const { departments, loading: departmentsLoading } = useDepartments();
  const { positions, loading: positionsLoading } = usePositions();
  const { skills, loading: skillsLoading } = useSkills();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateEmployeeDto>({
    resolver: yupResolver(employeeSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof CreateEmployeeDto, initialData[key as keyof CreateEmployeeDto]);
      });
    }
  }, [initialData, setValue]);

  const departmentOptions = departmentsLoading
    ? []
    : departments.map((dept) => ({
        value: dept.id,
        label: dept.name,
      }));

  const positionOptions = positionsLoading
    ? []
    : positions.map((pos) => ({
        value: pos.id,
        label: pos.title,
      }));

  const skillOptions = skillsLoading
    ? []
    : skills.map((skill) => ({
        value: skill.id,
        label: skill.name,
      }));

  const onSubmitForm = async (data: CreateEmployeeDto) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input
        label="Nome"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Telefone"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <Input
        label="Data de Contratação"
        type="date"
        {...register('hireDate')}
        error={errors.hireDate?.message}
      />

      <Select
        label="Departamento"
        options={departmentOptions}
        {...register('departmentId')}
        error={errors.departmentId?.message}
      />

      <Select
        label="Posição"
        options={positionOptions}
        {...register('positionId')}
        error={errors.positionId?.message}
      />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          Salvar
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

