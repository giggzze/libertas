import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseInsert} from '@/src/types/STT';
import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/src/lib/supabaseClient";
import { createExpense } from "@/src/service/expenseService";

/**wha
 * React Query mutation hook for creating a new expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const supabase = useSupabase();
  
  return useMutation({
    mutationFn: (expense: ExpenseInsert) => createExpense(expense, supabase),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      // queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
  });
}

/**
 * React Query mutation hook for updating an expense
 */
// export function useUpdateExpense() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: ({ id, updates }: { id: string; updates: ExpenseUpdate }) =>
//       DatabaseService.updateExpense(id, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['expenses'] });
//       queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
//     },
//   });
// }
//
// /**
//  * React Query mutation hook for deleting an expense
//  */
// export function useDeleteExpense() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: (id: string) => DatabaseService.deleteExpense(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['expenses'] });
//       queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
//     },
//   });
// }
