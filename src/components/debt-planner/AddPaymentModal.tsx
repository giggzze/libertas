import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { DebtWithPayments } from '@/src/types/STT';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddPaymentModalProps {
	visible: boolean;
	onClose: () => void;
	onAdd: (amount: string, date: string) => void;
	debt: DebtWithPayments | null;
}

export function AddPaymentModal({ visible, onClose, onAdd, debt }: AddPaymentModalProps) {
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState('');

	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const textColor = useThemeColor({}, 'text');
	const iconColor = useThemeColor({}, 'icon');
	const tintColor = useThemeColor({}, 'tint');
	const backgroundColor = useThemeColor({}, 'background');

	useEffect(() => {
		if (visible && debt) {
			// Default amount to minimum payment or remaining balance if less
			const defaultAmount = Math.min(debt.minimum_payment, debt.remaining_balance ?? debt.amount).toString();
			setAmount(defaultAmount);
			setDate(new Date().toISOString().split('T')[0]);
		}
	}, [visible, debt]);

	const handleAdd = () => {
		if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
		onAdd(amount, date);
	};

	if (!debt) return null;

	return (
		<Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<View style={[styles.modalContent, { backgroundColor, borderColor: isDark ? '#4a5568' : '#ddd' }]}>
					<Text style={[styles.title, { color: textColor }]}>Make Payment</Text>
					<Text style={[styles.label, { color: iconColor }]}>Debt: {debt.name}</Text>
					<Text style={[styles.label, { color: iconColor }]}>Remaining: {debt.remaining_balance ?? debt.amount}</Text>

					<TextInput
						style={[styles.input, { backgroundColor, color: textColor, borderColor: isDark ? '#4a5568' : '#ddd' }]}
						placeholder="Amount"
						placeholderTextColor={iconColor}
						keyboardType="numeric"
						value={amount}
						onChangeText={setAmount}
					/>

					<TextInput
						style={[styles.input, { backgroundColor, color: textColor, borderColor: isDark ? '#4a5568' : '#ddd' }]}
						placeholder="Payment Date (YYYY-MM-DD)"
						placeholderTextColor={iconColor}
						value={date}
						onChangeText={setDate}
					/>

					<View style={styles.buttonContainer}>
						<TouchableOpacity style={[styles.button, styles.cancelButton, { backgroundColor: isDark ? '#4a5568' : '#e2e8f0' }]} onPress={onClose}>
							<Text style={[styles.buttonText, { color: isDark ? '#fff' : '#333' }]}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={handleAdd}>
							<Text style={[styles.buttonText, { color: isDark ? '#000' : '#fff' }]}>Add Payment</Text>
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
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '90%',
		padding: 20,
		borderRadius: 12,
		borderWidth: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		fontSize: 16,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
	},
	button: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	cancelButton: {},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
});
