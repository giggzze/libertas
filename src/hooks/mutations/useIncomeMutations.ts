import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { MonthlyIncomeInsert, MonthlyIncomeUpdate } from '@/src/types/STT';
import { createMonthlyIncome } from "@/src/service/incomeService";
import { useSupabase } from "@/src/lib/supabaseClient";

/**
 * React Query mutation hook for creating monthly income
 */
export function useCreateIncome() {
  const { user } = useUser();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  
  return useMutation({
    mutationFn: (income: MonthlyIncomeInsert) => 
      createMonthlyIncome(income, user!.id, supabase),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentIncome', user?.id] });
      // queryClient.invalidateQueries({ queryKey: ['incomeHistory'] });
      // queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}

/**
 * React Query mutation hook for updating monthly income
 */
// export function useUpdateIncome() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: ({ id, updates }: { id: string; updates: MonthlyIncomeUpdate }) =>
//       DatabaseService.updateMonthlyIncome(id, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['currentIncome'] });
//       queryClient.invalidateQueries({ queryKey: ['incomeHistory'] });
//       queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
//     },
//   });
// }
