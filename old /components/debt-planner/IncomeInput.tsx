import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
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
	
	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	const handleSave = () => {
		if (income) {
			setIsSaved(true);
			// We'll implement the actual save functionality later
			setTimeout(() => setIsSaved(false), 2000); // Hide success message after 2 seconds
		}
	};

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, { color: textColor }]}>Monthly Income</Text>
			<View style={styles.inputContainer}>
				<TextInput
					style={[
						styles.input, 
						{ 
							backgroundColor: backgroundColor,
							color: textColor,
							borderColor: isDark ? "#4a5568" : "#ddd" 
						}
					]}
					placeholder='Enter your monthly income'
					placeholderTextColor={iconColor}
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
						{ backgroundColor: tintColor },
						!income && styles.saveButtonDisabled,
					]}
					onPress={handleSave}
					disabled={!income}>
					<IconSymbol
						name='checkmark'
						size={20}
						color={isDark ? "#000" : "#fff"}
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
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 16,
		marginRight: 8,
	},
	saveButton: {
		width: 44,
		height: 44,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	saveButtonDisabled: {
		backgroundColor: "#ccc",
		opacity: 0.7,
	},
	successMessage: {
		color: "#34C759",
		marginTop: 8,
		fontSize: 14,
	},
});
