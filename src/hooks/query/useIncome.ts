import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/src/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMonthlyIncome } from "@/src/service/incomeService";
import { MonthlyIncome } from "@/src/types/STT";

export function useCurrentIncome() {
    const { user } = useUser();
    const supabase = useSupabase();

    return useQuery<MonthlyIncome>({
        queryKey: ['currentIncome', user?.id],
        queryFn: () =>  getCurrentMonthlyIncome(user!.id, supabase),
        // enabled: !!user?.id,
        staleTime: 5 * 60 * 1000, // 5 minutes (income changes less frequently)
    });
}