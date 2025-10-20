import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { tokenCache } from '@/src/cache';
import { Text, View, StyleSheet } from 'react-native';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
	});

	const publicKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    console.log(publicKey)

	// Show error message if Clerk key is missing
	if (!publicKey) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Key is empty</Text>
			</View>
		);
	}

	return (
		<ClerkProvider publishableKey={publicKey} tokenCache={tokenCache}>
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

const styles = StyleSheet.create({
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		padding: 20,
	},
	errorText: {
		fontSize: 18,
		color: '#333',
		textAlign: 'center',
		fontWeight: '500',
	},
});
