import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/src/types/supabase";
import { Expense } from "@/src/types/STT";

export const getUserExpenses = async (userId: string, supabase: SupabaseClient<Database>):
    Promise<Expense[]> => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

    if (error) {
        console.log(error);
        return  [] as Expense[];
    }

    if (!data) return [] as Expense[];

    return data
}