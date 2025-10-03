import { BodyScrollView } from '@/components/ui/BodyScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import HeaderButton from '@/components/ui/HeaderButton';
import { appleBlue } from '@/constants/theme';
import { useUser } from '@clerk/clerk-expo';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, Text, Button } from 'react-native';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { ExpenseList } from '@/components/debt-planner/ExpenseList';
import { useExpenses } from '@/hooks/useExpense';

export default function HomeScreen() {
	const { expenses, createExpense, updateExpense, deleteExpense, loading: expensesLoading } = useExpenses();
	const { user } = useUser();
	const totalDebt = 10;
	const totalMonthlyObligations = 20;
	const totalExpenses = 30;
	const totalMonthlyPayments = 40;

	const setIsAddExpenseModalVisible = () => {};
	const handleEditExpense = () => {};
	const handleDeleteExpense = () => {};

	return (
		<>
			<Stack.Screen
				options={{
					headerLeft: () => <HeaderButton onPress={() => router.push('/profile')} iconName="gear" color={appleBlue} />,
					headerRight: () => <HeaderButton onPress={() => router.push('/strategy')} iconName="chart.bar" color={appleBlue} />,
				}}
			/>
			<BodyScrollView>
				<View style={styles.summarySection}>
					<View style={styles.summaryContainer}>
						<SummaryCard title="Total Debt" amount={totalDebt} />
						<SummaryCard title="Total Outgoings" amount={totalMonthlyObligations} subtitle="Monthly" isNegative={true} />
					</View>

					<View style={styles.summaryContainer}>
						<SummaryCard title="Expenses" amount={totalExpenses} subtitle="Monthly" />

						<SummaryCard title="Debt Payments" amount={totalMonthlyPayments} subtitle="Monthly" />
					</View>
				</View>

				<View style={styles.section}>
					<ExpenseList expenses={expenses} onEditExpense={handleEditExpense} onDeleteExpense={handleDeleteExpense} />
				</View>
			</BodyScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 60,
	},
	header: {
		padding: 24,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#2d3748',
		marginBottom: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.8,
	},
	section: {
		marginBottom: 24,
		paddingHorizontal: 16,
	},
	summarySection: {
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 12,
		paddingHorizontal: 16,
	},
	summaryContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 16,
		marginBottom: 4,
	},
	summaryCard: {
		flex: 1,
		padding: 20,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	summaryTitle: {
		fontSize: 14,
		marginBottom: 12,
		textAlign: 'center',
		fontWeight: '500',
	},
	summaryAmount: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	summarySubtitle: {
		fontSize: 12,
		marginTop: 4,
		opacity: 0.8,
	},
});
