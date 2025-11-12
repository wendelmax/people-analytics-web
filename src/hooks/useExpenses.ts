import { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { Expense, ExpenseReport, CreateExpenseDto, UpdateExpenseDto, CreateExpenseReportDto } from '../types';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    const data = await expenseService.getAll();
    setExpenses(data);
    setLoading(false);
  };

  const createExpense = async (data: CreateExpenseDto) => {
    const newExpense = await expenseService.create(data);
    setExpenses([...expenses, newExpense]);
    return newExpense;
  };

  const updateExpense = async (id: string, data: UpdateExpenseDto) => {
    const updated = await expenseService.update(id, data);
    setExpenses(expenses.map((exp) => (exp.id === id ? updated : exp)));
    return updated;
  };

  const deleteExpense = async (id: string) => {
    await expenseService.delete(id);
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};

export const useMyExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyExpenses();
  }, []);

  const fetchMyExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getMyExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchMyExpenses
  };
};


