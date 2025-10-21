import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { DatabaseService } from '@/src/services/database';
import { DebtWithPayments } from '@/src/types/STT';

/**
 * React Query hook for fetching user debts with payments
 * Provides automatic caching, background updates, and error handling
 */
export function useDebts() {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['debts', user?.id],
    queryFn: () => DatabaseService.getUserDebtsWithPayments(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
}

/**
 * React Query hook for fetching a single debt with payments
 */
export function useDebt(debtId: string) {
  return useQuery({
    queryKey: ['debt', debtId],
    queryFn: () => DatabaseService.getDebtWithPayments(debtId),
    enabled: !!debtId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * React Query hook for fetching debt summary
 */
export function useDebtSummary() {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['debtSummary', user?.id],
    queryFn: () => DatabaseService.getUserDebtSummary(user!.id),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for summary)
  });
}
