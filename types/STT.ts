import { Tables, TablesInsert, TablesUpdate } from "./supabase";

export type Debt = Tables<"debts">;
export type DebtPayment = Tables<"debt_payments">;
export type MonthlyIncome = Tables<"monthly_income">;
export type Profile = Tables<"profiles">;

// update types
export type DebtUpdate = TablesUpdate<"debts">;
export type DebtPaymentUpdate = TablesUpdate<"debt_payments">;
export type MonthlyIncomeUpdate = TablesUpdate<"monthly_income">;
export type ProfileUpdate = TablesUpdate<"profiles">;

// insert types
export type DebtInsert = TablesInsert<"debts">;
export type DebtPaymentInsert = TablesInsert<"debt_payments">;
export type MonthlyIncomeInsert = TablesInsert<"monthly_income">;
export type ProfileInsert = TablesInsert<"profiles">;
