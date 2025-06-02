import { supabase } from "@/utils/supabaseClient";
import NetInfo from "@react-native-community/netinfo";
import { localDatabase } from "./localDatabase";

class SyncService {
	private isOnline: boolean = false;
	private syncInProgress: boolean = false;

	constructor() {
		// Monitor network status
		NetInfo.addEventListener(state => {
			this.isOnline = state.isConnected ?? false;
			if (this.isOnline) {
				this.sync();
			}
		});
	}

	async sync() {
		if (!this.isOnline || this.syncInProgress) {
			return;
		}

		try {
			this.syncInProgress = true;
			const { debts, expenses, monthlyIncome } =
				await localDatabase.getPendingSyncItems();

			// Sync debts
			for (const debt of debts) {
				try {
					const { error } = await supabase.from("debts").upsert({
						id: debt.id,
						name: debt.name,
						amount: debt.amount,
						remaining_balance: debt.remaining_balance,
						interest_rate: debt.interest_rate,
						minimum_payment: debt.minimum_payment,
						created_at: debt.created_at,
						updated_at: debt.updated_at,
					});

					if (!error) {
						await localDatabase.markAsSynced("debts", debt.id);
					}
				} catch (error) {
					console.error("Error syncing debt:", error);
				}
			}

			// Sync expenses
			for (const expense of expenses) {
				try {
					const { error } = await supabase.from("expenses").upsert({
						id: expense.id,
						name: expense.name,
						amount: expense.amount,
						created_at: expense.created_at,
						updated_at: expense.updated_at,
					});

					if (!error) {
						await localDatabase.markAsSynced(
							"expenses",
							expense.id
						);
					}
				} catch (error) {
					console.error("Error syncing expense:", error);
				}
			}

			// Sync monthly income
			if (monthlyIncome) {
				try {
					const { error } = await supabase
						.from("monthly_income")
						.upsert({
							id: monthlyIncome.id,
							amount: monthlyIncome.amount,
							created_at: monthlyIncome.created_at,
							updated_at: monthlyIncome.updated_at,
						});

					if (!error) {
						await localDatabase.markAsSynced(
							"monthly_income",
							monthlyIncome.id
						);
					}
				} catch (error) {
					console.error("Error syncing monthly income:", error);
				}
			}

			// Fetch and update local data with remote changes
			await this.fetchAndUpdateLocalData();
		} catch (error) {
			console.error("Error during sync:", error);
		} finally {
			this.syncInProgress = false;
		}
	}

	private async fetchAndUpdateLocalData() {
		try {
			// Fetch remote debts
			const { data: remoteDebts, error: debtsError } = await supabase
				.from("debts")
				.select("*");

			if (!debtsError && remoteDebts) {
				for (const debt of remoteDebts) {
					try {
						// Try to update first, if it fails (no record exists), then add
						await localDatabase.updateDebt(debt);
					} catch (error) {
						// If update fails, it means the record doesn't exist, so add it
						await localDatabase.addDebt(debt);
					}
				}
			}

			// Fetch remote expenses
			const { data: remoteExpenses, error: expensesError } =
				await supabase.from("expenses").select("*");

			if (!expensesError && remoteExpenses) {
				for (const expense of remoteExpenses) {
					try {
						// Try to update first, if it fails (no record exists), then add
						await localDatabase.updateExpense(expense);
					} catch (error) {
						// If update fails, it means the record doesn't exist, so add it
						await localDatabase.addExpense(expense);
					}
				}
			}

			// Fetch remote monthly income
			const { data: remoteIncome, error: incomeError } = await supabase
				.from("monthly_income")
				.select("*")
				.single();

			if (!incomeError && remoteIncome) {
				await localDatabase.setMonthlyIncome(remoteIncome);
			}
		} catch (error) {
			console.error("Error fetching remote data:", error);
		}
	}
}

export const syncService = new SyncService();
