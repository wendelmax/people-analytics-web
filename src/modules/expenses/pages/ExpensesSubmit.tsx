import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { Select } from '../../../components/common/Select';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatCurrency } from '../../../utils/formatters';
import { ExpenseCategory, CreateExpenseDto } from '../../../types';

const expenseSchema = yup.object({
  description: yup.string().required('Descrição é obrigatória'),
  amount: yup.number().required('Valor é obrigatório').positive('Valor deve ser positivo'),
  category: yup.string().required('Categoria é obrigatória'),
  expenseDate: yup.date().required('Data é obrigatória'),
  notes: yup.string(),
});

export const ExpensesSubmit: React.FC = () => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateExpenseDto>({
    resolver: yupResolver(expenseSchema),
  });

  const amount = watch('amount');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(files);
  };

  const onSubmit = async (data: CreateExpenseDto) => {
    setIsSubmitting(true);
    try {
      // Aqui seria chamada a API para submeter a despesa
      console.log('Submitting expense:', data, attachments);

      // Simulação de sucesso
      await new Promise(resolve => setTimeout(resolve, 2000));

      reset();
      setAttachments([]);
      alert('Despesa submetida com sucesso!');
    } catch (error) {
      console.error('Erro ao submeter despesa:', error);
      alert('Erro ao submeter despesa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModuleLayout moduleId="expenses">
      <div className="space-y-6">
        <PageHeader
          title="Solicitar Reembolso"
          subtitle="Submeta uma nova solicitação de reembolso"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Detalhes da Despesa</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    {...register('description')}
                    placeholder="Descreva a despesa detalhadamente"
                    error={errors.description?.message}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor (R$) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('amount')}
                      placeholder="0,00"
                      error={errors.amount?.message}
                    />
                    {amount && (
                      <p className="mt-1 text-sm text-gray-600">
                        Valor formatado: {formatCurrency(amount)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <Select {...register('category')} error={errors.category?.message}>
                      <option value="">Selecione uma categoria</option>
                      <option value="TRANSPORT">Transporte</option>
                      <option value="MEALS">Refeições</option>
                      <option value="ACCOMMODATION">Hospedagem</option>
                      <option value="SUPPLIES">Material de Escritório</option>
                      <option value="TRAINING">Treinamento</option>
                      <option value="OTHER">Outros</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data da Despesa *
                    </label>
                    <Input
                      type="date"
                      {...register('expenseDate')}
                      error={errors.expenseDate?.message}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <Textarea
                  {...register('notes')}
                  placeholder="Observações adicionais (opcional)"
                  rows={2}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comprovantes</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexar Comprovantes
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Formatos aceitos: JPG, PNG, PDF. Máximo 5MB por arquivo.
                </p>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Arquivos anexados:</h4>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Solicitar Reembolso'}
            </Button>
          </div>
        </form>
      </div>
    </ModuleLayout>
  );
};
