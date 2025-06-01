import { useColorScheme } from "@/hooks/useColorScheme";
import { useMonthlyIncome } from "@/hooks/useMonthlyIncome";
import { useThemeColor } from "@/hooks/useThemeColor";
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

	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

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
				user_id: user?.id,
			});
			setNewIncome("");
			Alert.alert("Success", "Income updated successfully!");
		} catch (error) {
			Alert.alert("Error", "Failed to update income. Please try again.");
		}
	};

	if (authLoading || incomeLoading) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor }]}>
				<ActivityIndicator
					size='large'
					color={tintColor}
				/>
			</View>
		);
	}

	return (
		<ScrollView style={[styles.container, { backgroundColor }]}>
			<View style={[styles.header, { backgroundColor }]}>
				<Text style={[styles.title, { color: textColor }]}>
					Profile
				</Text>
				<Text style={[styles.email, { color: iconColor }]}>
					{user?.email}
				</Text>
			</View>

			<View
				style={[
					styles.section,
					{
						backgroundColor,
						borderColor: isDark ? "#4a5568" : "#ddd",
					},
				]}>
				<Text style={[styles.sectionTitle, { color: textColor }]}>
					Monthly Income
				</Text>
				<View style={styles.incomeContainer}>
					<Text style={[styles.currentIncome, { color: iconColor }]}>
						Current: £
						{currentIncome?.amount.toLocaleString() || "0"}
					</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={[
								styles.input,
								{
									backgroundColor: isDark
										? "#2d3748"
										: "#f5f5f5",
									color: textColor,
								},
							]}
							placeholder='Enter new monthly income'
							placeholderTextColor={iconColor}
							keyboardType='numeric'
							value={newIncome}
							onChangeText={setNewIncome}
						/>
						<TouchableOpacity
							style={[
								styles.updateButton,
								{ backgroundColor: tintColor },
							]}
							onPress={handleUpdateIncome}>
							<Text
								style={[
									styles.updateButtonText,
									{ color: isDark ? "#000" : "#fff" },
								]}>
								Update
							</Text>
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
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		padding: 24,
		paddingTop: 40,
		marginBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
	},
	email: {
		fontSize: 16,
	},
	section: {
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderRadius: 8,
		marginHorizontal: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
	},
	incomeContainer: {
		gap: 16,
	},
	currentIncome: {
		fontSize: 16,
	},
	inputContainer: {
		flexDirection: "row",
		gap: 8,
	},
	input: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		fontSize: 16,
	},
	updateButton: {
		padding: 12,
		borderRadius: 8,
		justifyContent: "center",
	},
	updateButtonText: {
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
