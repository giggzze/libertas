import { PayoffTimeline } from "@/components/debt-planner/PayoffTimeline";
import { RecommendationItem } from "@/components/debt-planner/RecommendationItem";
import {
	PayoffStrategy,
	StrategySelector,
} from "@/components/debt-planner/StrategySelector";
import { Loading } from "@/components/ui/Loading";
import { useDebts, useMonthlyIncome } from "@/hooks/useDatabase";
import { DebtWithPayments } from "@/types/STT";
import {
	calculatePayoffOrder,
	calculatePayoffTime,
	calculateRecommendedPayment,
	calculateTotalInterest,
} from "@/utils/debtCalculations";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function StrategyScreen() {
	const [selectedStrategy, setSelectedStrategy] =
		React.useState<PayoffStrategy>("snowball");

	// Use database hooks instead of mock data
	const { currentIncome, loading: incomeLoading } = useMonthlyIncome();
	const { debts, loading: debtsLoading } = useDebts();

	// Show loading while data is being fetched
	if (incomeLoading || debtsLoading) {
		return <Loading message='Loading strategy data...' />;
	}

	// Convert database debts to format expected by calculations
	const calculationDebts = debts.map((debt: DebtWithPayments) => ({
		id: debt.id,
		name: debt.name,
		amount: debt.remaining_balance || debt.amount,
		interestRate: debt.interest_rate,
		minimumPayment: debt.minimum_payment,
	}));

	const monthlyIncome = currentIncome?.amount || 0;
	const totalMonthlyPayments = calculationDebts.reduce(
		(sum, debt) => sum + debt.minimumPayment,
		0
	);

	const availablePayment = monthlyIncome - totalMonthlyPayments;

	const recommendedPayments = calculateRecommendedPayment(
		calculationDebts,
		selectedStrategy,
		monthlyIncome
	);

	const payoffOrder = calculatePayoffOrder(
		calculationDebts,
		selectedStrategy
	);

	// Calculate total months for timeline
	const totalMonths = Math.max(
		...payoffOrder.map(debt =>
			calculatePayoffTime(debt, recommendedPayments[debt.id])
		)
	);

	// Show message if no debts
	if (debts.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyTitle}>No Debts Found</Text>
				<Text style={styles.emptyMessage}>
					Add some debts to see your payoff strategy recommendations.
				</Text>
			</View>
		);
	}

	// Show message if no income set
	if (!currentIncome) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyTitle}>Set Your Monthly Income</Text>
				<Text style={styles.emptyMessage}>
					Go to the Debts tab and set your monthly income to see
					strategy recommendations.
				</Text>
			</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={styles.scrollViewContent}
			showsVerticalScrollIndicator={false}>
			<View style={styles.summaryCard}>
				<Text style={styles.summaryTitle}>Strategy Overview</Text>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Monthly Income:</Text>
					<Text style={styles.summaryValue}>
						${monthlyIncome.toLocaleString()}
					</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>
						Total Minimum Payments:
					</Text>
					<Text style={styles.summaryValue}>
						${totalMonthlyPayments.toLocaleString()}
					</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>
						Available for Extra Payments:
					</Text>
					<Text
						style={[
							styles.summaryValue,
							availablePayment > 0
								? styles.positive
								: styles.negative,
						]}>
						${availablePayment.toLocaleString()}
					</Text>
				</View>
			</View>

			<View style={styles.sectionSpacing}>
				<StrategySelector
					selectedStrategy={selectedStrategy}
					onStrategyChange={setSelectedStrategy}
				/>
			</View>

			<View style={styles.sectionSpacing}>
				<PayoffTimeline
					debts={payoffOrder}
					recommendedPayments={recommendedPayments}
					totalMonths={totalMonths}
				/>
			</View>

			<View style={styles.recommendationCard}>
				<Text style={styles.recommendationTitle}>
					Recommended Payment Plan
				</Text>
				{payoffOrder.map((debt, index) => {
					const recommendedPayment = recommendedPayments[debt.id];
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
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollViewContent: {
		padding: 16,
		paddingBottom: 32,
		flexGrow: 1,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
		textAlign: "center",
	},
	emptyMessage: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		lineHeight: 24,
	},
	summaryCard: {
		backgroundColor: "white",
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	summaryTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	summaryLabel: {
		fontSize: 14,
		color: "#666",
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
	},
	positive: {
		color: "#28a745",
	},
	negative: {
		color: "#dc3545",
	},
	sectionSpacing: {
		marginBottom: 4,
	},
	recommendationCard: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		borderWidth: 1,
		borderColor: "#ddd",
		marginTop: 24,
		marginBottom: 54,
	},
	recommendationTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
});
