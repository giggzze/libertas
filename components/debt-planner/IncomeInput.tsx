import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface IncomeInputProps {
	income: string;
	onIncomeChange: (income: string) => void;
}

export function IncomeInput({ income, onIncomeChange }: IncomeInputProps) {
	const [isSaved, setIsSaved] = useState(false);

	const handleSave = () => {
		if (income) {
			setIsSaved(true);
			// We'll implement the actual save functionality later
			setTimeout(() => setIsSaved(false), 2000); // Hide success message after 2 seconds
		}
	};

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Monthly Income</Text>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder='Enter your monthly income'
					keyboardType='numeric'
					value={income}
					onChangeText={text => {
						onIncomeChange(text);
						setIsSaved(false);
					}}
				/>
				<TouchableOpacity
					style={[
						styles.saveButton,
						!income && styles.saveButtonDisabled,
					]}
					onPress={handleSave}
					disabled={!income}>
					<IconSymbol
						name='checkmark'
						size={20}
						color='white'
					/>
				</TouchableOpacity>
			</View>
			{isSaved && (
				<Text style={styles.successMessage}>
					Income saved successfully!
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
		color: "#333",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		flex: 1,
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		fontSize: 16,
		marginRight: 8,
	},
	saveButton: {
		backgroundColor: "#007AFF",
		width: 44,
		height: 44,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	saveButtonDisabled: {
		backgroundColor: "#ccc",
	},
	successMessage: {
		color: "#34C759",
		marginTop: 8,
		fontSize: 14,
	},
});
