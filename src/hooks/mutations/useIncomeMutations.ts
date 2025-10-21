import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { DatabaseService } from '@/src/services/database';
import { MonthlyIncomeInsert, MonthlyIncomeUpdate } from '@/src/types/STT';

/**
 * React Query mutation hook for creating monthly income
 */
export function useCreateIncome() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (income: MonthlyIncomeInsert) => 
      DatabaseService.createMonthlyIncome(income, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentIncome'] });
      queryClient.invalidateQueries({ queryKey: ['incomeHistory'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}

/**
 * React Query mutation hook for updating monthly income
 */
export function useUpdateIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MonthlyIncomeUpdate }) => 
      DatabaseService.updateMonthlyIncome(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentIncome'] });
      queryClient.invalidateQueries({ queryKey: ['incomeHistory'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}
