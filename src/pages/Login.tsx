import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import apiClient from '../api/client';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.accessToken || response.token);
      
      // Salvar dados do usuário com permissões padrão para desenvolvimento
      const userData = {
        id: response.user?.id || '1',
        email: response.user?.email || email,
        name: response.user?.name || 'Usuário',
        permissions: response.user?.permissions || [
          'employees:view', 'employees:create', 'employees:update',
          'projects:view', 'projects:create',
          'leaves:view', 'leaves:create',
          'attendance:view', 'attendance:create',
          'performance:view',
          'development:view',
          'analytics:view',
          'recruitment:view',
          'benefits:view',
          'settings:view',
          'separation:view', 'separation:create',
          'policies:view',
          'expenses:view', 'expenses:create',
          'payroll:view',
          'facilities:view',
          'travel:view',
          'surveys:view',
          'contract-labor:view',
          'admin',
        ],
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      navigate('/modules');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
        : 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            People Analytics
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para continuar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-t-md"
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-b-md"
            />
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

