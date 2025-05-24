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
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Add New Debt</Text>

					<TextInput
						style={styles.input}
						placeholder='Debt Name'
						value={newDebt.name}
						onChangeText={text =>
							onNewDebtChange({ ...newDebt, name: text })
						}
					/>

					<TextInput
						style={styles.input}
						placeholder='Amount'
						keyboardType='numeric'
						value={newDebt.amount}
						onChangeText={text =>
							onNewDebtChange({ ...newDebt, amount: text })
						}
					/>

					<TextInput
						style={styles.input}
						placeholder='Interest Rate (%)'
						keyboardType='numeric'
						value={newDebt.interestRate}
						onChangeText={text =>
							onNewDebtChange({ ...newDebt, interestRate: text })
						}
					/>

					<TextInput
						style={styles.input}
						placeholder='Minimum Payment'
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
							style={[styles.modalButton, styles.cancelButton]}
							onPress={onClose}>
							<Text style={styles.modalButtonText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.modalButton, styles.addButton]}
							onPress={handleAdd}>
							<Text style={styles.modalButtonText}>Add</Text>
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
		backgroundColor: "white",
		borderRadius: 12,
		padding: 24,
		width: "90%",
		maxWidth: 400,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	input: {
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
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
	cancelButton: {
		backgroundColor: "#E5E5EA",
	},
	addButton: {
		backgroundColor: "#007AFF",
	},
	modalButtonText: {
		color: "white",
		fontWeight: "600",
		fontSize: 16,
	},
});
