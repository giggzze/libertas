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

	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	React.useEffect(() => {
		if (debt) {
			setEditedDebt({
				...debt,
				interestRate:
					(debt as any).interestRate ??
					(debt as any).interest_rate ??
					0,
				minimumPayment:
					(debt as any).minimumPayment ??
					(debt as any).minimum_payment ??
					0,
			});
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
				<View
					style={[
						styles.modalContent,
						{
							backgroundColor,
							borderColor: isDark ? "#4a5568" : "#ddd",
							borderWidth: 1,
						},
					]}>
					<Text style={[styles.modalTitle, { color: textColor }]}>
						Edit Debt
					</Text>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
								color: textColor,
							},
						]}
						placeholder='Debt Name'
						placeholderTextColor={iconColor}
						value={editedDebt.name}
						onChangeText={text =>
							setEditedDebt({ ...editedDebt, name: text })
						}
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
								color: textColor,
							},
						]}
						placeholder='Amount'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={
							editedDebt.amount !== undefined
								? editedDebt.amount.toString()
								: ""
						}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								amount: Number(text) || 0,
							})
						}
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
								color: textColor,
							},
						]}
						placeholder='Interest Rate (%)'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={
							editedDebt.interestRate !== undefined
								? editedDebt.interestRate.toString()
								: ""
						}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								interestRate: Number(text) || 0,
							})
						}
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
								color: textColor,
							},
						]}
						placeholder='Minimum Payment'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={
							editedDebt.minimumPayment !== undefined
								? editedDebt.minimumPayment.toString()
								: ""
						}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								minimumPayment: Number(text) || 0,
							})
						}
					/>

					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[
								styles.modalButton,
								styles.cancelButton,
								{
									backgroundColor: isDark
										? "#4a5568"
										: "#E5E5EA",
								},
							]}
							onPress={onClose}>
							<Text
								style={[
									styles.modalButtonText,
									{ color: isDark ? "#fff" : "#333" },
								]}>
								Cancel
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.modalButton,
								styles.saveButton,
								{ backgroundColor: tintColor },
							]}
							onPress={handleSave}>
							<Text
								style={[
									styles.modalButtonText,
									{ color: isDark ? "#000" : "#fff" },
								]}>
								Save
							</Text>
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
	saveButton: {},
	modalButtonText: {
		fontWeight: "600",
		fontSize: 16,
	},
});
