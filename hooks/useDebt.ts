import { DatabaseService } from "@/services/database";
import { useAuthStore } from "@/store/auth";
import { DebtInsert, DebtUpdate, DebtWithPayments } from "@/types/STT";
import { useCallback, useEffect, useState, useRef } from "react";
// Debts hook
export function useDebts() {
  const { user, rehydrated } = useAuthStore();
  const [debts, setDebts] = useState<DebtWithPayments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For retry mechanism
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchDebts = useCallback(async () => {
    // Don't attempt to fetch if we're not authenticated yet
    if (!user?.id) {
      if (!rehydrated) {
        // Still waiting for auth state to rehydrate, don't count as a retry
        console.log("Auth state not rehydrated yet, waiting to fetch debts");
        return;
      }
      
      // Auth state is rehydrated but no user, clear data
      setDebts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching debts for user:", user.id);
      const debtsData = await DatabaseService.getUserDebtsWithPayments(user.id);
      console.log("Fetched debts:", debtsData.length);
      setDebts(debtsData);
      // Reset retry count on success
      retryCount.current = 0;
    } catch (err) {
      console.error("Error fetching debts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch debts");
      
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
  }, [user?.id, rehydrated]);

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
    // Only fetch data if auth state is rehydrated
    if (rehydrated) {
      fetchDebts();
    }
  }, [fetchDebts, rehydrated]);
  
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
    isReady: rehydrated && (!loading || retryCount.current > 0),
  };
}
