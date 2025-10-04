import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Expense } from '@/types/STT';
import { formatCurrency } from '@/utils/formatCurrency';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ExpenseItem from '@/components/debt-planner/ExpenseItem';
import Button from '../ui/Button';

interface ExpenseListProps {
	expenses: Expense[];
	onEditExpense: (expense: Expense) => void;
	onDeleteExpense: (expenseId: string) => void;
	loading?: boolean;
}

export function ExpenseList({ expenses, onDeleteExpense, loading }: ExpenseListProps) {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const textColor = useThemeColor({}, 'text');
	const iconColor = useThemeColor({}, 'icon');
	const tintColor = useThemeColor({}, 'tint');

	const onAddExpense = () => {
		router.push('/(tabs)/AddExpenseModal');
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: textColor }]}>Monthly Expenses</Text>
				{/*<TouchableOpacity style={[styles.addButton, { backgroundColor: tintColor }]} onPress={onAddExpense}>
					<IconSymbol name="plus" size={20} color={isDark ? 'black' : 'white'} />
				</TouchableOpacity>*/}
				<Button onPress={onAddExpense}> Add Expense</Button>
			</View>

			{expenses.length === 0 ? (
				<Text style={[styles.emptyText, { color: iconColor }]}>No expenses added yet</Text>
			) : (
				expenses.map((expense) => (
					<ExpenseItem
						key={expense.id}
						expense={expense}
						onDeleteExpense={onDeleteExpense}
						isDark={isDark}
						textColor={textColor}
						iconColor={iconColor}
					/>
				))
			)}
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
