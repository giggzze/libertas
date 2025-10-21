import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { DatabaseService } from '@/src/services/database';
import { MonthlyIncome } from '@/src/types/STT';

/**
 * React Query hook for fetching current monthly income
 */
export function useCurrentIncome() {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['currentIncome', user?.id],
    queryFn: () => DatabaseService.getCurrentMonthlyIncome(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes (income changes less frequently)
  });
}

/**
 * React Query hook for fetching monthly income history
 */
export function useIncomeHistory() {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['incomeHistory', user?.id],
    queryFn: () => DatabaseService.getAllMonthlyIncome(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes (history changes rarely)
  });
}
