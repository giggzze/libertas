// Query hooks
export { useDebts, useDebt, useDebtSummary } from './queries/useDebts';
export { useExpenses } from './queries/useExpenses';
export { useCurrentIncome, useIncomeHistory } from './queries/useIncome';
export { useProfile } from './queries/useProfile';
export { useDebtPayments } from './queries/useDebtPayments';

// Mutation hooks
export { 
  useCreateDebt, 
  useUpdateDebt, 
  useDeleteDebt, 
  useMarkDebtAsPaid 
} from './mutations/useDebtMutations';

export { 
  useCreateExpense, 
  useUpdateExpense, 
  useDeleteExpense 
} from './mutations/useExpenseMutations';

export { 
  useCreateIncome, 
  useUpdateIncome 
} from './mutations/useIncomeMutations';

export { useUpdateProfile } from './mutations/useProfileMutations';

export { 
  useCreateDebtPayment, 
  useUpdateDebtPayment, 
  useDeleteDebtPayment 
} from './queries/useDebtPayments';
