import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';

import { Loading } from '@/components/ui/Loading';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { tokenCache } from '@/cache';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const { fetchUser, user, loading } = useAuthStore();
	const [isRehydrated, setIsRehydrated] = useState(false);
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	// // Initialize auth state
	// useEffect(() => {
	// 	const init = async () => {
	// 		try {
	// 			// Check if we have a stored session
	// 			const {
	// 				data: { session },
	// 			} = await supabase.auth.getSession();
	// 			if (session) {
	// 				console.log('Found existing session:', session.user.id);
	// 				await fetchUser();
	// 			}
	// 			setIsRehydrated(true);
	// 		} catch (error) {
	// 			console.error('Error initializing auth:', error);
	// 			setIsRehydrated(true);
	// 		}
	// 	};

	// 	init();
	// }, []);

	// if (!loaded || loading || !isRehydrated) {
	// 	console.log('Showing loading screen:', {
	// 		loaded,
	// 		loading,
	// 		isRehydrated,
	// 	});
	// 	return <Loading message="Loading..." />;
	// }

	// if (!user) {
	// 	console.log('No user found, showing auth screens');
	// 	return (
	// 		<Stack>
	// 			<Stack.Screen name="auth/Login" options={{ headerShown: false }} />
	// 			<Stack.Screen name="auth/Register" options={{ headerShown: false }} />
	// 		</Stack>
	// 	);
	// }

	// console.log('User authenticated, showing main app');
	const pubicKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

	return (
		<ClerkProvider publishableKey={pubicKey} tokenCache={tokenCache}>
			<ClerkLoaded>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<Slot />
					</GestureHandlerRootView>
					<StatusBar style="auto" />
				</ThemeProvider>
			</ClerkLoaded>
		</ClerkProvider>
	);
}
