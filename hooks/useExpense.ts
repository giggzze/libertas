import { DatabaseService } from "@/services/database";
import { useAuthStore } from "@/store/auth";
import { Expense, ExpenseInsert, ExpenseUpdate } from "@/types/STT";
import { useCallback, useEffect, useState, useRef } from "react";

// Expenses hook
export function useExpenses() {
  const { user, rehydrated } = useAuthStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For retry mechanism
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchExpenses = useCallback(async () => {
    // Don't attempt to fetch if we're not authenticated yet
    if (!user?.id) {
      if (!rehydrated) {
        // Still waiting for auth state to rehydrate, don't count as a retry
        console.log("Auth state not rehydrated yet, waiting to fetch expenses");
        return;
      }
      
      // Auth state is rehydrated but no user, clear data
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
  }, [user?.id, rehydrated]);

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
      const updatedExpense = await DatabaseService.updateExpense(id, updates);
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
    // Only fetch data if auth state is rehydrated
    if (rehydrated) {
      fetchExpenses();
    }
  }, [fetchExpenses, rehydrated]);
  
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
    isReady: rehydrated && (!loading || retryCount.current > 0),
  };
}
