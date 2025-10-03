import { BodyScrollView } from '@/components/ui/BodyScrollView';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { Colors } from '@/constants/theme';
import { useExpenses } from '@/hooks/useExpense';
import { ExpenseInsert } from '@/types/STT';
import { useUser } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * EditExpenseModal is the modal for editing an existing expense.
 *
 * - Renders a form with name, amount, and due date fields.
 * - Handles updating an expense using the `useExpenses` hook.
 */
export default function EditExpenseModal() {
	const { user } = useUser();
	const { updateExpense, expenses } = useExpenses();
	const { expenseId } = useLocalSearchParams();

	const [name, setName] = useState<string>('');
	const [amount, setAmount] = useState<number>(0);
	const [dueDate, setDueDate] = useState<number>(0);

	useEffect(() => {
		const expense = expenses.find((expense) => expense.id === expenseId);
		console.log(expense, 'expense');
		setName(expense?.name ?? '');
		setAmount(expense?.amount ?? 0);
		setDueDate(expense?.due_date ?? 0);
	}, [expenses, expenseId]);

	const handleUpdateExpense = async () => {
		// Validate inputs
		if (!name?.trim() || !amount || !dueDate) {
			return;
		}

		const expenseData: ExpenseInsert = {
			name: name.trim(),
			amount: Number(amount),
			due_date: Number(dueDate),
			user_id: user!.id,
		};

		await updateExpense(expenseId as string, expenseData);
		router.dismiss();
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
					value={amount?.toString()}
					onChangeText={(text) => setAmount(Number(text))}
				/>

				<TextInput
					variant="filled"
					placeholder="Due date (1-31)"
					placeholderTextColor={Colors.light.icon}
					keyboardType="numeric"
					value={dueDate?.toString()}
					onChangeText={(text) => setDueDate(Number(text))}
				/>

				<View style={styles.buttonContainer}>
					<Button onPress={handleUpdateExpense}>Update Expense</Button>
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
