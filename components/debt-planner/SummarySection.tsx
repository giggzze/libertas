import {
	calculatePayoffOrder,
	calculatePayoffTime,
	calculateRecommendedPayment,
	calculateTotalInterest,
} from "@/utils/debtCalculations";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PayoffTimeline } from "./PayoffTimeline";
import {  StrategySelector } from "./StrategySelector";
import {PayoffStrategy} from "@/types/STT";


interface Debt {
	id: string;
	name: string;
	amount: number;
	interestRate: number;
	minimumPayment: number;
}

interface SummarySectionProps {
	totalDebt: number;
	totalMonthlyPayments: number;
	income: string;
	debts: Debt[];
}

export function SummarySection({
	totalDebt,
	totalMonthlyPayments,
	income,
	debts,
}: SummarySectionProps) {
	const [selectedStrategy, setSelectedStrategy] =
		React.useState<PayoffStrategy>("snowball");
	const monthlyIncome = Number(income) || 0;
	const availablePayment = monthlyIncome - totalMonthlyPayments;

	const recommendedPayments = calculateRecommendedPayment(
		debts,
		selectedStrategy,
		monthlyIncome
	);

	const payoffOrder = calculatePayoffOrder(debts, selectedStrategy);

	// Calculate total months for timeline
	const totalMonths = Math.max(
		...payoffOrder.map(debt =>
			calculatePayoffTime(debt, recommendedPayments[debt.id])
		)
	);

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Summary</Text>

			<View style={styles.summaryCard}>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Total Debt:</Text>
					<Text style={styles.summaryValue}>
						${totalDebt.toLocaleString()}
					</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Monthly Payments:</Text>
					<Text style={styles.summaryValue}>
						${totalMonthlyPayments.toLocaleString()}
					</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Monthly Income:</Text>
					<Text style={styles.summaryValue}>
						${monthlyIncome.toLocaleString()}
					</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>
						Available for Extra Payments:
					</Text>
					<Text style={styles.summaryValue}>
						${availablePayment.toLocaleString()}
					</Text>
				</View>
			</View>

			<StrategySelector
				selectedStrategy={selectedStrategy}
				onStrategyChange={setSelectedStrategy}
			/>

			<PayoffTimeline
				debts={payoffOrder}
				recommendedPayments={recommendedPayments}
				totalMonths={totalMonths}
			/>

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
						<View
							key={debt.id}
							style={styles.recommendationItem}>
							<Text style={styles.recommendationNumber}>
								{index + 1}
							</Text>
							<View style={styles.recommendationDetails}>
								<Text style={styles.recommendationName}>
									{debt.name}
								</Text>
								<Text style={styles.recommendationPayment}>
									Pay: ${recommendedPayment.toLocaleString()}
									/month
								</Text>
								{payoffTime !== Infinity && (
									<>
										<Text style={styles.recommendationTime}>
											Payoff Time:{" "}
											{Math.floor(payoffTime / 12)} years,{" "}
											{payoffTime % 12} months
										</Text>
										<Text
											style={
												styles.recommendationInterest
											}>
											Total Interest: $
											{totalInterest.toLocaleString()}
										</Text>
									</>
								)}
							</View>
						</View>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	summaryCard: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	summaryLabel: {
		fontSize: 16,
		color: "#666",
	},
	summaryValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	recommendationCard: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		borderWidth: 1,
		borderColor: "#ddd",
		marginTop: 24,
	},
	recommendationTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	recommendationItem: {
		flexDirection: "row",
		marginBottom: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	recommendationNumber: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "#007AFF",
		color: "white",
		textAlign: "center",
		lineHeight: 24,
		marginRight: 12,
		fontWeight: "bold",
	},
	recommendationDetails: {
		flex: 1,
	},
	recommendationName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	recommendationPayment: {
		fontSize: 14,
		color: "#666",
		marginBottom: 2,
	},
	recommendationTime: {
		fontSize: 14,
		color: "#666",
		marginBottom: 2,
	},
	recommendationInterest: {
		fontSize: 14,
		color: "#666",
	},
});
