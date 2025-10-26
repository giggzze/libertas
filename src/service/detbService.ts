import { SupabaseClient } from "@supabase/supabase-js";
import { Debt, DebtInsert } from "@/src/types/STT";
import { Database } from "@/src/types/supabase";


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


export const createDebt =
    async (debt: DebtInsert, userId: string, supabase: SupabaseClient<Database>):
    Promise<Debt | null> => {
    const { data, error } = await supabase
        .from("debts")
        .insert({
            ...debt,
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating debt:", error);
        return null;
    }

    return data;
};