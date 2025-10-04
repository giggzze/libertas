import {
	Debt,
	DebtInsert,
	DebtPayment,
	DebtPaymentInsert,
	DebtPaymentUpdate,
	DebtUpdate,
	DebtWithPayments,
	Expense,
	ExpenseInsert,
	ExpenseUpdate,
	MonthlyIncome,
	MonthlyIncomeInsert,
	MonthlyIncomeUpdate,
	Profile,
	ProfileUpdate,
	UserDebtSummary,
} from '@/types/STT';
import { supabase } from '@/utils/supabaseClient';
import { useUser } from '@clerk/clerk-expo';

export class DatabaseService {
	// Profile operations
	static async getProfile(userId: string): Promise<Profile | null> {
		const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

		if (error) {
			console.error('Error fetching profile:', error);
			return null;
		}

		return data;
	}

	static async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
		const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();

		if (error) {
			console.error('Error updating profile:', error);
			return null;
		}

		return data;
	}

	static async createProfile(profileId: string): Promise<void> {
		const { data, error } = await supabase.from('profiles').insert({ id: profileId }).select().single();

		if (error) {
			console.error('Error creating profile:', error);
		}
	}

	// Monthly Income operations
	static async getCurrentMonthlyIncome(userId: string): Promise<MonthlyIncome | null> {
		const { data, error } = await supabase
			.from('monthly_income')
			.select('*')
			.eq('user_id', userId)
			.is('end_date', null)
			.order('start_date', { ascending: false })
			.limit(1);

		console.log('monthly income', data);
		if (error) {
			console.error('Error fetching monthly income:', error);
			return null;
		}

		// Return the first record if it exists, otherwise null
		return data && data.length > 0 ? data[0] : null;
	}

	static async getAllMonthlyIncome(userId: string): Promise<MonthlyIncome[]> {
		const { data, error } = await supabase
			.from('monthly_income')
			.select('*')
			.eq('user_id', userId)
			.order('start_date', { ascending: false });

		if (error) {
			console.error('Error fetching monthly income history:', error);
			return [];
		}

		return data || [];
	}

	static async createMonthlyIncome(income: MonthlyIncomeInsert, userId: string): Promise<MonthlyIncome | null> {
		const { data, error } = await supabase
			.from('monthly_income')
			.insert(
				{
					...income,
					user_id: userId,
				}
			)
			.select()
			.single();

		if (error) {
			console.error('Error creating monthly income:', error);
			return null;
		}

		return data;
	}

	static async updateMonthlyIncome(id: string, updates: MonthlyIncomeUpdate): Promise<MonthlyIncome | null> {
		const { data, error } = await supabase.from('monthly_income').update(updates).eq('id', id).select().single();

		if (error) {
			console.error('Error updating monthly income:', error);
			return null;
		}

		return data;
	}

	// Debt operations
	static async getUserDebts(userId: string): Promise<Debt[]> {
		const { data, error } = await supabase
			.from('debts')
			.select('*')
			.eq('user_id', userId)
			.eq('is_paid', false)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching debts:', error);
			return [];
		}

		return data || [];
	}

	static async getAllUserDebts(userId: string, includePaid: boolean = false): Promise<Debt[]> {
		let query = supabase.from('debts').select('*').eq('user_id', userId);

		if (!includePaid) {
			query = query.eq('is_paid', false);
		}

		const { data, error } = await query.order('created_at', {
			ascending: false,
		});

		if (error) {
			console.error('Error fetching all debts:', error);
			return [];
		}

		return data || [];
	}

	static async getDebtWithPayments(debtId: string): Promise<DebtWithPayments | null> {
		const { data, error } = await supabase
			.from('debts')
			.select(
				`
        *,
        debt_payments (*)
      `,
			)
			.eq('id', debtId)
			.single();

		if (error) {
			console.error('Error fetching debt with payments:', error);
			return null;
		}

		// Calculate totals
		const totalPaid =
			data.debt_payments
				?.filter((p: DebtPayment) => p.type === 'payment')
				.reduce((sum: number, payment: DebtPayment) => sum + payment.amount, 0) || 0;
		const totalCharges =
			data.debt_payments
				?.filter((p: DebtPayment) => p.type === 'charge')
				.reduce((sum: number, payment: DebtPayment) => sum + payment.amount, 0) || 0;
		const remainingBalance = data.amount + totalCharges - totalPaid;

		return {
			...data,
			total_paid: totalPaid,
			remaining_balance: remainingBalance,
		};
	}

	static async getUserDebtsWithPayments(userId: string): Promise<DebtWithPayments[]> {
		const { data, error } = await supabase
			.from('debts')
			.select(
				`
        *,
        debt_payments (*)
      `,
			)
			.eq('user_id', userId)
			.eq('is_paid', false)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching debts with payments:', error);
			return [];
		}

		// Calculate totals for each debt
		return (data || []).map((debt: any) => {
			const totalPaid =
				debt.debt_payments
					?.filter((p: DebtPayment) => p.type === 'payment')
					.reduce((sum: number, payment: DebtPayment) => sum + payment.amount, 0) || 0;
			const totalCharges =
				debt.debt_payments
					?.filter((p: DebtPayment) => p.type === 'charge')
					.reduce((sum: number, payment: DebtPayment) => sum + payment.amount, 0) || 0;
			const remainingBalance = debt.amount + totalCharges - totalPaid;
			return {
				...debt,
				total_paid: totalPaid,
				remaining_balance: remainingBalance,
			};
		});
	}

	static async createDebt(debt: DebtInsert, userId: string): Promise<Debt | null> {
		const { data, error } = await supabase
			.from('debts')
			.insert({
				...debt,
				user_id: userId,
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating debt:', error);
			return null;
		}

		return data;
	}

	static async updateDebt(id: string, updates: DebtUpdate): Promise<Debt | null> {
		const { data, error } = await supabase.from('debts').update(updates).eq('id', id).select().single();

		if (error) {
			console.error('Error updating debt:', error);
			return null;
		}

		return data;
	}

	static async deleteDebt(id: string): Promise<boolean> {
		const { error } = await supabase.from('debts').delete().eq('id', id);

		if (error) {
			console.error('Error deleting debt:', error);
			return false;
		}

		return true;
	}

	static async markDebtAsPaid(id: string): Promise<Debt | null> {
		return this.updateDebt(id, {
			is_paid: true,
			end_date: new Date().toISOString().split('T')[0],
		});
	}

	// Debt Payment operations
	static async getDebtPayments(debtId: string): Promise<DebtPayment[]> {
		const { data, error } = await supabase
			.from('debt_payments')
			.select('*')
			.eq('debt_id', debtId)
			.order('payment_date', { ascending: false });

		if (error) {
			console.error('Error fetching debt payments:', error);
			return [];
		}

		return data || [];
	}

	static async createDebtPayment(payment: DebtPaymentInsert): Promise<DebtPayment | null> {
		const { data, error } = await supabase.from('debt_payments').insert(payment).select().single();

		if (error) {
			console.error('Error creating debt payment:', error);
			return null;
		}

		return data;
	}

	static async updateDebtPayment(id: string, updates: DebtPaymentUpdate): Promise<DebtPayment | null> {
		const { data, error } = await supabase.from('debt_payments').update(updates).eq('id', id).select().single();

		if (error) {
			console.error('Error updating debt payment:', error);
			return null;
		}

		return data;
	}

	static async deleteDebtPayment(id: string): Promise<boolean> {
		const { error } = await supabase.from('debt_payments').delete().eq('id', id);

		if (error) {
			console.error('Error deleting debt payment:', error);
			return false;
		}

		return true;
	}

	// Combined operations
	static async getUserDebtSummary(userId: string): Promise<UserDebtSummary | null> {
		try {
			const [profile, monthlyIncome, debtsWithPayments] = await Promise.all([
				this.getProfile(userId),
				this.getAllMonthlyIncome(userId),
				this.getUserDebtsWithPayments(userId),
			]);

			if (!profile) {
				console.error('Profile not found for user:', userId);
				return null;
			}

			const totalDebt = debtsWithPayments.reduce((sum, debt) => sum + (debt.remaining_balance || debt.amount), 0);
			const totalMonthlyPayments = debtsWithPayments.reduce((sum, debt) => sum + debt.minimum_payment, 0);
			const totalPaid = debtsWithPayments.reduce((sum, debt) => sum + (debt.total_paid || 0), 0);

			return {
				profile,
				monthly_income: monthlyIncome,
				debts: debtsWithPayments,
				total_debt: totalDebt,
				total_monthly_payments: totalMonthlyPayments,
				total_paid: totalPaid,
			};
		} catch (error) {
			console.error('Error fetching user debt summary:', error);
			return null;
		}
	}

	// Utility functions
	static async getTotalUserDebt(userId: string): Promise<number> {
		const { data, error } = await supabase
			.from('debts')
			.select('amount')
			.eq('user_id', userId)
			.eq('is_paid', false);

		if (error) {
			console.error('Error calculating total debt:', error);
			return 0;
		}

		return (data || []).reduce((sum, debt) => sum + debt.amount, 0);
	}

	static async getTotalMonthlyPayments(userId: string): Promise<number> {
		try {
			// Get debt payments
			const { data: debts, error: debtsError } = await supabase
				.from('debts')
				.select('minimum_payment')
				.eq('user_id', userId)
				.eq('is_paid', false);

			if (debtsError) {
				console.error('Error calculating debt payments:', debtsError);
				return 0;
			}

			// Get expenses
			const { data: expenses, error: expensesError } = await supabase
				.from('expenses')
				.select('amount')
				.eq('user_id', userId);

			if (expensesError) {
				console.error('Error calculating expenses:', expensesError);
				return 0;
			}

			// Calculate total debt payments
			const totalDebtPayments = (debts || []).reduce((sum, debt) => sum + debt.minimum_payment, 0);

			// Calculate total expenses
			const totalExpenses = (expenses || []).reduce((sum, expense) => sum + expense.amount, 0);

			// Return combined total
			return totalDebtPayments + totalExpenses;
		} catch (error) {
			console.error('Error calculating total monthly payments:', error);
			return 0;
		}
	}

	// Expense methods
	static async getUserExpenses(userId: string): Promise<Expense[]> {
		const { data, error } = await supabase
			.from('expenses')
			.select('*')
			.eq('user_id', userId)
			.order('due_date', { ascending: true });

		if (error) throw error;
		return data || [];
	}

	static async createExpense(expense: ExpenseInsert): Promise<Expense | null> {
		const { data, error } = await supabase.from('expenses').insert([expense]).select().single();

		if (error) {
			console.error('Error creating expense:', error);
			return null;
		}

		return data;
	}

	static async updateExpense(id: string, updates: ExpenseUpdate): Promise<Expense | null> {
		const { data, error } = await supabase.from('expenses').update(updates).eq('id', id).select().single();

		if (error) throw error;
		return data;
	}

	static async deleteExpense(id: string): Promise<boolean> {
		const { error } = await supabase.from('expenses').delete().eq('id', id);

		if (error) throw error;
		return true;
	}
}
