import { DatabaseService } from "@/services/database";
import { DebtPayment, DebtPaymentInsert } from "@/types/STT";
import { useCallback, useEffect, useState } from "react";

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
      setError(err instanceof Error ? err.message : "Failed to fetch payments");
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
