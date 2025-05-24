import { PayoffTimeline } from "@/components/debt-planner/PayoffTimeline";
import { RecommendationItem } from "@/components/debt-planner/RecommendationItem";
import {
	PayoffStrategy,
	StrategySelector,
} from "@/components/debt-planner/StrategySelector";
import {
	calculatePayoffOrder,
	calculatePayoffTime,
	calculateRecommendedPayment,
	calculateTotalInterest,
} from "@/utils/debtCalculations";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface Debt {
	id: string;
	name: string;
	amount: number;
	interestRate: number;
	minimumPayment: number;
}

// Mock data for initial development
const mockDebts = [
	{
		id: "1",
		name: "Credit Card",
		amount: 5000,
		interestRate: 19.99,
		minimumPayment: 100,
	},
	{
		id: "2",
		name: "Student Loan",
		amount: 25000,
		interestRate: 5.5,
		minimumPayment: 300,
	},
	{
		id: "3",
		name: "Car Loan",
		amount: 15000,
		interestRate: 4.5,
		minimumPayment: 350,
	},
];

export default function StrategyScreen() {
	const [selectedStrategy, setSelectedStrategy] =
		React.useState<PayoffStrategy>("snowball");
	const [monthlyIncome, setMonthlyIncome] = React.useState("5000");
	const [debts, setDebts] = React.useState(mockDebts);

	const totalMonthlyPayments = debts.reduce(
		(sum, debt) => sum + debt.minimumPayment,
		0
	);

	const availablePayment = Number(monthlyIncome) - totalMonthlyPayments;

	const recommendedPayments = calculateRecommendedPayment(
		debts,
		selectedStrategy,
		Number(monthlyIncome)
	);

	const payoffOrder = calculatePayoffOrder(debts, selectedStrategy);

	// Calculate total months for timeline
	const totalMonths = Math.max(
		...payoffOrder.map(debt =>
			calculatePayoffTime(debt, recommendedPayments[debt.id])
		)
	);

	return (
		<ScrollView
			contentContainerStyle={styles.scrollViewContent}
			showsVerticalScrollIndicator={false}>
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
	recommendationItem: {
		flexDirection: "row",
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
