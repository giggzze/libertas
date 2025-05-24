import { calculatePayoffTime } from "@/utils/debtCalculations";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

interface Debt {
	id: string;
	name: string;
	amount: number;
	interestRate: number;
	minimumPayment: number;
}

interface PayoffTimelineProps {
	debts: Debt[];
	recommendedPayments: { [key: string]: number };
	totalMonths: number;
}

const TIMELINE_COLORS = [
	"#FF6B6B", // Red
	"#4ECDC4", // Teal
	"#45B7D1", // Blue
	"#96CEB4", // Green
	"#FFEEAD", // Yellow
	"#D4A5A5", // Pink
	"#9B59B6", // Purple
	"#3498DB", // Light Blue
	"#E67E22", // Orange
	"#2ECC71", // Emerald
];

export function PayoffTimeline({
	debts,
	recommendedPayments,
	totalMonths,
}: PayoffTimelineProps) {
	const screenWidth = Dimensions.get("window").width - 32; // Account for padding
	const timelineItems = debts.map((debt, index) => {
		const payoffTime = calculatePayoffTime(
			debt,
			recommendedPayments[debt.id]
		);
		const width = (payoffTime / totalMonths) * screenWidth;
		const color = TIMELINE_COLORS[index % TIMELINE_COLORS.length];

		return {
			debt,
			payoffTime,
			width,
			color,
		};
	});

	// Sort by payoff time to create a stacked timeline
	timelineItems.sort((a, b) => a.payoffTime - b.payoffTime);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Payoff Timeline</Text>
			<View style={styles.timelineContainer}>
				<View style={styles.timeline}>
					{timelineItems.map((item, index) => (
						<View
							key={item.debt.id}
							style={[
								styles.timelineBar,
								{
									width: item.width,
									backgroundColor: item.color,
									zIndex: timelineItems.length - index,
								},
							]}
						/>
					))}
				</View>
				<View style={styles.legend}>
					{timelineItems.map((item, index) => (
						<View
							key={item.debt.id}
							style={styles.legendItem}>
							<View
								style={[
									styles.legendColor,
									{ backgroundColor: item.color },
								]}
							/>
							<View style={styles.legendText}>
								<Text style={styles.legendName}>
									{item.debt.name}
								</Text>
								<Text style={styles.legendTime}>
									{Math.floor(item.payoffTime / 12)} years,{" "}
									{item.payoffTime % 12} months
								</Text>
							</View>
						</View>
					))}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 24,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	timelineContainer: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	timeline: {
		height: 40,
		flexDirection: "row",
		marginBottom: 16,
		position: "relative",
	},
	timelineBar: {
		height: "100%",
		position: "absolute",
		left: 0,
		borderRadius: 4,
		opacity: 0.8,
	},
	legend: {
		gap: 8,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	legendColor: {
		width: 16,
		height: 16,
		borderRadius: 4,
	},
	legendText: {
		flex: 1,
	},
	legendName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
	},
	legendTime: {
		fontSize: 12,
		color: "#666",
	},
});
