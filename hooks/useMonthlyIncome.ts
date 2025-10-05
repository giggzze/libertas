import { DatabaseService } from '@/services/database';
import { MonthlyIncome, MonthlyIncomeInsert } from '@/types/STT';
import { useUser } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState, useRef } from 'react';

// Monthly Income hook
export function useMonthlyIncome() {
	const { user } = useUser();
	const [currentIncome, setCurrentIncome] = useState<MonthlyIncome | null>(null);
	const [incomeHistory, setIncomeHistory] = useState<MonthlyIncome[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// For retry mechanism
	const retryCount = useRef(0);
	const maxRetries = 3;
	const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fetchCurrentIncome = useCallback(async () => {
		// Don't attempt to fetch if we're not authenticated yet
		if (!user?.id) {
			// Auth state is rehydrated but no user, clear data
			setCurrentIncome(null);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			console.log('Fetching current income for user:', user.id);
			const income = await DatabaseService.getCurrentMonthlyIncome(user.id);
			console.log('Fetched current income:', income);
			setCurrentIncome(income);
			// Reset retry count on success
			retryCount.current = 0;
		} catch (err) {
			console.error('Error fetching income:', err);
			setError(err instanceof Error ? err.message : 'Failed to fetch income');

			// Implement retry mechanism
			if (retryCount.current < maxRetries) {
				retryCount.current += 1;
				console.log(`Retrying income fetch (${retryCount.current}/${maxRetries})...`);

				// Clear any existing timeout
				if (retryTimeoutRef.current) {
					clearTimeout(retryTimeoutRef.current);
				}

				// Retry with exponential backoff
				const retryDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
				retryTimeoutRef.current = setTimeout(() => {
					fetchCurrentIncome();
				}, retryDelay);
			}
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	const fetchIncomeHistory = useCallback(async () => {
		// Don't attempt to fetch if we're not authenticated yet
		if (!user?.id) {
			// Auth state is rehydrated but no user, clear data
			setIncomeHistory([]);
			return;
		}

		try {
			const history = await DatabaseService.getAllMonthlyIncome(user.id);
			setIncomeHistory(history);
		} catch (err) {
			console.error('Error fetching income history:', err);
			setError(err instanceof Error ? err.message : 'Failed to fetch income history');
		}
	}, [user?.id]);

	const createIncome = useCallback(
		async (income: MonthlyIncomeInsert) => {
			const newIncome = await DatabaseService.createMonthlyIncome(income, user!.id);
			if (newIncome) {
				await fetchCurrentIncome();
				await fetchIncomeHistory();
			}
			return newIncome;
		},
		[fetchCurrentIncome, fetchIncomeHistory],
	);

	useEffect(() => {
		// Only fetch data if auth state is rehydrated
		if (user?.id) {
			fetchCurrentIncome();
			fetchIncomeHistory();
		}
	}, [fetchCurrentIncome, fetchIncomeHistory]);

	// Cleanup function to clear any pending retries
	useEffect(() => {
		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, []);

	return {
		currentIncome,
		incomeHistory,
		loading,
		error,
		refetch: fetchCurrentIncome,
		createIncome,
		isReady: !loading || retryCount.current > 0,
	};
}
