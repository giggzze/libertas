import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { Database } from "../types/supabase";
import { useSession } from "@clerk/clerk-expo";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
}

export const useSupabase = () => {
    const { session } = useSession();

    return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        },
        global: {
            // Get the custom Supabase token from Clerk
            fetch: async (url, options = {}) => {
                // The Clerk `session` object has the getToken() method

                const clerkToken = await session?.getToken();

                console.log("clerkToken", clerkToken);

                // Insert the Clerk Supabase token into the headers
                const headers = new Headers(options?.headers);
                headers.set("Authorization", `Bearer ${clerkToken}`);

                // Call the default fetch
                return fetch(url, {
                    ...options,
                    headers
                });
            }
        }
    });
};