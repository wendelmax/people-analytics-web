import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useProjectAllocations } from '../../../hooks/useAllocations';
import { useProjects } from '../../../hooks/useProjects';
import { useEmployees } from '../../../hooks/useEmployees';
import { ProjectAllocationCard } from '../../../components/allocations/ProjectAllocationCard';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Card } from '../../../components/common/Card';
import { EmptyState } from '../../../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import {
  CreateProjectAllocationDto,
  AllocationStatus,
  ProjectAllocation,
} from '../../../types/allocation';

export const ProjectAllocations: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<ProjectAllocation | null>(null);

  const { allocations, loading, error, createAllocation, updateAllocation, deleteAllocation } =
    useProjectAllocations(selectedProject || undefined);
  const { projects } = useProjects();
  const { employees } = useEmployees();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateProjectAllocationDto>({
    defaultValues: {
      allocationPercentage: 100,
    },
  });

  const projectOptions = [
    { value: '', label: 'Todos os Projetos' },
    ...projects.map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ];

  const employeeOptions = [
    { value: '', label: 'Selecione um funcionário' },
    ...employees.map((emp) => ({
      value: emp.id,
      label: emp.name,
    })),
  ];

  const handleCreate = async (data: CreateProjectAllocationDto) => {
    await createAllocation(data);
    reset();
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: CreateProjectAllocationDto) => {
    if (editingAllocation) {
      await updateAllocation(editingAllocation.id, data);
      setEditingAllocation(null);
      reset();
      setIsModalOpen(false);
    }
  };

  const handleEdit = (allocation: ProjectAllocation) => {
    setEditingAllocation(allocation);
    setValue('employeeId', allocation.employeeId);
    setValue('projectId', allocation.projectId);
    setValue('role', allocation.role || '');
    setValue('allocationPercentage', allocation.allocationPercentage);
    setValue('startDate', allocation.startDate);
    setValue('endDate', allocation.endDate || '');
    setValue('notes', allocation.notes || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta alocação?')) {
      await deleteAllocation(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAllocation(null);
    reset();
  };

  const filteredAllocations = selectedProject
    ? allocations
    : allocations;

  const totalAllocation = filteredAllocations.reduce(
    (sum, a) => sum + (a.status === AllocationStatus.ACTIVE ? a.allocationPercentage : 0),
    0
  );

  return (
    <ModuleLayout moduleId="projects">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Alocação em Projetos</h1>
            <p className="text-gray-600">Gerencie a alocação de funcionários em projetos</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Nova Alocação</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{allocations.length}</p>
              <p className="text-sm text-gray-600">Total de Alocações</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {allocations.filter((a) => a.status === AllocationStatus.ACTIVE).length}
              </p>
              <p className="text-sm text-gray-600">Alocações Ativas</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{totalAllocation}%</p>
              <p className="text-sm text-gray-600">Alocação Total</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{projects.length}</p>
              <p className="text-sm text-gray-600">Projetos Disponíveis</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4">
            <Select
              label="Filtrar por Projeto"
              options={projectOptions}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            />
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : filteredAllocations.length === 0 ? (
          <EmptyState
            title="Nenhuma alocação encontrada"
            message="Comece criando uma nova alocação de funcionário em projeto"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAllocations.map((allocation) => (
              <ProjectAllocationCard
                key={allocation.id}
                allocation={allocation}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingAllocation ? 'Editar Alocação' : 'Nova Alocação'}
          size="lg"
        >
          <form
            onSubmit={handleSubmit(editingAllocation ? handleUpdate : handleCreate)}
            className="space-y-4"
          >
            <Select
              label="Funcionário"
              options={employeeOptions}
              {...register('employeeId', { required: 'Funcionário é obrigatório' })}
              error={errors.employeeId?.message}
            />
            <Select
              label="Projeto"
              options={projectOptions.filter((p) => p.value !== '')}
              {...register('projectId', { required: 'Projeto é obrigatório' })}
              error={errors.projectId?.message}
            />
            <Input
              label="Função/Cargo no Projeto"
              {...register('role')}
              error={errors.role?.message}
              placeholder="Ex: Desenvolvedor, Designer, Gerente..."
            />
            <div>
              <Input
                label="Percentual de Alocação (%)"
                type="number"
                min="0"
                max="100"
                step="1"
                {...register('allocationPercentage', {
                  required: 'Percentual é obrigatório',
                  min: { value: 0, message: 'Mínimo 0%' },
                  max: { value: 100, message: 'Máximo 100%' },
                })}
                error={errors.allocationPercentage?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentual de tempo dedicado ao projeto (0-100%)
              </p>
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adicione observações sobre a alocação..."
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" isLoading={isSubmitting}>
                {editingAllocation ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ModuleLayout>
  );
};

