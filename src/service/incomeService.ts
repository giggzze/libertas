import { SupabaseClient } from "@supabase/supabase-js";
import { MonthlyIncome } from "@/src/types/STT";

export const getCurrentMonthlyIncome = async (userId: string, supabase: SupabaseClient):
    Promise<MonthlyIncome> => {
    const { data, error } = await supabase
        .from("monthly_income")
        .select()
        .eq("user_id", userId)
        .order("start_date", { ascending: false })
        .maybeSingle();

    if (error) {
        console.error("Error fetching monthly income:", error);
        return  { amount: 0} as MonthlyIncome;
    }

    if (!data) return  { amount: 0} as MonthlyIncome;
    return data;
};