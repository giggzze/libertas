import { DatabaseService } from '@/src/services/database';
import { DebtInsert, DebtUpdate, DebtWithPayments } from '@/src/types/STT';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-expo';

// Debts hook
/**
 * useDebts is a custom React hook for managing a user's debts and their associated payments.
 * It provides methods to fetch, create, update, delete, and mark debts as paid, and handles
 * loading, error, and retry logic internally.
 *
 * @returns {Object} An object containing:
 *   - debts: Array of DebtWithPayments, the user's debts with payment info.
 *   - loading: Boolean, true if debts are being loaded.
 *   - error: String | null, error message if fetching debts failed.
 *   - refetch: Function, manually refetches the debts from the database.
 *   - createDebt: Function, creates a new debt. See method docstring.
 *   - updateDebt: Function, updates an existing debt. See method docstring.
 *   - deleteDebt: Function, deletes a debt by id. See method docstring.
 *   - markDebtAsPaid: Function, marks a debt as paid. See method docstring.
 *   - isReady: Boolean, true if debts are loaded or a retry is in progress.
 */
export function useDebts() {
	const { user } = useUser();
	const [debts, setDebts] = useState<DebtWithPayments[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// For retry mechanism
	const retryCount = useRef(0);
	const maxRetries = 3;
	const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	/**
	 * Fetches the user's debts with their payments from the database.
	 * Handles authentication, error, and retry logic with exponential backoff.
	 * Updates the debts, loading, and error state accordingly.
	 */
	const fetchDebts = useCallback(async () => {
		// Don't attempt to fetch if we're not authenticated yet
		if (!user?.id) {
			// Auth state is rehydrated but no user, clear data
			setDebts([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			console.log('Fetching debts for user:', user.id);
			const debtsData = await DatabaseService.getUserDebtsWithPayments(user.id);
			console.log('Fetched debts:', debtsData.length);
			setDebts(debtsData);
			// Reset retry count on success
			retryCount.current = 0;
		} catch (err) {
			console.error('Error fetching debts:', err);
			setError(err instanceof Error ? err.message : 'Failed to fetch debts');

			// Implement retry mechanism
			if (retryCount.current < maxRetries) {
				retryCount.current += 1;
				console.log(`Retrying debts fetch (${retryCount.current}/${maxRetries})...`);

				// Clear any existing timeout
				if (retryTimeoutRef.current) {
					clearTimeout(retryTimeoutRef.current);
				}

				// Retry with exponential backoff
				const retryDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
				retryTimeoutRef.current = setTimeout(() => {
					fetchDebts();
				}, retryDelay);
			}
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	/**
	 * Creates a new debt in the database.
	 * @param {DebtInsert} debt - The debt object to insert.
	 * @returns {Promise<DebtWithPayments | null>} The created debt with payments, or null if failed.
	 */
	const createDebt = useCallback(
		async (debt: DebtInsert) => {
			const newDebt = await DatabaseService.createDebt(debt, user!.id);
			if (newDebt) {
				await fetchDebts();
			}
			return newDebt;
		},
		[fetchDebts],
	);

	/**
	 * Updates an existing debt in the database.
	 * @param {string} id - The ID of the debt to update.
	 * @param {DebtUpdate} updates - The updates to apply.
	 * @returns {Promise<DebtWithPayments | null>} The updated debt with payments, or null if failed.
	 */
	const updateDebt = useCallback(
		async (id: string, updates: DebtUpdate) => {
			const updatedDebt = await DatabaseService.updateDebt(id, updates);
			if (updatedDebt) {
				await fetchDebts();
			}
			return updatedDebt;
		},
		[fetchDebts],
	);

	/**
	 * Deletes a debt from the database.
	 * @param {string} id - The ID of the debt to delete.
	 * @returns {Promise<boolean>} True if the debt was deleted, false otherwise.
	 */
	const deleteDebt = useCallback(
		async (id: string) => {
			const success = await DatabaseService.deleteDebt(id);
			if (success) {
				await fetchDebts();
			}
			return success;
		},
		[fetchDebts],
	);

	/**
	 * Marks a debt as paid in the database.
	 * @param {string} id - The ID of the debt to mark as paid.
	 * @returns {Promise<DebtWithPayments | null>} The updated debt with payments, or null if failed.
	 */
	const markDebtAsPaid = useCallback(
		async (id: string) => {
			const updatedDebt = await DatabaseService.markDebtAsPaid(id);
			if (updatedDebt) {
				await fetchDebts();
			}
			return updatedDebt;
		},
		[fetchDebts],
	);

	useEffect(() => {
		// Only fetch data if auth state is rehydrated
		fetchDebts();
	}, [fetchDebts]);

	// Cleanup function to clear any pending retries
	useEffect(() => {
		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, []);

	return {
		debts,
		loading,
		error,
		refetch: fetchDebts,
		createDebt,
		updateDebt,
		deleteDebt,
		markDebtAsPaid,
		isReady: !loading || retryCount.current > 0,
	};
}
