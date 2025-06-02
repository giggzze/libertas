import { localDatabase } from "@/services/localDatabase";
import { syncService } from "@/services/syncService";
import { useAuthStore } from "@/store/auth";
import { MonthlyIncome } from "@/types/STT";
import { useCallback, useEffect, useState } from "react";

// Monthly Income hook
export function useMonthlyIncome() {
	const [currentIncome, setCurrentIncome] = useState<MonthlyIncome | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const { rehydrated } = useAuthStore();

	const fetchIncome = useCallback(async () => {
		if (!rehydrated) return;

		try {
			setLoading(true);
			setError(null);

			// First try to get data from local database
			const localIncome = await localDatabase.getMonthlyIncome();
			setCurrentIncome(localIncome);

			// Then try to sync with remote
			await syncService.sync();

			// Fetch updated data after sync
			const updatedIncome = await localDatabase.getMonthlyIncome();
			setCurrentIncome(updatedIncome);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch monthly income")
			);
			console.error("Error fetching monthly income:", err);
		} finally {
			setLoading(false);
		}
	}, [rehydrated]);

	const setIncome = useCallback(async (income: MonthlyIncome) => {
		try {
			// Add to local database first
			await localDatabase.setMonthlyIncome(income);

			// Update local state
			setCurrentIncome(income);

			// Trigger sync
			await syncService.sync();
		} catch (err) {
			console.error("Error setting monthly income:", err);
			throw err;
		}
	}, []);

	useEffect(() => {
		fetchIncome();
	}, [fetchIncome]);

	return {
		currentIncome,
		loading,
		error,
		refetch: fetchIncome,
		setIncome,
	};
}
