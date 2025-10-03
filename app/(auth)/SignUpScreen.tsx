import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { BodyScrollView } from '@/components/ui/BodyScrollView';
import { useSignUp, useUser } from '@clerk/clerk-expo';
import Toast from '@/components/ui/Toast';
import { ClerkAPIError } from '@clerk/types';
import { DatabaseService } from '@/services/database';

/**
 * SignUpScreen is the screen for users to sign up.
 *
 * - Renders a form with email and password fields.
 * - Handles sign-up using Clerk's `useSignUp` hook.
 * - On successful sign-up, sets the active session and redirects to the home page.
 */
export default function SignUpScreen() {
	const { signUp, setActive, isLoaded } = useSignUp();
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ClerkAPIError[]>([]);

	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState('');

	const [toastMessage, setToastMessage] = useState('');
	const [toastVisible, setToastVisible] = useState(false);

	const { user } = useUser();

	const showToast = () => {
		setToastMessage(errors?.[0]?.longMessage || 'An error occurred during sign up. Please try again.');
		setToastVisible(true);
	};

	const hideToast = () => {
		setToastVisible(false);
	};

	const handleSignup = async () => {
		if (!isLoaded) return;
		setIsLoading(true);
		setErrors([]);

		try {
			const k = await signUp.create({
				emailAddress: email,
				password,
			});
			const l = await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			setPendingVerification(true);
			console.log('l ', l);
		} catch (error: any) {
			console.error(JSON.stringify(error, null, 2));
			setErrors(error.errors);
			if (error?.errors?.[0]?.longMessage) {
				showToast();
			}
		} finally {
			setIsLoading(false);
		}
	};

	const onVerifyPress = async () => {
		if (!isLoaded) return;
		setIsLoading(true);
		setErrors([]);

		try {
			const signupAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});

			if (signupAttempt.status === 'complete') {
				await setActive({ session: signupAttempt.createdSessionId });

				// Create profile after user is fully verified and session is active
				if (signupAttempt.createdUserId) {
					await DatabaseService.createProfile(signupAttempt.createdUserId);
				}
				router.replace('/(tabs)');
			} else {
				console.log(JSON.stringify(signupAttempt, null, 2));
			}
		} catch (error: any) {
			console.error(JSON.stringify(error, null, 2));
			setErrors(error.errors);
			if (error?.errors?.[0]?.longMessage) {
				showToast();
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (pendingVerification) {
		return (
			<>
				<Toast message={toastMessage} visible={toastVisible} onHide={hideToast} type="error" />
				<BodyScrollView contentContainerStyle={{ padding: 16 }}>
					<TextInput
						value={code}
						label={`Enter the verification code we sent to ${email}`}
						placeholder="Enter your verification code"
						onChangeText={(code) => setCode(code)}
					/>
					<Button onPress={onVerifyPress} disabled={!code || isLoading} loading={isLoading}>
						Verify
					</Button>
				</BodyScrollView>
			</>
		);
	}

	return (
		<>
			<Toast message={toastMessage} visible={toastVisible} onHide={hideToast} type="error" />
			<BodyScrollView contentContainerStyle={{ padding: 16 }}>
				<TextInput label="Email" value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
				<TextInput
					label="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					placeholder="Password"
					autoCapitalize="none"
					keyboardType="visible-password"
				/>
				<Button onPress={handleSignup} loading={isLoading} disabled={isLoading || !email || !password}>
					Sign up
				</Button>
			</BodyScrollView>
		</>
	);
}
