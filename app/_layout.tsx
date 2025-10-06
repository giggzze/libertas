import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { tokenCache } from '@/cache';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	const pubicKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    console.log(pubicKey)

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
