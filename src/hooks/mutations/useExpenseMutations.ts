import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DatabaseService } from '@/src/services/database';
import { ExpenseInsert, ExpenseUpdate } from '@/src/types/STT';

/**
 * React Query mutation hook for creating a new expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (expense: ExpenseInsert) => DatabaseService.createExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}

/**
 * React Query mutation hook for updating an expense
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ExpenseUpdate }) => 
      DatabaseService.updateExpense(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}

/**
 * React Query mutation hook for deleting an expense
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}
