import { localDatabase } from "@/services/localDatabase";
import { syncService } from "@/services/syncService";
import { useAuthStore } from "@/store/auth";
import { Debt, DebtInsert, DebtWithPayments } from "@/types/STT";
import { supabase } from "@/utils/supabaseClient";
import { useCallback, useEffect, useState } from "react";

export function useDebts() {
	const [debts, setDebts] = useState<DebtWithPayments[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const { rehydrated } = useAuthStore();

	const fetchDebts = useCallback(async () => {
		if (!rehydrated) return;

		try {
			setLoading(true);
			setError(null);

			// First try to get data from local database
			const localDebts = await localDatabase.getDebts();
			setDebts(localDebts);

			// Then try to sync with remote
			await syncService.sync();

			// Fetch updated data after sync
			const updatedDebts = await localDatabase.getDebts();
			setDebts(updatedDebts);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to fetch debts")
			);
			console.error("Error fetching debts:", err);
		} finally {
			setLoading(false);
		}
	}, [rehydrated]);

	const addDebt = useCallback(async (debt: DebtInsert) => {
		try {
			// Add to local database first
			await localDatabase.addDebt({
				...debt,
				category: debt.category ?? "OTHER",
				created_at: debt.created_at ?? new Date().toISOString(),
				end_date: debt.end_date ?? null,
				id: debt.id ?? crypto.randomUUID(),
				is_paid: debt.is_paid ?? false,
				term_in_months: debt.term_in_months ?? 60,
				updated_at: debt.updated_at ?? new Date().toISOString(),
			});

			// Update local state
			const updatedDebts = await localDatabase.getDebts();
			setDebts(updatedDebts);

			// Trigger sync
			await syncService.sync();
		} catch (err) {
			console.error("Error adding debt:", err);
			throw err;
		}
	}, []);

	const updateDebt = useCallback(async (debt: Debt) => {
		try {
			// Update local database first
			await localDatabase.updateDebt(debt);

			// Update local state
			const updatedDebts = await localDatabase.getDebts();
			setDebts(updatedDebts);

			// Trigger sync
			await syncService.sync();
		} catch (err) {
			console.error("Error updating debt:", err);
			throw err;
		}
	}, []);

	const deleteDebt = useCallback(async (id: string) => {
		try {
			// Delete from local database first
			await localDatabase.deleteDebt(id);

			// Update local state
			const updatedDebts = await localDatabase.getDebts();
			setDebts(updatedDebts);

			// Try to delete from remote if online
			try {
				await supabase.from("debts").delete().eq("id", id);
			} catch (err) {
				console.error("Error deleting debt from remote:", err);
			}
		} catch (err) {
			console.error("Error deleting debt:", err);
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchDebts();
	}, [fetchDebts]);

	return {
		debts,
		loading,
		error,
		refetch: fetchDebts,
		addDebt,
		updateDebt,
		deleteDebt,
	};
}
