import { SupabaseClient } from "@supabase/supabase-js";
import { MonthlyIncome, MonthlyIncomeInsert } from "@/src/types/STT";
import { Database } from "@/src/types/supabase";

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


export const createMonthlyIncome =
    async (income: MonthlyIncomeInsert, userId: string, supabase : SupabaseClient<Database>):
        Promise<MonthlyIncome | null> => {
    const { data, error } = await supabase
        .from('monthly_income')
        .insert(
            {
                ...income,
                user_id: userId,
            }
        )
        .select()
        .single();

    if (error) {
        console.error('Error creating monthly income:', error);
        return null;
    }

    return data;
}