import { useAuth } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
	const { isLoaded, isSignedIn } = useAuth();

	if (!isLoaded) {
		return null;
	}

	if (isSignedIn) {
		return <Redirect href="/(tabs)" />;
	}

	return (
		<Stack
			screenOptions={{
				...(process.env.EXPO_OS !== 'ios'
					? {}
					: {
							headerLargeTitle: true,
							headerTransparent: true,
							headerBlurEffect: 'systemChromeMaterial',
							headerLargeTitleShadowVisible: false,
							headerShadowVisible: true,
							headerLargeStyle: {
								backgroundColor: 'transparent',
							},
						}),
			}}
		>
			<Stack.Screen name="index" options={{ headerTitle: 'Welcome back!', headerShown: true }} />
			<Stack.Screen name="sign-up" options={{ headerTitle: 'Sign up' }} />
			<Stack.Screen name="reset-password" options={{ headerTitle: 'Reset password' }} />
		</Stack>
	);
}
