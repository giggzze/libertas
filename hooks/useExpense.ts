import { localDatabase } from "@/services/localDatabase";
import { syncService } from "@/services/syncService";
import { useAuthStore } from "@/store/auth";
import { Expense } from "@/types/STT";
import { supabase } from "@/utils/supabaseClient";
import { useCallback, useEffect, useState } from "react";

// Expenses hook
export function useExpenses() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const { rehydrated } = useAuthStore();

	const fetchExpenses = useCallback(async () => {
		if (!rehydrated) return;

		try {
			setLoading(true);
			setError(null);

			// First try to get data from local database
			const localExpenses = await localDatabase.getExpenses();
			setExpenses(localExpenses);

			// Then try to sync with remote
			await syncService.sync();

			// Fetch updated data after sync
			const updatedExpenses = await localDatabase.getExpenses();
			setExpenses(updatedExpenses);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch expenses")
			);
			console.error("Error fetching expenses:", err);
		} finally {
			setLoading(false);
		}
	}, [rehydrated]);

	const addExpense = useCallback(async (expense: Expense) => {
		try {
			// Add to local database first
			await localDatabase.addExpense(expense);

			// Update local state
			const updatedExpenses = await localDatabase.getExpenses();
			setExpenses(updatedExpenses);

			// Trigger sync
			await syncService.sync();
		} catch (err) {
			console.error("Error adding expense:", err);
			throw err;
		}
	}, []);

	const updateExpense = useCallback(async (expense: Expense) => {
		try {
			// Update local database first
			await localDatabase.updateExpense(expense);

			// Update local state
			const updatedExpenses = await localDatabase.getExpenses();
			setExpenses(updatedExpenses);

			// Trigger sync
			await syncService.sync();
		} catch (err) {
			console.error("Error updating expense:", err);
			throw err;
		}
	}, []);

	const deleteExpense = useCallback(async (id: string) => {
		try {
			// Delete from local database first
			await localDatabase.deleteExpense(id);

			// Update local state
			const updatedExpenses = await localDatabase.getExpenses();
			setExpenses(updatedExpenses);

			// Try to delete from remote if online
			try {
				await supabase.from("expenses").delete().eq("id", id);
			} catch (err) {
				console.error("Error deleting expense from remote:", err);
			}
		} catch (err) {
			console.error("Error deleting expense:", err);
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchExpenses();
	}, [fetchExpenses]);

	return {
		expenses,
		loading,
		error,
		refetch: fetchExpenses,
		addExpense,
		updateExpense,
		deleteExpense,
	};
}
