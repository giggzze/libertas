import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Debt, DebtCategory } from "@/src/types/STT";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const categoryLabels: Record<DebtCategory, string> = {
	CREDIT_CARD: "Credit Card",
	OVERDRAFT: "Overdraft",
	CAR_LOAN: "Car Loan",
	PERSONAL_LOAN: "Personal Loan",
	SUBSCRIPTION: "Subscription",
	OTHER: "Other",
};

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
				interest_rate: debt.interest_rate ?? 0,
				minimum_payment: debt.minimum_payment ?? 0,
				category: debt.category ?? "OTHER",
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

					<View
						style={[
							styles.pickerContainer,
							{
								backgroundColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
							},
						]}>
						<Picker
							selectedValue={editedDebt.category}
							onValueChange={(value: DebtCategory) =>
								setEditedDebt({
									...editedDebt,
									category: value,
								})
							}
							style={[
								styles.picker,
								{
									color: textColor,
								},
							]}
							dropdownIconColor={textColor}>
							{Object.entries(categoryLabels).map(
								([value, label]) => (
									<Picker.Item
										key={value}
										label={label}
										value={value}
										color={textColor}
									/>
								)
							)}
						</Picker>
					</View>

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
							editedDebt.interest_rate !== undefined
								? editedDebt.interest_rate.toString()
								: ""
						}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								interest_rate: Number(text) || 0,
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
							editedDebt.minimum_payment !== undefined
								? editedDebt.minimum_payment.toString()
								: ""
						}
						onChangeText={text =>
							setEditedDebt({
								...editedDebt,
								minimum_payment: Number(text) || 0,
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
	pickerContainer: {
		borderRadius: 8,
		borderWidth: 1,
		marginBottom: 12,
		overflow: "hidden",
	},
	picker: {
		height: Platform.OS === "ios" ? 150 : 50,
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
