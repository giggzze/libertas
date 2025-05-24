import { AddDebtModal } from "@/components/debt-planner/AddDebtModal";
import { DebtList } from "@/components/debt-planner/DebtList";
import { EditDebtModal } from "@/components/debt-planner/EditDebtModal";
import { IncomeInput } from "@/components/debt-planner/IncomeInput";
import { Loading } from "@/components/ui/Loading";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDebts, useMonthlyIncome } from "@/hooks/useDatabase";
import { DebtInsert } from "@/types/STT";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

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
		interestRate: "",
		minimumPayment: "",
	});

	// Show loading while data is being fetched
	if (incomeLoading || debtsLoading) {
		return <Loading message='Loading your debt information...' />;
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

	const handleAddDebt = async (debt: typeof newDebt) => {
		const debtData: DebtInsert = {
			name: debt.name,
			amount: Number(debt.amount),
			interest_rate: Number(debt.interestRate),
			minimum_payment: Number(debt.minimumPayment),
			start_date: new Date().toISOString().split("T")[0],
			is_paid: false,
		};

		const success = await createDebt(debtData);
		if (success) {
			setNewDebt({
				name: "",
				amount: "",
				interestRate: "",
				minimumPayment: "",
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
			interest_rate: Number(debt.interestRate),
			minimum_payment: Number(debt.minimumPayment),
		});

		if (success) {
			setIsEditModalVisible(false);
			setSelectedDebt(null);
		}
	};

	const handleDeleteDebt = async (debtId: string) => {
		await deleteDebt(debtId);
	};

	const handleIncomeChange = async (income: string) => {
		// Only save if income is a valid number and greater than 0
		const incomeNumber = Number(income);
		if (income && !isNaN(incomeNumber) && incomeNumber > 0) {
			try {
				await createIncome({
					amount: incomeNumber,
					start_date: new Date().toISOString().split("T")[0],
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
		});
	};

	return (
		<>
		<StatusBar style={isDark ? "light" : "dark"} />
		<ScrollView style={[styles.container, { backgroundColor: isDark ? "#1a202c" : "#f5f5f5" }]}>
			<View style={[styles.header, { backgroundColor: backgroundColor }]}>
				<Text style={[styles.title, { color: textColor }]}>Debt Planner</Text>
				<Text style={[styles.subtitle, { color: iconColor }]}>
					Take control of your financial future
				</Text>
			</View>

			<IncomeInput
				income={currentIncome?.amount.toString() || ""}
				onIncomeChange={handleIncomeChange}
			/>

			<View style={styles.summaryContainer}>
				<View style={[styles.summaryCard, { backgroundColor: backgroundColor }]}>
					<Text style={[styles.summaryTitle, { color: iconColor }]}>Total Debt</Text>
					<Text style={[styles.summaryAmount, { color: textColor }]}>
						${totalDebt.toLocaleString()}
					</Text>
				</View>
				<View style={[styles.summaryCard, { backgroundColor: backgroundColor }]}>
					<Text style={[styles.summaryTitle, { color: iconColor }]}>Monthly Payments</Text>
					<Text style={[styles.summaryAmount, { color: textColor }]}>
						${totalMonthlyPayments.toLocaleString()}
					</Text>
				</View>
			</View>

			<DebtList
				debts={debts}
				onAddDebt={() => setIsAddModalVisible(true)}
				onEditDebt={handleEditDebt}
				onDeleteDebt={handleDeleteDebt}
			/>

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
		</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		padding: 24,
		paddingTop: 40,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
	},
	summaryContainer: {
		flexDirection: "row",
		padding: 16,
		gap: 16,
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
		marginBottom: 8,
		textAlign: "center",
	},
	summaryAmount: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
