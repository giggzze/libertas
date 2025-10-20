import { BodyScrollView } from '@/src/components/ui/BodyScrollView';
import HeaderButton from '@/src/components/ui/HeaderButton';
import { appleBlue } from '@/src/constants/theme';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback} from 'react';
import { StyleSheet, View } from 'react-native';
import { SummaryCard } from '@/src/components/ui/SummaryCard';
import { ExpenseList } from '@/src/components/debt-planner/ExpenseList';
import { useExpenses } from '@/src/hooks/useExpense';
import { DebtList } from '@/src/components/debt-planner/DebtList';
import { useDebts } from '@/src/hooks/useDebt';

export default function HomeScreen() {
	const { expenses,  deleteExpense, loading: expensesLoading, refetch } = useExpenses();
	const { debts, deleteDebt, refetch: refetchDebts } = useDebts();

	const handleEditDebt = async () => {};
	const handleMakePayment = async () => {};
	const handleAddCharge = async () => {};
	const handleShowHistory = async () => {};

	const totalDebt = debts.reduce((sum, debt) => sum + (debt.remaining_balance || debt.amount), 0);
	const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
	const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
	const totalMonthlyObligations = totalMonthlyPayments + totalExpenses;


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
						<View style={{marginLeft: 5}}>
							<HeaderButton onPress={() => router.push('/profile')}
										  iconName="gear" color={appleBlue}  />
						</View>
					),
					headerRight: () => <HeaderButton onPress={() => router.push('/strategy')} iconName="chart.bar" color={appleBlue} />,
				}}
			/>
			<BodyScrollView>
				{/*summary section*/}
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
				{/*expense section*/}
				<View style={styles.section}>
					<ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} loading={expensesLoading} />
				</View>
				{/*debt section*/}
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
		marginBottom: 4,
		paddingHorizontal: 16,
	},
	summarySection: {
		marginBottom: 12,
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
