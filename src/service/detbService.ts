import { SupabaseClient } from "@supabase/supabase-js";
import { Debt } from "@/src/types/STT";


export const getAllUserDebts = async (
    userId: string,
    includePaid: boolean = true,
    supabase: SupabaseClient
): Promise<Debt[]> => {
    let query = supabase.from("debts")
        .select("*")
        .eq("user_id", userId);

    if (!includePaid) {
        query = query.eq("is_paid", includePaid);
    }

    const { data, error } = await query.order("created_at", {
        ascending: false
    });

    if (error) {
        console.error("Error fetching all debts:", error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data;
};