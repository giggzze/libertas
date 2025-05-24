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

// insert types (custom types that exclude user_id since it's handled automatically)
export type DebtInsert = Omit<TablesInsert<"debts">, "user_id">;
export type DebtPaymentInsert = TablesInsert<"debt_payments">;
export type MonthlyIncomeInsert = Omit<
	TablesInsert<"monthly_income">,
	"user_id"
>;
export type ProfileInsert = TablesInsert<"profiles">;

// Extended types with relationships
export interface DebtWithPayments extends Debt {
	debt_payments: DebtPayment[];
	total_paid?: number;
	remaining_balance?: number;
}

export interface UserDebtSummary {
	profile: Profile;
	monthly_income: MonthlyIncome[];
	debts: DebtWithPayments[];
	total_debt: number;
	total_monthly_payments: number;
	total_paid: number;
}
