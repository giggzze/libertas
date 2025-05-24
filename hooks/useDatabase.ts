import { DatabaseService } from "@/services/database";
import { useAuthStore } from "@/store/auth";
import {
	DebtInsert,
	DebtPayment,
	DebtPaymentInsert,
	DebtUpdate,
	DebtWithPayments,
	Expense,
	ExpenseInsert,
	ExpenseUpdate,
	MonthlyIncome,
	MonthlyIncomeInsert,
	Profile,
	ProfileUpdate,
	UserDebtSummary,
} from "@/types/STT";
import { useCallback, useEffect, useState } from "react";

// Profile hook
export function useProfile() {
	const { user } = useAuthStore();
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProfile = useCallback(async () => {
		if (!user?.id) return;

		setLoading(true);
		setError(null);

		try {
			const profileData = await DatabaseService.getProfile(user.id);
			setProfile(profileData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch profile"
			);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	const updateProfile = useCallback(
		async (updates: ProfileUpdate) => {
			if (!user?.id) return null;

			const updatedProfile = await DatabaseService.updateProfile(
				user.id,
				updates
			);
			if (updatedProfile) {
				setProfile(updatedProfile);
			}
			return updatedProfile;
		},
		[user?.id]
	);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	return {
		profile,
		loading,
		error,
		refetch: fetchProfile,
		updateProfile,
	};
}

// Monthly Income hook
export function useMonthlyIncome() {
	const { user } = useAuthStore();
	const [currentIncome, setCurrentIncome] = useState<MonthlyIncome | null>(
		null
	);
	const [incomeHistory, setIncomeHistory] = useState<MonthlyIncome[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCurrentIncome = useCallback(async () => {
		if (!user?.id) return;

		setLoading(true);
		setError(null);

		try {
			console.log("Fetching current income for user:", user.id);
			const income = await DatabaseService.getCurrentMonthlyIncome(
				user.id
			);
			console.log("Fetched current income:", income);
			setCurrentIncome(income);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch income"
			);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	const fetchIncomeHistory = useCallback(async () => {
		if (!user?.id) return;

		try {
			const history = await DatabaseService.getAllMonthlyIncome(user.id);
			setIncomeHistory(history);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to fetch income history"
			);
		}
	}, [user?.id]);

	const createIncome = useCallback(
		async (income: MonthlyIncomeInsert) => {
			const newIncome = await DatabaseService.createMonthlyIncome(income);
			if (newIncome) {
				await fetchCurrentIncome();
				await fetchIncomeHistory();
			}
			return newIncome;
		},
		[fetchCurrentIncome, fetchIncomeHistory]
	);

	useEffect(() => {
		fetchCurrentIncome();
		fetchIncomeHistory();
	}, [fetchCurrentIncome, fetchIncomeHistory]);

	return {
		currentIncome,
		incomeHistory,
		loading,
		error,
		refetch: fetchCurrentIncome,
		createIncome,
	};
}

// Debts hook
export function useDebts() {
	const { user } = useAuthStore();
	const [debts, setDebts] = useState<DebtWithPayments[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDebts = useCallback(async () => {
		if (!user?.id) return;

		setLoading(true);
		setError(null);

		try {
			const debtsData = await DatabaseService.getUserDebtsWithPayments(
				user.id
			);
			setDebts(debtsData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch debts"
			);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	const createDebt = useCallback(
		async (debt: DebtInsert) => {
			const newDebt = await DatabaseService.createDebt(debt);
			if (newDebt) {
				await fetchDebts();
			}
			return newDebt;
		},
		[fetchDebts]
	);

	const updateDebt = useCallback(
		async (id: string, updates: DebtUpdate) => {
			const updatedDebt = await DatabaseService.updateDebt(id, updates);
			if (updatedDebt) {
				await fetchDebts();
			}
			return updatedDebt;
		},
		[fetchDebts]
	);

	const deleteDebt = useCallback(
		async (id: string) => {
			const success = await DatabaseService.deleteDebt(id);
			if (success) {
				await fetchDebts();
			}
			return success;
		},
		[fetchDebts]
	);

	const markDebtAsPaid = useCallback(
		async (id: string) => {
			const updatedDebt = await DatabaseService.markDebtAsPaid(id);
			if (updatedDebt) {
				await fetchDebts();
			}
			return updatedDebt;
		},
		[fetchDebts]
	);

	useEffect(() => {
		fetchDebts();
	}, [fetchDebts]);

	return {
		debts,
		loading,
		error,
		refetch: fetchDebts,
		createDebt,
		updateDebt,
		deleteDebt,
		markDebtAsPaid,
	};
}

// Debt Payments hook
export function useDebtPayments(debtId: string) {
	const [payments, setPayments] = useState<DebtPayment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPayments = useCallback(async () => {
		if (!debtId) return;

		setLoading(true);
		setError(null);

		try {
			const paymentsData = await DatabaseService.getDebtPayments(debtId);
			setPayments(paymentsData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch payments"
			);
		} finally {
			setLoading(false);
		}
	}, [debtId]);

	const createPayment = useCallback(
		async (payment: DebtPaymentInsert) => {
			const newPayment = await DatabaseService.createDebtPayment(payment);
			if (newPayment) {
				await fetchPayments();
			}
			return newPayment;
		},
		[fetchPayments]
	);

	const deletePayment = useCallback(
		async (id: string) => {
			const success = await DatabaseService.deleteDebtPayment(id);
			if (success) {
				await fetchPayments();
			}
			return success;
		},
		[fetchPayments]
	);

	useEffect(() => {
		fetchPayments();
	}, [fetchPayments]);

	return {
		payments,
		loading,
		error,
		refetch: fetchPayments,
		createPayment,
		deletePayment,
	};
}

// Complete debt summary hook
export function useDebtSummary() {
	const { user } = useAuthStore();
	const [summary, setSummary] = useState<UserDebtSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSummary = useCallback(async () => {
		if (!user?.id) return;

		setLoading(true);
		setError(null);

		try {
			const summaryData = await DatabaseService.getUserDebtSummary(
				user.id
			);
			setSummary(summaryData);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to fetch debt summary"
			);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	return {
		summary,
		loading,
		error,
		refetch: fetchSummary,
	};
}

// Expenses hook
export function useExpenses() {
	const { user } = useAuthStore();
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchExpenses = useCallback(async () => {
		if (!user?.id) return;

		setLoading(true);
		setError(null);

		try {
			const expensesData = await DatabaseService.getUserExpenses(user.id);
			setExpenses(expensesData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch expenses"
			);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	const createExpense = useCallback(
		async (expense: ExpenseInsert) => {
			const newExpense = await DatabaseService.createExpense(expense);
			if (newExpense) {
				await fetchExpenses();
			}
			return newExpense;
		},
		[fetchExpenses]
	);

	const updateExpense = useCallback(
		async (id: string, updates: ExpenseUpdate) => {
			const updatedExpense = await DatabaseService.updateExpense(
				id,
				updates
			);
			if (updatedExpense) {
				await fetchExpenses();
			}
			return updatedExpense;
		},
		[fetchExpenses]
	);

	const deleteExpense = useCallback(
		async (id: string) => {
			const success = await DatabaseService.deleteExpense(id);
			if (success) {
				await fetchExpenses();
			}
			return success;
		},
		[fetchExpenses]
	);

	useEffect(() => {
		fetchExpenses();
	}, [fetchExpenses]);

	return {
		expenses,
		loading,
		error,
		refetch: fetchExpenses,
		createExpense,
		updateExpense,
		deleteExpense,
	};
}
