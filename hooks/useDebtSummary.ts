import { DatabaseService } from "@/services/database";
import { UserDebtSummary } from "@/types/STT";
import { useCallback, useEffect, useState } from "react";
import {useUser} from "@clerk/clerk-expo";

// Complete debt summary hook
export function useDebtSummary() {
  const { user } = useUser();
  const [summary, setSummary] = useState<UserDebtSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const summaryData = await DatabaseService.getUserDebtSummary(user.id);
      setSummary(summaryData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch debt summary"
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
}
