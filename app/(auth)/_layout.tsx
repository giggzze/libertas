import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

/**
 * AuthLayout is the layout component for authentication-related screens.
 *
 * - If the authentication state is not loaded, it returns null.
 * - If the user is already signed in, it redirects to the main tabs route.
 * - Otherwise, it renders a Stack navigator with screens for sign in, sign up, and password reset.
 * - On iOS, it applies large title and transparent header styles for a native look.
 */
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
			<Stack.Screen name="SignUpScreen" options={{ headerTitle: 'Sign Up' }} />
			<Stack.Screen name="reset-password" options={{ headerTitle: 'Reset password' }} />
		</Stack>
	);
}
