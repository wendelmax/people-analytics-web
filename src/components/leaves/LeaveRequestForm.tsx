import React, { useState, useEffect } from 'react';
import { useLeaveTypes } from '../../hooks/useLeaves';
import { useMyLeaves } from '../../hooks/useLeaves';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { CreateLeaveRequestDto } from '../../types';

export const LeaveRequestForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { leaveTypes, loading: typesLoading } = useLeaveTypes();
  const { createLeave, loading: createLoading } = useMyLeaves();
  const [formData, setFormData] = useState<CreateLeaveRequestDto>({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.leaveTypeId || !formData.startDate || !formData.endDate) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('A data de início deve ser anterior à data de fim');
      return;
    }

    try {
      await createLeave(formData);
      setSuccess(true);
      setFormData({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar solicitação de licença';
      setError(errorMessage);
    }
  };

  if (typesLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      {success && !onSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">Solicitação criada com sucesso!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Licença *
          </label>
          <select
            value={formData.leaveTypeId}
            onChange={(e) =>
              setFormData({ ...formData, leaveTypeId: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o tipo</option>
            {leaveTypes
              .filter((type) => type.isActive)
              .map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Início *
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Fim *
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo (opcional)
          </label>
          <Textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            rows={3}
            placeholder="Descreva o motivo da solicitação..."
          />
        </div>

        <Button type="submit" disabled={createLoading} className="w-full">
          {createLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Enviando...
            </>
          ) : (
            'Solicitar Licença'
          )}
        </Button>
      </form>
    </div>
  );
};

