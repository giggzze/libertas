import { SupabaseClient } from "@supabase/supabase-js";
import { MonthlyIncome } from "@/src/types/STT";

export const getCurrentMonthlyIncome = async (userId: string, supabase: SupabaseClient):
    Promise<MonthlyIncome | null> => {
    const { data, error } = await supabase
        .from("monthly_income")
        .select()
        .eq("user_id", userId)
        .order("start_date", { ascending: false })
        .maybeSingle();

    console.log(typeof data)

    if (error) {
        console.error("Error fetching monthly income:", error);
        return null
    }

    if (!data) return null

    return data;
};