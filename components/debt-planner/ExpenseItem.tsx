import { formatCurrency } from '@/utils/formatCurrency';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '@/types/STT';
import { router } from 'expo-router';

interface ExpenseItemProps {
	expense: Expense;
	onDeleteExpense: (expenseId: string) => void;
	isDark: boolean;
	textColor: string;
	iconColor: string;
}

export default function ExpenseItem({ expense, onDeleteExpense, isDark, textColor, iconColor }: ExpenseItemProps) {
	const handleDelete = () => {
		Alert.alert('Delete Expense', `Are you sure you want to delete ${expense.name}?`, [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => onDeleteExpense(expense.id),
			},
		]);
	};

	const handleEditExpense = (expense: any) => {
		// Navigate to edit screen with expense data
		router.push({
			pathname: '/(tabs)/EditExpenseModal',
			params: { expenseId: expense.id },
		});
	};

	return (
		<View
			style={[
				styles.expenseItem,
				{
					backgroundColor: isDark ? '#2d3748' : 'white',
					borderColor: isDark ? '#4a5568' : '#ddd',
				},
			]}
		>
			<View style={styles.expenseInfo}>
				<Text style={[styles.expenseName, { color: textColor }]}>{expense.name}</Text>
				<Text style={[styles.expenseAmount, { color: textColor }]}>{formatCurrency(expense.amount)}</Text>
				<Text style={[styles.dueDate, { color: iconColor }]}>Due: {expense.due_date}th</Text>
			</View>
			<View style={styles.actions}>
				<TouchableOpacity style={styles.actionButton} onPress={() => handleEditExpense(expense)}>
					<IconSymbol name="pencil" size={20} color={iconColor} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
					<IconSymbol name="trash" size={20} color="#ff3b30" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	addButton: {
		padding: 8,
		borderRadius: 8,
	},
	emptyText: {
		textAlign: 'center',
		fontSize: 16,
		marginTop: 16,
	},
	expenseItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		marginBottom: 8,
	},
	expenseInfo: {
		flex: 1,
	},
	expenseName: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	expenseAmount: {
		fontSize: 16,
		marginBottom: 4,
	},
	dueDate: {
		fontSize: 14,
	},
	actions: {
		flexDirection: 'row',
		gap: 8,
	},
	actionButton: {
		padding: 8,
	},
	deleteButton: {
		padding: 8,
		backgroundColor: '#e53e3e',
	},
});
