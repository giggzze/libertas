import { AddDebtModal } from "@/components/debt-planner/AddDebtModal";
import { AddExpenseModal } from "@/components/debt-planner/AddExpenseModal";
import { DebtList } from "@/components/debt-planner/DebtList";
import { EditDebtModal } from "@/components/debt-planner/EditDebtModal";
import { ExpenseList } from "@/components/debt-planner/ExpenseList";
import { Loading } from "@/components/ui/Loading";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useDebts, useExpenses, useMonthlyIncome } from "@/hooks/useDatabase";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { DebtInsert, ExpenseInsert } from "@/types/STT";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
	// Use database hooks instead of mock data
	const {
		currentIncome,
		createIncome,
		loading: incomeLoading,
	} = useMonthlyIncome();
	const {
		debts,
		createDebt,
		updateDebt,
		deleteDebt,
		loading: debtsLoading,
	} = useDebts();
	const {
		expenses,
		createExpense,
		updateExpense,
		deleteExpense,
		loading: expensesLoading,
	} = useExpenses();
	const { user } = useAuthStore();

	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	// Local UI state
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [selectedDebt, setSelectedDebt] = useState<any | null>(null);
	const [newDebt, setNewDebt] = useState({
		name: "",
		amount: "",
		interest_rate: "",
		minimum_payment: "",
		term_in_months: "60", // Default to 5 years
	});

	// Expense modal state
	const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
		useState(false);
	const [isEditExpenseModalVisible, setIsEditExpenseModalVisible] =
		useState(false);
	const [selectedExpense, setSelectedExpense] = useState<any | null>(null);

	// Show loading while data is being fetched
	if (incomeLoading || debtsLoading || expensesLoading) {
		return <Loading message='Loading your financial information...' />;
	}

	// Calculate totals from real data
	const totalDebt = debts.reduce(
		(sum, debt) => sum + (debt.remaining_balance || debt.amount),
		0
	);
	const totalMonthlyPayments = debts.reduce(
		(sum, debt) => sum + debt.minimum_payment,
		0
	);
	const totalExpenses = expenses.reduce(
		(sum, expense) => sum + expense.amount,
		0
	);
	const totalMonthlyObligations = totalMonthlyPayments + totalExpenses;

	const handleAddDebt = async (debt: typeof newDebt) => {
		const debtData: DebtInsert = {
			name: debt.name,
			amount: Number(debt.amount),
			interest_rate: Number(debt.interest_rate),
			minimum_payment: Number(debt.minimum_payment),
			start_date: new Date().toISOString().split("T")[0],
			term_in_months: Number(debt.term_in_months),
			is_paid: false,
			user_id: user.id,
		};

		const success = await createDebt(debtData);
		if (success) {
			setNewDebt({
				name: "",
				amount: "",
				interest_rate: "",
				minimum_payment: "",
				term_in_months: "60",
			});
			setIsAddModalVisible(false);
		}
	};

	const handleEditDebt = (debt: any) => {
		setSelectedDebt(debt);
		setIsEditModalVisible(true);
	};

	const handleUpdateDebt = async (debt: any) => {
		if (!selectedDebt) return;

		const success = await updateDebt(selectedDebt.id, {
			name: debt.name,
			amount: Number(debt.amount),
			interest_rate: Number(debt.interest_rate),
			minimum_payment: Number(debt.minimum_payment),
			term_in_months: Number(debt.term_in_months),
		});

		if (success) {
			setIsEditModalVisible(false);
			setSelectedDebt(null);
		}
	};

	const handleDeleteDebt = async (debtId: string) => {
		await deleteDebt(debtId);
	};

	const handleAddExpense = async (expense: {
		name: string;
		amount: string;
		dueDate: string;
	}) => {
		const expenseData: ExpenseInsert = {
			name: expense.name,
			amount: Number(expense.amount),
			due_date: Number(expense.dueDate),
			user_id: user?.id,
		};

		const success = await createExpense(expenseData);
		if (success) {
			setIsAddExpenseModalVisible(false);
		}
	};

	const handleEditExpense = (expense: any) => {
		setSelectedExpense(expense);
		setIsEditExpenseModalVisible(true);
	};

	const handleUpdateExpense = async (expense: {
		name: string;
		amount: string;
		dueDate: string;
	}) => {
		if (!selectedExpense) return;

		const success = await updateExpense(selectedExpense.id, {
			name: expense.name,
			amount: Number(expense.amount),
			due_date: Number(expense.dueDate),
		});

		if (success) {
			setIsEditExpenseModalVisible(false);
			setSelectedExpense(null);
		}
	};

	const handleDeleteExpense = async (expenseId: string) => {
		await deleteExpense(expenseId);
	};

	const handleIncomeChange = async (income: string) => {
		// Only save if income is a valid number and greater than 0
		const incomeNumber = Number(income);
		if (income && !isNaN(incomeNumber) && incomeNumber > 0) {
			try {
				await createIncome({
					amount: incomeNumber,
					start_date: new Date().toISOString().split("T")[0],
					user_id: user.id,
				});
				console.log("Income saved:", incomeNumber);
			} catch (error) {
				console.error("Failed to save income:", error);
			}
		}
	};

	const handleSaveIncome = async (income: string) => {
		if (!income) return;

		await createIncome({
			amount: Number(income),
			start_date: new Date().toISOString().split("T")[0],
			user_id: user?.id,
		});
	};

	return (
		<>
			<StatusBar style={isDark ? "light" : "dark"} />
			<ScrollView
				style={[styles.container, { backgroundColor }]}
				showsVerticalScrollIndicator={false}>
				<View style={[styles.header, { backgroundColor }]}>
					<Text style={[styles.title, { color: textColor }]}>
						Debt Planner
					</Text>
					<Text style={[styles.subtitle, { color: iconColor }]}>
						Take control of your financial future
					</Text>
				</View>

				<View style={styles.summarySection}>
					<Text style={[styles.sectionTitle, { color: textColor }]}>
						Financial Overview
					</Text>
					<View style={styles.summaryContainer}>
						<SummaryCard
							title='Total Debt'
							amount={totalDebt}
						/>
						<SummaryCard
							title='Total Outgoings'
							amount={totalMonthlyObligations}
							subtitle='Monthly'
							isNegative={true}
						/>
					</View>

					<View style={styles.summaryContainer}>
						<SummaryCard
							title='Expenses'
							amount={totalExpenses}
							subtitle='Monthly'
						/>

						<SummaryCard
							title='Debt Payments'
							amount={totalMonthlyPayments}
							subtitle='Monthly'
						/>
					</View>
				</View>

				<View style={styles.section}>
					<ExpenseList
						expenses={expenses}
						onAddExpense={() => setIsAddExpenseModalVisible(true)}
						onEditExpense={handleEditExpense}
						onDeleteExpense={handleDeleteExpense}
					/>
				</View>

				<View style={styles.section}>
					<DebtList
						debts={debts}
						onAddDebt={() => setIsAddModalVisible(true)}
						onEditDebt={handleEditDebt}
						onDeleteDebt={handleDeleteDebt}
					/>
				</View>

				<AddDebtModal
					visible={isAddModalVisible}
					onClose={() => setIsAddModalVisible(false)}
					onAdd={handleAddDebt}
					newDebt={newDebt}
					onNewDebtChange={setNewDebt}
				/>

				<EditDebtModal
					visible={isEditModalVisible}
					onClose={() => setIsEditModalVisible(false)}
					onSave={handleUpdateDebt}
					debt={selectedDebt}
				/>

				<AddExpenseModal
					visible={isAddExpenseModalVisible}
					onClose={() => setIsAddExpenseModalVisible(false)}
					onAdd={handleAddExpense}
				/>

				<AddExpenseModal
					visible={isEditExpenseModalVisible}
					onClose={() => setIsEditExpenseModalVisible(false)}
					onAdd={handleUpdateExpense}
					expense={selectedExpense}
				/>
			</ScrollView>
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
		borderBottomColor: "#2d3748",
		marginBottom: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
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
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 12,
		paddingHorizontal: 16,
	},
	summaryContainer: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 16,
		marginBottom: 16,
	},
	summaryCard: {
		flex: 1,
		padding: 20,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	summaryTitle: {
		fontSize: 14,
		marginBottom: 12,
		textAlign: "center",
		fontWeight: "500",
	},
	summaryAmount: {
		fontSize: 24,
		fontWeight: "bold",
	},
	summarySubtitle: {
		fontSize: 12,
		marginTop: 4,
		opacity: 0.8,
	},
});
