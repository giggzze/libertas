import { supabase } from "@/utils/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
	user: any;
	loading: boolean;
	error: string | null;
	session: any;
	rehydrated: boolean;
	setUser: (user: any) => void;
	setSession: (session: any) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setRehydrated: (rehydrated: boolean) => void;
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
			rehydrated: false,

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
			setRehydrated: rehydrated => set({ rehydrated }),

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
				try {
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
							error: userError?.message || sessionError?.message || "Authentication error",
						});
					} else {
						set({
							user,
							session,
							loading: false,
							error: null,
						});
					}
				} catch (error) {
					console.error("Error fetching user:", error);
					set({
						loading: false,
						error: error instanceof Error ? error.message : "Failed to fetch user",
					});
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
			onRehydrateStorage: () => state => {
				console.log("Rehydrated state from storage:", state?.user?.id ? "User found" : "No user");
				if (state) {
					// Don't immediately set rehydrated true - we need to verify the session first
					// Instead, we'll verify the session with Supabase
					if (state.session) {
						// Check if the session is still valid with Supabase
						supabase.auth.getSession().then(({ data: { session } }) => {
							console.log("Session verification:", session ? "Valid" : "Invalid");
							if (session) {
								// Session is valid, update state with current session
								state.setUser(session.user);
								state.setSession(session);
								state.setRehydrated(true);
								state.setError(null);
							} else {
								// Session is invalid, clear user and session
								state.setUser(null);
								state.setSession(null);
								state.setRehydrated(true);
								state.setError("Session expired");
							}
						}).catch(error => {
							console.error("Error verifying session:", error);
							state.setRehydrated(true);
							state.setError("Failed to verify session");
						});
					} else {
						// No session in storage, just mark as rehydrated
						state.setRehydrated(true);
					}
				}
			},
		}
	)
);

// Initialize auth state on app load
const initializeAuthState = async () => {
	console.log("Initializing auth state...");
	const { setUser, setSession, setRehydrated, fetchUser } = useAuthStore.getState();
	
	try {
		// First check if we have a session in Supabase's own storage
		const { data: { session } } = await supabase.auth.getSession();
		console.log("Initial session check:", session?.user?.id ? "Found session" : "No session");
		
		if (session) {
			setUser(session.user);
			setSession(session);
			setRehydrated(true);
		} else {
			// If no session, ensure user state is cleared
			setUser(null);
			setSession(null);
			setRehydrated(true);
		}
	} catch (error) {
		console.error("Error initializing auth state:", error);
		setRehydrated(true); // Still mark as rehydrated so the app can proceed
	}
};

// Initialize auth state when this module loads
initializeAuthState();

// Supabase auth state change listener to sync Zustand user state
supabase.auth.onAuthStateChange((_event, session) => {
	console.log("Auth state changed:", {
		event: _event,
		userId: session?.user?.id,
	});
	const { setUser, setSession, setRehydrated } = useAuthStore.getState();
	setUser(session?.user ?? null);
	setSession(session ?? null);
	// Ensure rehydrated is true after auth state changes
	setRehydrated(true);
});
