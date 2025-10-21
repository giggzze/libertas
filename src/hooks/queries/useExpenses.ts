import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { DatabaseService } from '@/src/services/database';
import { Expense } from '@/src/types/STT';

/**
 * React Query hook for fetching user expenses
 */
export function useExpenses() {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: () => DatabaseService.getUserExpenses(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });
}
