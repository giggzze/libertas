import { ThemedText } from '@/components/themed-text';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { BodyScrollView } from '@/components/ui/BodyScrollView';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';

/**
 * SignInScreen is the main authentication screen for users to sign in.
 *
 * - Renders a form with email and password fields.
 * - Handles sign-in using Clerk's `useSignIn` hook.
 * - On successful sign-in, sets the active session and redirects to the home page.
 * - Provides navigation to sign-up and password reset screens.
 * - Displays loading and disables the sign-in button while signing in or if fields are empty.
 */
export default function SignInScreen() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSingingIn] = useState(false);

	const handleSignIn = async () => {
		if (!isLoaded) return;

		// Start the sign-in process using the email and password provided
		try {
			const signInAttempt = await signIn.create({
				identifier: email,
				password,
			});

			// If sign-in process is complete, set the created session as active
			// and redirect the user
			if (signInAttempt.status === 'complete') {
				await setActive({ session: signInAttempt.createdSessionId });
				router.replace('/');
			} else {
				// If the status isn't complete, check why. User might need to
				// complete further steps.
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<BodyScrollView contentContainerStyle={{ padding: 16 }}>
			<TextInput label="Email" value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
			<TextInput
				label="Password"
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
				autoCapitalize="none"
				keyboardType="visible-password"
			/>
			<Button onPress={handleSignIn} loading={isSingingIn} disabled={isSingingIn || !email || !password}>
				Sign in
			</Button>

			<View style={{ marginTop: 16, alignItems: 'center' }}>
				<ThemedText>Don&#39;t have an account?</ThemedText>
				<Button variant="ghost" onPress={() => router.push('/SignUpScreen')}>
					Sign up
				</Button>
			</View>

			<View style={{ marginTop: 16, alignItems: 'center' }}>
				<ThemedText>Forgot password?</ThemedText>
				<Button variant="ghost" onPress={() => router.push('/ResetPasswordScreen')}>
					Reset password
				</Button>
			</View>
		</BodyScrollView>
	);
}
