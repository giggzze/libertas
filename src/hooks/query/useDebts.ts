import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/src/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { getAllUserDebts } from "@/src/service/detbService";

/**
 * React Query hook for fetching user debts with payments
 * Provides automatic caching, background updates, and error handling
 */
export function useDebts(includePaid: boolean) {
    const { user } = useUser();
    const supabase = useSupabase();
    console.log("the correct use debts hook is being called");

    return useQuery({
        queryKey: ["debts", user?.id],
        queryFn: () => getAllUserDebts(user!.id, false, supabase),
        enabled: !!user?.id,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000 // 5 minutes (formerly cacheTime)
    });
}