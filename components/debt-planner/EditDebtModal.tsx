import React from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface Debt {
	id: string;
	name: string;
	amount: number;
	interestRate: number;
	minimumPayment: number;
}

interface EditDebtModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (debt: Debt) => void;
	debt: Debt | null;
}

export function EditDebtModal({
	visible,
	onClose,
	onSave,
	debt,
}: EditDebtModalProps) {
	const [editedDebt, setEditedDebt] = React.useState<Debt | null>(null);

	React.useEffect(() => {
		if (debt) {
			setEditedDebt(debt);
		}
	}, [debt]);

	const handleSave = () => {
		if (!editedDebt) return;
		onSave(editedDebt);
	};

	if (!editedDebt) return null;

	return (
		<Modal
			visible={visible}
			animationType='slide'
			transparent={true}
			onRequestClose={onClose}>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Edit Debt</Text>

					<TextInput
						style={styles.input}
						placeholder='Debt Name'
						value={editedDebt.name}
						onChangeText={text =>
							setEditedDebt({ ...editedDebt, name: text })
						}
					/>

					<TextInput
						style={styles.input}
						placeholder='Amount'
						keyboardType='numeric'
						value={editedDebt.amount.toString()}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								amount: Number(text) || 0,
							})
						}
					/>

					<TextInput
						style={styles.input}
						placeholder='Interest Rate (%)'
						keyboardType='numeric'
						value={editedDebt.interestRate.toString()}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								interestRate: Number(text) || 0,
							})
						}
					/>

					<TextInput
						style={styles.input}
						placeholder='Minimum Payment'
						keyboardType='numeric'
						value={editedDebt.minimumPayment.toString()}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								minimumPayment: Number(text) || 0,
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
							style={[styles.modalButton, styles.saveButton]}
							onPress={handleSave}>
							<Text style={styles.modalButtonText}>Save</Text>
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
	saveButton: {
		backgroundColor: "#007AFF",
	},
	modalButtonText: {
		color: "white",
		fontWeight: "600",
		fontSize: 16,
	},
});
