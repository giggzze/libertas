import { useMonthlyIncome } from "@/hooks/useDatabase";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function ProfileScreen() {
	const { user, logout, loading: authLoading } = useAuthStore();
	const {
		currentIncome,
		createIncome,
		loading: incomeLoading,
	} = useMonthlyIncome();
	const [newIncome, setNewIncome] = useState("");
	const router = useRouter();

	const handleLogout = async () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Logout",
				style: "destructive",
				onPress: async () => {
					await logout();
					router.replace("/auth/Login");
				},
			},
		]);
	};

	const handleUpdateIncome = async () => {
		if (!newIncome) return;

		const incomeNumber = Number(newIncome);
		if (isNaN(incomeNumber) || incomeNumber <= 0) {
			Alert.alert(
				"Invalid Income",
				"Please enter a valid income amount."
			);
			return;
		}

		try {
			await createIncome({
				amount: incomeNumber,
				start_date: new Date().toISOString().split("T")[0],
			});
			setNewIncome("");
			Alert.alert("Success", "Income updated successfully!");
		} catch (error) {
			Alert.alert("Error", "Failed to update income. Please try again.");
		}
	};

	if (authLoading || incomeLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator
					size='large'
					color='#007AFF'
				/>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Profile</Text>
				<Text style={styles.email}>{user?.email}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Monthly Income</Text>
				<View style={styles.incomeContainer}>
					<Text style={styles.currentIncome}>
						Current: $
						{currentIncome?.amount.toLocaleString() || "0"}
					</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							placeholder='Enter new monthly income'
							keyboardType='numeric'
							value={newIncome}
							onChangeText={setNewIncome}
						/>
						<TouchableOpacity
							style={styles.updateButton}
							onPress={handleUpdateIncome}>
							<Text style={styles.updateButtonText}>Update</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<TouchableOpacity
				style={styles.logoutButton}
				onPress={handleLogout}>
				<Text style={styles.logoutButtonText}>Logout</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		padding: 24,
		paddingTop: 40,
		backgroundColor: "white",
		marginBottom: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	email: {
		fontSize: 16,
		color: "#666",
	},
	section: {
		backgroundColor: "white",
		padding: 20,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	incomeContainer: {
		gap: 16,
	},
	currentIncome: {
		fontSize: 16,
		color: "#666",
	},
	inputContainer: {
		flexDirection: "row",
		gap: 8,
	},
	input: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 12,
		borderRadius: 8,
		fontSize: 16,
	},
	updateButton: {
		backgroundColor: "#007AFF",
		padding: 12,
		borderRadius: 8,
		justifyContent: "center",
	},
	updateButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	logoutButton: {
		backgroundColor: "#ff3b30",
		margin: 24,
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	logoutButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
});
