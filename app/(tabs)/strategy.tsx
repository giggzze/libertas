import { PayoffTimeline } from "@/components/debt-planner/PayoffTimeline";
import { RecommendationItem } from "@/components/debt-planner/RecommendationItem";
import { StrategySelector } from "@/components/debt-planner/StrategySelector";
import { Loading } from "@/components/ui/Loading";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useDebts, useExpenses, useMonthlyIncome } from "@/hooks/useDatabase";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DebtWithPayments, Expense, PayoffStrategy } from "@/types/STT";
import {
	calculatePayoffOrder,
	calculatePayoffTime,
	calculateRecommendedPayment,
	calculateTotalInterest,
} from "@/utils/debtCalculations";
import { formatCurrency } from "@/utils/formatCurrency";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function StrategyScreen() {
	const [selectedStrategy, setSelectedStrategy] =
		React.useState<PayoffStrategy>("snowball");

	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	// Use database hooks instead of mock data
	const {
		currentIncome,
		loading: incomeLoading,
		refetch: refetchIncome,
	} = useMonthlyIncome();

	const { debts, loading: debtsLoading, refetch: refetchDebts } = useDebts();

	const {
		expenses,
		loading: expensesLoading,
		refetch: refetchExpenses,
	} = useExpenses();

	// Refresh data when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			refetchIncome();
			refetchDebts();
			refetchExpenses();
		}, [refetchIncome, refetchDebts, refetchExpenses])
	);

	// Memoize calculations to prevent unnecessary recalculations
	const calculationDebts = useMemo(
		() =>
			debts.map((debt: DebtWithPayments) => ({
				...debt,
				amount: debt.remaining_balance || debt.amount,
				interest_rate: debt.interest_rate,
				minimum_payment: debt.minimum_payment,
			})),
		[debts]
	);

	const monthlyIncome = useMemo(
		() => currentIncome?.amount || 0,
		[currentIncome]
	);

	const totalMonthlyPayments = useMemo(
		() =>
			calculationDebts.reduce(
				(sum, debt) => sum + debt.minimum_payment,
				0
			),
		[calculationDebts]
	);

	const totalExpenses = useMemo(
		() =>
			expenses.reduce(
				(sum: number, expense: Expense) => sum + expense.amount,
				0
			),
		[expenses]
	);

	const totalMonthlyObligations = useMemo(
		() => totalMonthlyPayments + totalExpenses,
		[totalMonthlyPayments, totalExpenses]
	);

	const availablePayment = useMemo(
		() => monthlyIncome - totalMonthlyObligations,
		[monthlyIncome, totalMonthlyObligations]
	);

	const recommendedPayments = useMemo(
		() =>
			calculateRecommendedPayment(
				calculationDebts,
				selectedStrategy,
				monthlyIncome
			),
		[calculationDebts, selectedStrategy, monthlyIncome]
	);

	const payoffOrder = useMemo(
		() => calculatePayoffOrder(calculationDebts, selectedStrategy),
		[calculationDebts, selectedStrategy]
	);

	// Calculate total months for timeline
	const totalMonths = useMemo(
		() =>
			Math.max(
				...payoffOrder.map(debt =>
					calculatePayoffTime(debt, recommendedPayments[debt.id])
				)
			),
		[payoffOrder, recommendedPayments]
	);

	// Show loading while data is being fetched
	if (incomeLoading || debtsLoading || expensesLoading) {
		return <Loading message='Loading strategy data...' />;
	}

	// Show message if no debts
	if (debts.length === 0) {
		return (
			<>
				<StatusBar style={isDark ? "light" : "dark"} />
				<View style={[styles.emptyContainer, { backgroundColor }]}>
					<Text style={[styles.emptyTitle, { color: textColor }]}>
						No Debts Found
					</Text>
					<Text style={[styles.emptyMessage, { color: iconColor }]}>
						Add some debts to see your payoff strategy
						recommendations.
					</Text>
				</View>
			</>
		);
	}

	// Show message if no income set
	if (!currentIncome) {
		return (
			<>
				<StatusBar style={isDark ? "light" : "dark"} />
				<View style={[styles.emptyContainer, { backgroundColor }]}>
					<Text style={[styles.emptyTitle, { color: textColor }]}>
						Set Your Monthly Income
					</Text>
					<Text style={[styles.emptyMessage, { color: iconColor }]}>
						Go to the Debts tab and set your monthly income to see
						strategy recommendations.
					</Text>
				</View>
			</>
		);
	}

	return (
		<>
			<StatusBar style={isDark ? "light" : "dark"} />
			<ScrollView
				contentContainerStyle={[
					styles.scrollViewContent,
					{ backgroundColor },
				]}
				showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={[styles.headerTitle, { color: textColor }]}>
						Strategy
					</Text>
					<Text style={[styles.headerSubtitle, { color: iconColor }]}>
						Optimize your debt payoff plan
					</Text>
				</View>

				{/* Strategy Overview */}
				<View
					style={[
						styles.summaryCard,
						{
							backgroundColor,
							borderColor: isDark ? "#4a5568" : "#ddd",
						},
					]}>
					<Text style={[styles.summaryTitle, { color: textColor }]}>
						Strategy Overview
					</Text>
					<View style={styles.summaryRow}>
						<Text
							style={[styles.summaryLabel, { color: iconColor }]}>
							Monthly Income:
						</Text>
						<Text
							style={[styles.summaryValue, { color: textColor }]}>
							{formatCurrency(monthlyIncome)}
						</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text
							style={[styles.summaryLabel, { color: iconColor }]}>
							Debt Payments:
						</Text>
						<Text
							style={[styles.summaryValue, { color: textColor }]}>
							{formatCurrency(totalMonthlyPayments)}
						</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text
							style={[styles.summaryLabel, { color: iconColor }]}>
							Monthly Expenses:
						</Text>
						<Text
							style={[styles.summaryValue, { color: textColor }]}>
							{formatCurrency(totalExpenses)}
						</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text
							style={[styles.summaryLabel, { color: iconColor }]}>
							Available for Extra Payments:
						</Text>
						<Text
							style={[
								styles.summaryValue,
								availablePayment > 0
									? { color: isDark ? "#68d391" : "#28a745" }
									: { color: isDark ? "#fc8181" : "#dc3545" },
							]}>
							{formatCurrency(availablePayment)}
						</Text>
					</View>
				</View>

				{/* Strategy Selector */}
				<View style={styles.section}>
					<StrategySelector
						selectedStrategy={selectedStrategy}
						onStrategyChange={setSelectedStrategy}
					/>
				</View>

				{/* Payoff Timeline */}
				<View style={styles.section}>
					<PayoffTimeline
						debts={payoffOrder}
						recommendedPayments={recommendedPayments}
						totalMonths={totalMonths}
					/>
				</View>

				{/* Recommended Payment Plan */}
				<View style={styles.section}>
					<View
						style={[
							styles.recommendationCard,
							{
								backgroundColor,
								borderColor: isDark ? "#4a5568" : "#ddd",
								marginBottom: 80,
							},
						]}>
						<Text
							style={[
								styles.recommendationTitle,
								{ color: textColor },
							]}>
							Recommended Payment Plan
						</Text>
						{payoffOrder.map((debt, index) => {
							const recommendedPayment =
								recommendedPayments[debt.id];
							const payoffTime = calculatePayoffTime(
								debt,
								recommendedPayment
							);
							const totalInterest = calculateTotalInterest(
								debt,
								recommendedPayment
							);
							return (
								<RecommendationItem
									key={debt.id}
									debt={debt}
									index={index}
									recommendedPayment={recommendedPayment}
									payoffTime={payoffTime}
									totalInterest={totalInterest}
								/>
							);
						})}
					</View>
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	scrollViewContent: {
		flexGrow: 1,
		marginBottom: 60,
	},
	header: {
		padding: 24,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#2d3748",
		marginBottom: 16,
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 8,
	},
	headerSubtitle: {
		fontSize: 16,
		opacity: 0.8,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	emptyTitle: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 12,
		textAlign: "center",
	},
	emptyMessage: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 24,
		opacity: 0.8,
		paddingHorizontal: 20,
	},
	section: {
		marginBottom: 24,
		paddingHorizontal: 16,
	},
	summaryCard: {
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
		marginHorizontal: 16,
	},
	summaryTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	summaryLabel: {
		fontSize: 15,
	},
	summaryValue: {
		fontSize: 15,
		fontWeight: "600",
	},
	positive: {
		// Color is set dynamically
	},
	negative: {
		// Color is set dynamically
	},
	recommendationCard: {
		borderRadius: 12,
		padding: 20,
		borderWidth: 1,
		marginBottom: 24,
	},
	recommendationTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
	},
});
