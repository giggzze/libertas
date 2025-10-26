import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/src/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { getUserExpenses } from "@/src/service/expenseService";

export function useExpenses() {
    const { user } = useUser();
    const supabase = useSupabase();

    return useQuery({
        queryKey: ["expenses", user?.id],
        queryFn: () => getUserExpenses(user!.id, supabase),
        staleTime: 2 * 60 * 1000
    });
}