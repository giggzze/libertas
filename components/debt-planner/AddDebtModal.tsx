import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface NewDebt {
	name: string;
	amount: string;
	interestRate: string;
	minimumPayment: string;
}

interface AddDebtModalProps {
	visible: boolean;
	onClose: () => void;
	onAdd: (debt: NewDebt) => void;
	newDebt: NewDebt;
	onNewDebtChange: (debt: NewDebt) => void;
}

export function AddDebtModal({
	visible,
	onClose,
	onAdd,
	newDebt,
	onNewDebtChange,
}: AddDebtModalProps) {
	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	const handleAdd = () => {
		if (
			!newDebt.name ||
			!newDebt.amount ||
			!newDebt.interestRate ||
			!newDebt.minimumPayment
		) {
			return;
		}
		onAdd(newDebt);
	};

	return (
		<Modal
			visible={visible}
			animationType='slide'
			transparent={true}
			onRequestClose={onClose}>
			<View style={styles.modalContainer}>
				<View style={[styles.modalContent, { backgroundColor, borderColor: isDark ? "#4a5568" : "#ddd" }]}>
					<Text style={[styles.modalTitle, { color: textColor }]}>Add New Debt</Text>

					<TextInput
						style={[styles.input, { backgroundColor, borderColor: isDark ? "#4a5568" : "#ddd", color: textColor }]}
						placeholder='Debt Name'
						placeholderTextColor={iconColor}
						value={newDebt.name}
						onChangeText={text =>
							onNewDebtChange({ ...newDebt, name: text })
						}
					/>

					<TextInput
						style={[styles.input, { backgroundColor, borderColor: isDark ? "#4a5568" : "#ddd", color: textColor }]}
						placeholder='Amount'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={newDebt.amount}
						onChangeText={text =>
							onNewDebtChange({ ...newDebt, amount: text })
						}
					/>

					<TextInput
						style={[styles.input, { backgroundColor, borderColor: isDark ? "#4a5568" : "#ddd", color: textColor }]}
						placeholder='Interest Rate (%)'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={newDebt.interestRate}
						onChangeText={text =>
							onNewDebtChange({ ...newDebt, interestRate: text })
						}
					/>

					<TextInput
						style={[styles.input, { backgroundColor, borderColor: isDark ? "#4a5568" : "#ddd", color: textColor }]}
						placeholder='Minimum Payment'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={newDebt.minimumPayment}
						onChangeText={text =>
							onNewDebtChange({
								...newDebt,
								minimumPayment: text,
							})
						}
					/>

					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.modalButton, styles.cancelButton, { backgroundColor: isDark ? "#4a5568" : "#E5E5EA" }]}
							onPress={onClose}>
							<Text style={[styles.modalButtonText, { color: isDark ? "#fff" : "#333" }]}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.modalButton, styles.addButton, { backgroundColor: tintColor }]}
							onPress={handleAdd}>
							<Text style={[styles.modalButtonText, { color: isDark ? "#000" : "#fff" }]}>Add</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		borderRadius: 12,
		padding: 24,
		width: "90%",
		maxWidth: 400,
		borderWidth: 1,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	input: {
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 16,
		marginBottom: 12,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 16,
	},
	modalButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
		marginLeft: 12,
	},
	cancelButton: {},
	addButton: {},
	modalButtonText: {
		fontWeight: "600",
		fontSize: 16,
	},
});
