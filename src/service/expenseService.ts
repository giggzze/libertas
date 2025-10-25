import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/src/types/supabase";
import { Expense, ExpenseInsert } from "@/src/types/STT";

export const getUserExpenses = async (userId: string, supabase: SupabaseClient<Database>):
    Promise<Expense[]> => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

    if (error) {
        console.log(error);
        return  [];
    }

    if (!data) return [];

    return data
}


export const createExpense = async (expense: ExpenseInsert, supabase : SupabaseClient<Database>):
    Promise<Expense | null> => {
    const { data, error } = await supabase.from('expenses')
        .insert([expense])
        .select()
        .single();

    if (error) {
        console.error('Error creating expense:', error);
        return null;
    }

    return data;
}