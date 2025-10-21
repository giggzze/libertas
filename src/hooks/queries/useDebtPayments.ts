import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DatabaseService } from '@/src/services/database';
import { DebtPayment, DebtPaymentInsert, DebtPaymentUpdate } from '@/src/types/STT';

/**
 * React Query hook for fetching debt payments
 */
export function useDebtPayments(debtId: string) {
  return useQuery({
    queryKey: ['debtPayments', debtId],
    queryFn: () => DatabaseService.getDebtPayments(debtId),
    enabled: !!debtId,
    staleTime: 1 * 60 * 1000, // 1 minute (payments change frequently)
  });
}

/**
 * React Query mutation hook for creating a debt payment
 */
export function useCreateDebtPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payment: DebtPaymentInsert) => DatabaseService.createDebtPayment(payment),
    onSuccess: (data, variables) => {
      // Invalidate payments for this debt
      queryClient.invalidateQueries({ queryKey: ['debtPayments', variables.debt_id] });
      // Invalidate debt and debts list
      queryClient.invalidateQueries({ queryKey: ['debt', variables.debt_id] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}

/**
 * React Query mutation hook for updating a debt payment
 */
export function useUpdateDebtPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DebtPaymentUpdate }) => 
      DatabaseService.updateDebtPayment(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate payments for this debt
      queryClient.invalidateQueries({ queryKey: ['debtPayments'] });
      // Invalidate debt and debts list
      queryClient.invalidateQueries({ queryKey: ['debt'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}

/**
 * React Query mutation hook for deleting a debt payment
 */
export function useDeleteDebtPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.deleteDebtPayment(id),
    onSuccess: () => {
      // Invalidate all payment-related queries
      queryClient.invalidateQueries({ queryKey: ['debtPayments'] });
      queryClient.invalidateQueries({ queryKey: ['debt'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}
