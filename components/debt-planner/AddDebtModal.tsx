import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { DebtCategory } from "@/types/STT";
import { calculateMinimumPayment } from "@/utils/debtCalculations";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect } from "react";
import {
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface AddDebtModalProps {
	visible: boolean;
	onClose: () => void;
	onAdd: (debt: {
		name: string;
		amount: string;
		interest_rate: string;
		minimum_payment: string;
		term_in_months: string;
		category: DebtCategory;
	}) => void;
	newDebt: {
		name: string;
		amount: string;
		interest_rate: string;
		minimum_payment: string;
		term_in_months: string;
		category: DebtCategory;
	};
	onNewDebtChange: (debt: {
		name: string;
		amount: string;
		interest_rate: string;
		minimum_payment: string;
		term_in_months: string;
		category: DebtCategory;
	}) => void;
}

const categoryLabels: Record<DebtCategory, string> = {
	CREDIT_CARD: "Credit Card",
	OVERDRAFT: "Overdraft",
	CAR_LOAN: "Car Loan",
	PERSONAL_LOAN: "Personal Loan",
	SUBSCRIPTION: "Subscription",
	OTHER: "Other",
};

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
	const { user } = useAuthStore();

	// Initialize category if not set
	useEffect(() => {
		if (!newDebt.category) {
			onNewDebtChange({
				...newDebt,
				category: "OTHER",
			});
		}
	}, []);

	const handleAdd = () => {
		// Convert string values to numbers for validation
		const amount = parseFloat(newDebt.amount);
		const interestRate = parseFloat(newDebt.interest_rate);
		const minimumPayment = parseFloat(newDebt.minimum_payment);
		const termInMonths = parseInt(newDebt.term_in_months, 10);

		// Validate all required fields
		if (
			!newDebt.name ||
			isNaN(amount) ||
			isNaN(interestRate) ||
			isNaN(minimumPayment) ||
			isNaN(termInMonths) ||
			amount <= 0 ||
			interestRate < 0 ||
			minimumPayment <= 0 ||
			termInMonths <= 0 ||
			!newDebt.category
		) {
			console.log("Invalid debt values", {
				name: newDebt.name,
				amount,
				interestRate,
				minimumPayment,
				termInMonths,
				category: newDebt.category,
			});
			return;
		}

		// Pass the string values to the parent component
		onAdd({
			name: newDebt.name,
			amount: newDebt.amount,
			interest_rate: newDebt.interest_rate,
			minimum_payment: newDebt.minimum_payment,
			term_in_months: newDebt.term_in_months,
			category: newDebt.category,
		});
	};

	const updateMinimumPayment = (
		amount: string,
		interestRate: string,
		termInMonths: string
	) => {
		const numAmount = parseFloat(amount);
		const numInterestRate = parseFloat(interestRate);
		const numTerm = parseInt(termInMonths, 10);

		if (
			!isNaN(numAmount) &&
			!isNaN(numInterestRate) &&
			!isNaN(numTerm) &&
			numAmount > 0 &&
			numInterestRate >= 0 &&
			numTerm > 0
		) {
			const minPayment = calculateMinimumPayment(
				numAmount,
				numInterestRate,
				numTerm
			);
			onNewDebtChange({
				...newDebt,
				amount,
				interest_rate: interestRate,
				term_in_months: termInMonths,
				minimum_payment: minPayment.toFixed(2),
			});
		}
	};

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
						},
					]}>
					<Text style={[styles.modalTitle, { color: textColor }]}>
						Add New Debt
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
						value={newDebt.name}
						onChangeText={text =>
							onNewDebtChange({ ...newDebt, name: text })
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
							selectedValue={newDebt.category || "OTHER"}
							onValueChange={(value: DebtCategory) =>
								onNewDebtChange({ ...newDebt, category: value })
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
						value={newDebt.amount}
						onChangeText={text => {
							onNewDebtChange({ ...newDebt, amount: text });
							updateMinimumPayment(
								text,
								newDebt.interest_rate,
								newDebt.term_in_months
							);
						}}
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
						value={newDebt.interest_rate}
						onChangeText={text => {
							onNewDebtChange({
								...newDebt,
								interest_rate: text,
							});
							updateMinimumPayment(
								newDebt.amount,
								text,
								newDebt.term_in_months
							);
						}}
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
						placeholder='Term (months)'
						placeholderTextColor={iconColor}
						keyboardType='numeric'
						value={newDebt.term_in_months}
						onChangeText={text => {
							onNewDebtChange({
								...newDebt,
								term_in_months: text,
							});
							updateMinimumPayment(
								newDebt.amount,
								newDebt.interest_rate,
								text
							);
						}}
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
						value={newDebt.minimum_payment}
						onChangeText={text =>
							onNewDebtChange({
								...newDebt,
								minimum_payment: text,
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
								styles.addButton,
								{ backgroundColor: tintColor },
							]}
							onPress={handleAdd}>
							<Text
								style={[
									styles.modalButtonText,
									{ color: isDark ? "#000" : "#fff" },
								]}>
								Add
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
	addButton: {},
	modalButtonText: {
		fontWeight: "600",
		fontSize: 16,
	},
});
