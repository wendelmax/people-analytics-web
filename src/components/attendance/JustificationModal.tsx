import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Attendance } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface JustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: Attendance | null;
  onSubmit: (attendanceId: string, justification: string, attachment?: File) => Promise<void>;
}

export const JustificationModal: React.FC<JustificationModalProps> = ({
  isOpen,
  onClose,
  attendance,
  onSubmit,
}) => {
  const [justification, setJustification] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!attendance) return;
    
    if (!justification.trim()) {
      setError('Por favor, forneça uma justificativa');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(attendance.id, justification, attachment || undefined);
      setJustification('');
      setAttachment(null);
      onClose();
    } catch (err) {
      setError('Erro ao enviar justificativa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('O arquivo deve ter no máximo 5MB');
        return;
      }
      setAttachment(file);
      setError(null);
    }
  };

  const handleClose = () => {
    setJustification('');
    setAttachment(null);
    setError(null);
    onClose();
  };

  if (!attendance) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Justificar Ausência/Atraso"
      size="md"
    >
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Data</p>
          <p className="font-semibold text-gray-900">
            {format(new Date(attendance.date + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          {attendance.checkIn && (
            <p className="text-sm text-gray-600 mt-2">
              Entrada: <span className="font-semibold">{attendance.checkIn.substring(0, 5)}</span>
            </p>
          )}
          {attendance.lateMinutes && attendance.lateMinutes > 0 && (
            <p className="text-sm text-red-600 mt-1">
              Atraso: <span className="font-semibold">{attendance.lateMinutes} minutos</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justificativa <span className="text-red-500">*</span>
          </label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Descreva o motivo da ausência ou atraso..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anexar Comprovante (opcional)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={loading}
            />
          </div>
          {attachment && (
            <p className="text-sm text-green-600 mt-2">
              Arquivo selecionado: {attachment.name}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 5MB)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Justificativa'}
          </Button>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Importante:</strong> A justificativa será enviada para análise do seu gestor. 
            Você receberá uma notificação quando for aprovada ou reprovada.
          </p>
        </div>
      </div>
    </Modal>
  );
};

