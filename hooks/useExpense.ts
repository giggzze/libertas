import { DatabaseService } from "@/services/database";
import { useUser } from "@clerk/clerk-expo";
import { Expense, ExpenseInsert, ExpenseUpdate } from "@/types/STT";
import { useCallback, useEffect, useState, useRef } from "react";

// Expenses hook
/**
 * useExpenses is a custom React hook for managing a user's expenses.
 * It provides methods to fetch, create, update, and delete expenses, and handles
 * loading, error, and retry logic internally.
 *
 * @returns {Object} An object containing:
 *   - expenses: Array of Expense, the user's expenses.
 *   - loading: Boolean, true if expenses are being loaded.
 *   - error: String | null, error message if fetching expenses failed.
 *   - refetch: Function, manually refetches the expenses from the database.
 *   - createExpense: Function, creates a new expense. See method docstring.
 *   - updateExpense: Function, updates an existing expense. See method docstring.
 *   - deleteExpense: Function, deletes an expense by id. See method docstring.
 *   - isReady: Boolean, true if expenses are loaded or a retry is in progress.
 */
export function useExpenses() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For retry mechanism
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fetches the user's expenses from the database.
   * Handles authentication, error, and retry logic with exponential backoff.
   * Updates the expenses, loading, and error state accordingly.
   */
  const fetchExpenses = useCallback(async () => {
    // Don't attempt to fetch if we're not authenticated yet
    if (!user?.id) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching expenses for user:", user.id);
      const expensesData = await DatabaseService.getUserExpenses(user.id);
      console.log("Fetched expenses:", expensesData.length);
      setExpenses(expensesData);
      // Reset retry count on success
      retryCount.current = 0;
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch expenses");
      
      // Implement retry mechanism
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        console.log(`Retrying expenses fetch (${retryCount.current}/${maxRetries})...`);
        
        // Clear any existing timeout
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        // Retry with exponential backoff
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
        retryTimeoutRef.current = setTimeout(() => {
          fetchExpenses();
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Creates a new expense in the database.
   * After successful creation, refetches the expenses list.
   *
   * @param {ExpenseInsert} expense - The expense data to insert.
   * @returns {Promise<Expense | null>} The newly created expense, or null if creation failed.
   */
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

  /**
   * Updates an existing expense in the database.
   * After successful update, refetches the expenses list.
   *
   * @param {string} id - The ID of the expense to update.
   * @param {ExpenseUpdate} updates - The fields to update.
   * @returns {Promise<Expense | null>} The updated expense, or null if update failed.
   */
  const updateExpense = useCallback(
    async (id: string, updates: ExpenseUpdate) => {
      const updatedExpense = await DatabaseService.updateExpense(id, updates);
      if (updatedExpense) {
        await fetchExpenses();
      }
      return updatedExpense;
    },
    [fetchExpenses]
  );

  /**
   * Deletes an expense from the database by its ID.
   * After successful deletion, refetches the expenses list.
   *
   * @param {string} id - The ID of the expense to delete.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
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
    // Only fetch data if auth state is rehydrated
    if (user?.id) {
      fetchExpenses();
    }
  }, [fetchExpenses, user?.id]);
  
  // Cleanup function to clear any pending retries
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    isReady: user?.id && (!loading || retryCount.current > 0),
  };
}
