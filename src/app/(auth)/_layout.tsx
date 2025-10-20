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
				headerShown: false
			}}
		>
			<Stack.Screen name="index" options={{ headerTitle: 'Log in'}} />
			<Stack.Screen name="SignUpScreen" options={{ headerTitle: '', headerShown: true }} />
			<Stack.Screen name="ResetPasswordScreen" options={{ headerTitle: '', headerShown: true }} />
		</Stack>
	);
}
