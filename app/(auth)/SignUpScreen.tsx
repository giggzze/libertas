import { View, Text } from 'react-native';

import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { BodyScrollView } from '@/components/ui/BodyScrollView';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { ThemedText } from '@/components/ThemedText';
import { ClerkAPIError } from '@clerk/types';

export default function SignUpScreen() {
	const { signUp, setActive, isLoaded } = useSignUp();
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ClerkAPIError[]>([]);

	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState('');

	const handleSignup = async () => {
		if (!isLoaded) return;
		setIsLoading(true);
		setErrors([]);

		try {
			await signUp.create({
				emailAddress: email,
				password,
			});
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			setPendingVerification(true);
		} catch (error) {
			console.error(JSON.stringify(error, null, 2));
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
				router.replace('/(tabs)');
			} else {
				console.log(JSON.stringify(signupAttempt, null, 2));
			}
		} catch (error) {
			console.error(JSON.stringify(error, null, 2));
		} finally {
			setIsLoading(false);
		}
	};

	if (pendingVerification) {
		return (
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
				{errors.map((error) => (
					<ThemedText key={error.longMessage} style={{ color: 'red' }}>
						{error.longMessage}
					</ThemedText>
				))}
			</BodyScrollView>
		);
	}

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
			<Button onPress={handleSignup} loading={isLoading} disabled={isLoading || !email || !password}>
				Sign up
			</Button>

			{errors.map((error) => (
				<ThemedText key={error.message} style={{ color: 'red' }}>
					{error.longMessage}
				</ThemedText>
			))}
		</BodyScrollView>
	);
}
