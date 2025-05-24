import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Expense } from "@/types/STT";
import React, { useState } from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface AddExpenseModalProps {
	visible: boolean;
	onClose: () => void;
	onAdd: (expense: { name: string; amount: string; dueDate: string }) => void;
	expense?: Expense;
}

export function AddExpenseModal({
	visible,
	onClose,
	onAdd,
	expense,
}: AddExpenseModalProps) {
	const [name, setName] = useState(expense?.name || "");
	const [amount, setAmount] = useState(expense?.amount.toString() || "");
	const [dueDate, setDueDate] = useState(expense?.due_date.toString() || "");

	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const textColor = useThemeColor({}, "text");
	const iconColor = useThemeColor({}, "icon");
	const tintColor = useThemeColor({}, "tint");
	const backgroundColor = useThemeColor({}, "background");

	const handleAdd = () => {
		onAdd({ name, amount, dueDate });
		setName("");
		setAmount("");
		setDueDate("");
	};

	return (
		<Modal
			visible={visible}
			animationType='slide'
			transparent={true}
			onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<View
					style={[
						styles.modalContent,
						{
							backgroundColor: isDark ? "#2d3748" : "white",
							borderColor: isDark ? "#4a5568" : "#ddd",
						},
					]}>
					<Text style={[styles.title, { color: textColor }]}>
						{expense ? "Edit Expense" : "Add Expense"}
					</Text>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: isDark ? "#1a202c" : "#f5f5f5",
								color: textColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
							},
						]}
						placeholder='Expense name'
						placeholderTextColor={iconColor}
						value={name}
						onChangeText={setName}
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: isDark ? "#1a202c" : "#f5f5f5",
								color: textColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
							},
						]}
						placeholder='Amount'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={amount}
						onChangeText={setAmount}
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: isDark ? "#1a202c" : "#f5f5f5",
								color: textColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
							},
						]}
						placeholder='Due date (1-31)'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={dueDate}
						onChangeText={setDueDate}
					/>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={onClose}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.button,
								{ backgroundColor: tintColor },
							]}
							onPress={handleAdd}>
							<Text
								style={[
									styles.buttonText,
									{ color: isDark ? "#000" : "#fff" },
								]}>
								{expense ? "Save" : "Add"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "90%",
		padding: 20,
		borderRadius: 12,
		borderWidth: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		fontSize: 16,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	button: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#e2e8f0",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
	},
});
