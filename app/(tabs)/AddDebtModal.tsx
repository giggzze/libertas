import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { borderColor, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDebts } from '@/hooks/useDebt';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/store/auth';
import { DebtCategory } from '@/types/STT';
import { calculateMinimumPayment } from '@/utils/debtCalculations';
import { useUser } from '@clerk/clerk-expo';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categoryLabels: Record<DebtCategory, string> = {
	CREDIT_CARD: 'Credit Card',
	OVERDRAFT: 'Overdraft',
	CAR_LOAN: 'Car Loan',
	PERSONAL_LOAN: 'Personal Loan',
	SUBSCRIPTION: 'Subscription',
	OTHER: 'Other',
};

export default function AddDebtModal() {
	const { user } = useUser();
	const { createDebt, refetch } = useDebts();
	const [newDebt, setNewDebt] = useState({
		name: '',
		amount: '',
		interest_rate: '',
		minimum_payment: '',
		term_in_months: '12',
		category: 'CAR_LOAN' as DebtCategory,
	});

	const handleAdd = async () => {
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
			console.log('Invalid debt values', {
				name: newDebt.name,
				amount,
				interestRate,
				minimumPayment,
				termInMonths,
				category: newDebt.category,
			});
			return;
		}

		console.log('Adding debt', {
			name: newDebt.name,
			amount: newDebt.amount,
			interest_rate: newDebt.interest_rate,
			minimum_payment: newDebt.minimum_payment,
			term_in_months: newDebt.term_in_months,
			category: newDebt.category,
		});

		try {
			await createDebt({
				name: newDebt.name,
				amount: parseFloat(newDebt.amount),
				interest_rate: parseFloat(newDebt.interest_rate),
				minimum_payment: parseFloat(newDebt.minimum_payment),
				term_in_months: parseInt(newDebt.term_in_months, 10),
				category: newDebt.category,
				start_date: new Date(Date.now()).toISOString().split('T')[0],
				user_id: user!.id,
			});

			// Ensure refetch happens
			await refetch();

			router.dismiss();
		} catch (error) {
			console.error('Error creating debt:', error);
		}
	};

	const updateMinimumPayment = (amount: string, interestRate: string, termInMonths: string) => {
		const numAmount = parseFloat(amount);
		const numInterestRate = parseFloat(interestRate);
		const numTerm = parseInt(termInMonths, 10);

		if (!isNaN(numAmount) && !isNaN(numInterestRate) && !isNaN(numTerm) && numAmount > 0 && numInterestRate >= 0 && numTerm > 0) {
			const minPayment = calculateMinimumPayment(numAmount, numInterestRate, numTerm);
			setNewDebt({
				...newDebt,
				amount,
				interest_rate: interestRate,
				term_in_months: termInMonths,
				minimum_payment: minPayment.toFixed(2),
			});
		}
	};

	return (
		<View style={styles.modalContent}>
			<TextInput
				placeholder="Debt name"
				placeholderTextColor={borderColor}
				value={newDebt.name}
				onChangeText={(text) => setNewDebt({ ...newDebt, name: text })}
			/>

			<TextInput
				placeholder="Amount"
				placeholderTextColor={borderColor}
				keyboardType="numeric"
				value={newDebt.amount}
				onChangeText={(text) => {
					setNewDebt({ ...newDebt, amount: text });
					updateMinimumPayment(text, newDebt.interest_rate, newDebt.term_in_months);
				}}
			/>

			<TextInput
				placeholder="Interest rate (%)"
				placeholderTextColor={borderColor}
				keyboardType="numeric"
				value={newDebt.interest_rate}
				onChangeText={(text) => {
					setNewDebt({
						...newDebt,
						interest_rate: text,
					});
					updateMinimumPayment(newDebt.amount, text, newDebt.term_in_months);
				}}
			/>

			<TextInput
				placeholder="Term (months)"
				placeholderTextColor={borderColor}
				keyboardType="numeric"
				value={newDebt.term_in_months}
				onChangeText={(text) => {
					setNewDebt({
						...newDebt,
						term_in_months: text,
					});
					updateMinimumPayment(newDebt.amount, newDebt.interest_rate, text);
				}}
			/>

			<TextInput
				placeholder="Minimum payment"
				disabled
				placeholderTextColor={Colors.light.text}
				keyboardType="numeric"
				value={newDebt.minimum_payment}
				onChangeText={(text) =>
					setNewDebt({
						...newDebt,
						minimum_payment: text,
					})
				}
			/>

			<View style={styles.pickerContainer}>
				<Picker
					selectedValue={newDebt.category || 'OTHER'}
					onValueChange={(value: DebtCategory) => setNewDebt({ ...newDebt, category: value })}
					style={styles.picker}
					dropdownIconColor={Colors.light.text}
				>
					{Object.entries(categoryLabels).map(([value, label]) => (
						<Picker.Item key={value} label={label} value={value} color={Colors.light.text} />
					))}
				</Picker>
			</View>

			<Button onPress={handleAdd}>Add Debt </Button>
		</View>
	);
}

const styles = StyleSheet.create({
	modalContent: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 24,
		paddingTop: 20,
		paddingBottom: 40,
	},
	input: {
		backgroundColor: '#f5f5f5',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 16,
		fontSize: 16,
		marginBottom: 16,
		borderWidth: 0,
	},
	pickerContainer: {
		backgroundColor: '#f5f5f5',
		borderRadius: 12,
		marginBottom: 16,
		overflow: 'hidden',
	},
	picker: {
		height: Platform.OS === 'ios' ? 140 : 50,
	},
	addButton: {
		backgroundColor: '#000',
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
		marginTop: 8,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
