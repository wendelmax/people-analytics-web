import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useChatbot } from '../hooks/useChatbot';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const Chatbot: React.FC = () => {
  const { messages, loading, error, sendMessage, clearMessages } = useChatbot();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chatbot</h1>
          <Button variant="outline" onClick={clearMessages}>
            Limpar Conversa
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          {messages.length === 0 && (
            <Card>
              <p className="text-gray-500 text-center py-8">
                Comece uma conversa fazendo uma pergunta sobre performance, habilidades ou carreira.
              </p>
            </Card>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <Card>
                <p className="font-medium text-gray-900">Você:</p>
                <p className="text-gray-700">{msg.message}</p>
              </Card>
              <Card className="bg-blue-50">
                <p className="font-medium text-blue-900">Assistente:</p>
                <p className="text-blue-800">{msg.response}</p>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          {error && <ErrorMessage message={error} />}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" isLoading={loading}>
            Enviar
          </Button>
        </form>
      </div>
    </Layout>
  );
};

