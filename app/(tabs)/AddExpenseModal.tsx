import { BodyScrollView } from '@/components/ui/BodyScrollView';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useExpenses } from '@/hooks/useExpense';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Expense, ExpenseInsert } from '@/types/STT';
import { useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AddExpenseModal() {
	const { user } = useUser();
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [dueDate, setDueDate] = useState('');
	const { expenses, createExpense, updateExpense, deleteExpense, loading: expensesLoading } = useExpenses();

	// useEffect(() => {
	// 	if (visible && expense) {
	// 		setName(expense.name || '');
	// 		setAmount(expense.amount ? expense.amount.toString() : '');
	// 		setDueDate(expense.due_date ? expense.due_date.toString() : '');
	// 	} else if (visible && !expense) {
	// 		setName('');
	// 		setAmount('');
	// 		setDueDate('');
	// 	}
	// }, [visible, expense]);

	const handleAddExpense = async () => {
		const expenseData: ExpenseInsert = {
			name: name,
			amount: Number(amount),
			due_date: Number(dueDate),
			user_id: user!.id,
		};

		await createExpense(expenseData);
	};

	return (
		<BodyScrollView contentContainerStyle={{ marginTop: 16 }}>
			<View style={styles.container}>
				<TextInput placeholder="Expense name" variant="filled" placeholderTextColor={Colors.light.icon} value={name} onChangeText={setName} />

				<TextInput
					variant="filled"
					placeholder="Amount"
					placeholderTextColor={Colors.light.icon}
					keyboardType="numeric"
					value={amount}
					onChangeText={setAmount}
				/>

				<TextInput
					variant="filled"
					placeholder="Due date (1-31)"
					placeholderTextColor={Colors.light.icon}
					keyboardType="numeric"
					value={dueDate}
					onChangeText={setDueDate}
				/>

				<View style={styles.buttonContainer}>
					<Button onPress={handleAddExpense}>Add Expense</Button>
				</View>
			</View>
		</BodyScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		marginTop: 20,
	},
});
