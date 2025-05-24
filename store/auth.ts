import { supabase } from "@/utils/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
	user: any;
	loading: boolean;
	error: string | null;
	session: any;
	setUser: (user: any) => void;
	setSession: (session: any) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			user: null,
			loading: false,
			error: null,
			session: null,

			setUser: user => {
				console.log("Setting user:", user?.id);
				set({ user });
			},
			setSession: session => {
				console.log("Setting session:", session?.user?.id);
				set({ session });
			},
			setLoading: loading => set({ loading }),
			setError: error => set({ error }),

			login: async (email, password) => {
				set({ loading: true, error: null });
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) {
					set({
						error: error.message,
						loading: false,
						user: null,
						session: null,
					});
				} else {
					set({
						user: data.user,
						session: data.session,
						loading: false,
						error: null,
					});
				}
			},

			register: async (email, password) => {
				set({ loading: true, error: null });
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
				});
				if (error) {
					set({
						error: error.message,
						loading: false,
						user: null,
						session: null,
					});
				} else {
					set({
						user: data.user,
						session: data.session,
						loading: false,
						error: null,
					});
				}
			},

			logout: async () => {
				set({ loading: true, error: null });
				const { error } = await supabase.auth.signOut();
				if (error) {
					set({ error: error.message, loading: false });
				} else {
					set({
						user: null,
						session: null,
						loading: false,
						error: null,
					});
				}
			},

			fetchUser: async () => {
				console.log("Fetching user...");
				set({ loading: true });
				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();
				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				console.log("Fetch results:", {
					user: user?.id,
					session: session?.user?.id,
					userError,
					sessionError,
				});

				if (userError || sessionError) {
					set({
						user: null,
						session: null,
						loading: false,
					});
				} else {
					set({
						user,
						session,
						loading: false,
					});
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
			onRehydrateStorage: () => state => {
				console.log("Rehydrated state:", state);
			},
		}
	)
);

// Supabase auth state change listener to sync Zustand user state
supabase.auth.onAuthStateChange((_event, session) => {
	console.log("Auth state changed:", {
		event: _event,
		userId: session?.user?.id,
	});
	const { setUser, setSession } = useAuthStore.getState();
	setUser(session?.user ?? null);
	setSession(session ?? null);
});
