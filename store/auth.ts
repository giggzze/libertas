import { localDatabase } from "@/services/localDatabase";
import { supabase } from "@/utils/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
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
				// Store in local database
				localDatabase.setAuthState(
					user,
					useAuthStore.getState().session
				);
			},
			setSession: session => {
				console.log("Setting session:", session?.user?.id);
				set({ session });
				// Store in local database
				localDatabase.setAuthState(
					useAuthStore.getState().user,
					session
				);
			},
			setLoading: loading => set({ loading }),
			setError: error => set({ error }),
			setRehydrated: rehydrated => set({ rehydrated }),

			login: async (email, password) => {
				set({ loading: true, error: null });
				try {
					const { data, error } =
						await supabase.auth.signInWithPassword({
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
						await localDatabase.clearAuthState();
					} else {
						set({
							user: data.user,
							session: data.session,
							loading: false,
							error: null,
						});
						await localDatabase.setAuthState(
							data.user,
							data.session
						);
					}
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: "Login failed",
						loading: false,
						user: null,
						session: null,
					});
					await localDatabase.clearAuthState();
				}
			},

			register: async (email, password) => {
				set({ loading: true, error: null });
				try {
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
						await localDatabase.clearAuthState();
					} else {
						set({
							user: data.user,
							session: data.session,
							loading: false,
							error: null,
						});
						await localDatabase.setAuthState(
							data.user,
							data.session
						);
					}
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: "Registration failed",
						loading: false,
						user: null,
						session: null,
					});
					await localDatabase.clearAuthState();
				}
			},

			logout: async () => {
				set({ loading: true, error: null });
				try {
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
						await localDatabase.clearAuthState();
					}
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: "Logout failed",
						loading: false,
					});
					await localDatabase.clearAuthState();
				}
			},

			fetchUser: async () => {
				console.log("Fetching user...");
				set({ loading: true });
				try {
					// Check network status
					const netInfo = await NetInfo.fetch();
					const isOnline = netInfo.isConnected ?? false;

					if (isOnline) {
						// Online: Try to get fresh data from Supabase
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
							// If online fetch fails, try local database
							const localAuth =
								await localDatabase.getAuthState();
							if (localAuth) {
								set({
									user: localAuth.user,
									session: localAuth.session,
									loading: false,
									error: null,
								});
							} else {
								set({
									user: null,
									session: null,
									loading: false,
									error:
										userError?.message ||
										sessionError?.message ||
										"Authentication error",
								});
							}
						} else {
							set({
								user,
								session,
								loading: false,
								error: null,
							});
							await localDatabase.setAuthState(user, session);
						}
					} else {
						// Offline: Use local database
						const localAuth = await localDatabase.getAuthState();
						if (localAuth) {
							set({
								user: localAuth.user,
								session: localAuth.session,
								loading: false,
								error: null,
							});
						} else {
							set({
								user: null,
								session: null,
								loading: false,
								error: "No internet connection and no local session found",
							});
						}
					}
				} catch (error) {
					console.error("Error fetching user:", error);
					set({
						loading: false,
						error:
							error instanceof Error
								? error.message
								: "Failed to fetch user",
					});
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
			onRehydrateStorage: () => async state => {
				console.log(
					"Rehydrated state from storage:",
					state?.user?.id ? "User found" : "No user"
				);
				if (state) {
					try {
						// Check network status first
						const netInfo = await NetInfo.fetch();
						const isOnline = netInfo.isConnected ?? false;

						if (isOnline && state.session) {
							// Online: Verify session with Supabase
							try {
								const {
									data: { session },
								} = await supabase.auth.getSession();
								console.log(
									"Session verification:",
									session ? "Valid" : "Invalid"
								);
								if (session) {
									// Session is valid, update state with current session
									state.setUser(session.user);
									state.setSession(session);
									state.setRehydrated(true);
									state.setError(null);
								} else {
									// Session is invalid, try local database
									const localAuth =
										await localDatabase.getAuthState();
									if (localAuth) {
										state.setUser(localAuth.user);
										state.setSession(localAuth.session);
										state.setRehydrated(true);
										state.setError(null);
									} else {
										state.setUser(null);
										state.setSession(null);
										state.setRehydrated(true);
										state.setError("Session expired");
									}
								}
							} catch (error) {
								console.error(
									"Error verifying session:",
									error
								);
								// If verification fails, try local database
								const localAuth =
									await localDatabase.getAuthState();
								if (localAuth) {
									state.setUser(localAuth.user);
									state.setSession(localAuth.session);
									state.setRehydrated(true);
									state.setError(null);
								} else {
									state.setRehydrated(true);
									state.setError("Failed to verify session");
								}
							}
						} else {
							// Offline: Use local database
							const localAuth =
								await localDatabase.getAuthState();
							if (localAuth) {
								state.setUser(localAuth.user);
								state.setSession(localAuth.session);
								state.setRehydrated(true);
								state.setError(null);
							} else {
								state.setRehydrated(true);
								state.setError(
									"No internet connection and no local session found"
								);
							}
						}
					} catch (error) {
						console.error("Error during rehydration:", error);
						state.setRehydrated(true);
						state.setError("Failed to restore session");
					}
				}
			},
		}
	)
);

// Initialize auth state on app load
const initializeAuthState = async () => {
	console.log("Initializing auth state...");
	const { setUser, setSession, setRehydrated, fetchUser } =
		useAuthStore.getState();

	try {
		// Check network status first
		const netInfo = await NetInfo.fetch();
		const isOnline = netInfo.isConnected ?? false;

		if (isOnline) {
			// Online: Try Supabase first
			const {
				data: { session },
			} = await supabase.auth.getSession();
			console.log(
				"Initial session check:",
				session?.user?.id ? "Found session" : "No session"
			);

			if (session) {
				setUser(session.user);
				setSession(session);
				setRehydrated(true);
			} else {
				// If no Supabase session, try local database
				const localAuth = await localDatabase.getAuthState();
				if (localAuth) {
					setUser(localAuth.user);
					setSession(localAuth.session);
					setRehydrated(true);
				} else {
					setUser(null);
					setSession(null);
					setRehydrated(true);
				}
			}
		} else {
			// Offline: Use local database
			const localAuth = await localDatabase.getAuthState();
			if (localAuth) {
				setUser(localAuth.user);
				setSession(localAuth.session);
				setRehydrated(true);
			} else {
				setUser(null);
				setSession(null);
				setRehydrated(true);
			}
		}
	} catch (error) {
		console.error("Error initializing auth state:", error);
		// If initialization fails, try local database as last resort
		try {
			const localAuth = await localDatabase.getAuthState();
			if (localAuth) {
				setUser(localAuth.user);
				setSession(localAuth.session);
			}
		} catch (localError) {
			console.error("Error getting local auth state:", localError);
		}
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
