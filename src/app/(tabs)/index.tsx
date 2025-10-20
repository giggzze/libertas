import { BodyScrollView } from '@/src/components/ui/BodyScrollView';
import HeaderButton from '@/src/components/ui/HeaderButton';
import { appleBlue } from '@/src/constants/theme';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, RefreshControl, Animated } from 'react-native';
import { SummaryCard } from '@/src/components/ui/SummaryCard';
import { ExpenseList } from '@/src/components/debt-planner/ExpenseList';
import { useExpenses } from '@/src/hooks/useExpense';
import { DebtList } from '@/src/components/debt-planner/DebtList';
import { useDebts } from '@/src/hooks/useDebt';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export default function HomeScreen() {
	const { expenses, deleteExpense, loading: expensesLoading, refetch } = useExpenses();
	const { debts, deleteDebt, refetch: refetchDebts } = useDebts();
	const [refreshing, setRefreshing] = useState(false);

	// Theme
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const textColor = useThemeColor({}, 'text');
	const iconColor = useThemeColor({}, 'icon');
	const backgroundColor = useThemeColor({}, 'background');

	const handleEditDebt = async () => {};
	const handleMakePayment = async () => {};
	const handleAddCharge = async () => {};
	const handleShowHistory = async () => {};

	const totalDebt = debts.reduce((sum, debt) => sum + (debt.remaining_balance || debt.amount), 0);
	const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
	const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
	const totalMonthlyObligations = totalMonthlyPayments + totalExpenses;

	// Calculate additional insights
	const totalDebts = debts.length;
	const totalExpenseCount = expenses.length;

	// Pull to refresh
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await Promise.all([refetch(), refetchDebts()]);
		setRefreshing(false);
	}, [refetch, refetchDebts]);

	// Refetch expenses when screen comes back into focus (e.g., after modal closes)
	useFocusEffect(
		useCallback(() => {
			console.log('refetching expenses');
			refetch();
			refetchDebts();
		}, [refetch, refetchDebts]),
	);

	const handleDeleteExpense = async (expenseId: string) => {
		await deleteExpense(expenseId);
	};

	const handleDeleteDebt = async (debtId: string) => {
		await deleteDebt(debtId);
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerLeft: () => (
						<View style={{ marginLeft: 5 }}>
							<HeaderButton onPress={() => router.push('/profile')} iconName="gear" color={appleBlue} />
						</View>
					),
					headerRight: () => <HeaderButton onPress={() => router.push('/strategy')} iconName="chart.bar" color={appleBlue} />,
					title: 'Overview',
				}}
			/>
			<BodyScrollView
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={appleBlue} />}
			>
				{/* Quick Stats Banner */}
				{(totalDebts > 0 || totalExpenseCount > 0) && (
					<View style={[styles.quickStats, { backgroundColor: isDark ? '#1f2937' : '#f8fafc' }]}>
						<View style={styles.statItem}>
							<Text style={[styles.statNumber, { color: textColor }]}>{totalDebts}</Text>
							<Text style={[styles.statLabel, { color: iconColor }]}>Active Debts</Text>
						</View>
						<View style={[styles.statDivider, { backgroundColor: isDark ? '#374151' : '#e2e8f0' }]} />
						<View style={styles.statItem}>
							<Text style={[styles.statNumber, { color: textColor }]}>{totalExpenseCount}</Text>
							<Text style={[styles.statLabel, { color: iconColor }]}>Monthly Expenses</Text>
						</View>
					</View>
				)}

				{/* Summary section */}
				<View style={styles.summarySection}>
					<Text style={[styles.sectionHeader, { color: textColor }]}>Financial Summary</Text>
					<View style={styles.summaryContainer}>
						<SummaryCard title="Total Debt" amount={totalDebt} iconName="creditcard" />
						<SummaryCard
							title="Total Outgoings"
							amount={totalMonthlyObligations}
							subtitle="Monthly"
							isNegative={true}
							iconName="arrow.down.circle"
						/>
					</View>

					<View style={styles.summaryContainer}>
						<SummaryCard title="Expenses" amount={totalExpenses} subtitle="Monthly" iconName="cart" />
						<SummaryCard title="Debt Payments" amount={totalMonthlyPayments} subtitle="Monthly" iconName="banknote" />
					</View>
				</View>

				{/* Expense section */}
				<View style={styles.section}>
					<ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} loading={expensesLoading} />
				</View>

				{/* Debt section */}
				<View style={styles.section}>
					<DebtList
						debts={debts}
						onEditDebt={handleEditDebt}
						onDeleteDebt={handleDeleteDebt}
						onMakePayment={handleMakePayment}
						onShowHistory={handleShowHistory}
						onAddCharge={handleAddCharge}
					/>
				</View>

				{/* Bottom padding for better scroll */}
				<View style={{ height: 40 }} />
			</BodyScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 60,
	},
	quickStats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 20,
		padding: 20,
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	statItem: {
		flex: 1,
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 13,
		opacity: 0.7,
	},
	statDivider: {
		width: 1,
		height: 40,
		marginHorizontal: 16,
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '600',
		paddingHorizontal: 16,
		marginBottom: 12,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
		opacity: 0.6,
	},
	section: {
		marginBottom: 8,
		paddingHorizontal: 16,
	},
	summarySection: {
		marginBottom: 24,
	},
	summaryContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 6,
		gap: 12,
		marginBottom: 8,
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
