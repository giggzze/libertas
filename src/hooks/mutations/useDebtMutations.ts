import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { DebtInsert} from '@/src/types/STT';
import { createDebt } from "@/src/service/detbService";
import { useSupabase } from "@/src/lib/supabaseClient";

/**
 * React Query mutation hook for creating a new debt
 * Automatically invalidates and refetches related queries
 */
export function useCreateDebt() {
  const { user } = useUser();
  const supabase = useSupabase()
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (debt: DebtInsert) => createDebt(debt, user!.id, supabase),
    onSuccess: async () => {
      // Invalidate and refetch debts and summary
      await queryClient.invalidateQueries({ queryKey: ['debts', user?.id] });
      // queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
    },
    onError: (error) => {
      console.error('Error creating debt:', error);
    },
  });
}

/**
 * React Query mutation hook for updating a debt
 */
// export function useUpdateDebt() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: ({ id, updates }: { id: string; updates: DebtUpdate }) =>
//       DatabaseService.updateDebt(id, updates),
//     onSuccess: (data, variables) => {
//       // Update specific debt in cache
//       queryClient.setQueryData(['debt', variables.id], data);
//       // Invalidate debts list and summary
//       queryClient.invalidateQueries({ queryKey: ['debts'] });
//       queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
//     },
//   });
// }
//
// /**
//  * React Query mutation hook for deleting a debt
//  */
// export function useDeleteDebt() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: (id: string) => DatabaseService.deleteDebt(id),
//     onSuccess: (_, deletedId) => {
//       // Remove from cache
//       queryClient.removeQueries({ queryKey: ['debt', deletedId] });
//       // Invalidate debts list and summary
//       queryClient.invalidateQueries({ queryKey: ['debts'] });
//       queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
//     },
//   });
// }
//
// /**
//  * React Query mutation hook for marking a debt as paid
//  */
// export function useMarkDebtAsPaid() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: (id: string) => DatabaseService.markDebtAsPaid(id),
//     onSuccess: (data, debtId) => {
//       // Update specific debt in cache
//       queryClient.setQueryData(['debt', debtId], data);
//       // Invalidate debts list and summary
//       queryClient.invalidateQueries({ queryKey: ['debts'] });
//       queryClient.invalidateQueries({ queryKey: ['debtSummary'] });
//     },
//   });
// }
