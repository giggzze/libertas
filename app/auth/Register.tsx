import { useAuthStore } from "@/store/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function RegisterScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { register, loading, error } = useAuthStore();
	const router = useRouter();

	const handleRegister = async () => {
		await register(email, password);
		// If registration is successful, Zustand will update user state
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Register</Text>
			<TextInput
				style={styles.input}
				placeholder='Email'
				autoCapitalize='none'
				keyboardType='email-address'
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder='Password'
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			{error && <Text style={styles.error}>{error}</Text>}
			<TouchableOpacity
				style={styles.button}
				onPress={handleRegister}
				disabled={loading}>
				{loading ? (
					<ActivityIndicator color='#fff' />
				) : (
					<Text style={styles.buttonText}>Register</Text>
				)}
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.replace("/auth/Login")}>
				<Text style={styles.link}>Already have an account? Login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 32,
		color: "#333",
	},
	input: {
		width: "100%",
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		fontSize: 16,
		marginBottom: 16,
	},
	button: {
		width: "100%",
		backgroundColor: "#007AFF",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 16,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	error: {
		color: "#ff3b30",
		marginBottom: 12,
		textAlign: "center",
	},
	link: {
		color: "#007AFF",
		marginTop: 8,
		fontSize: 16,
	},
});
