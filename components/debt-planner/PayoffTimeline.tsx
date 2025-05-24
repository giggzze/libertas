import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculatePayoffTime } from "@/utils/debtCalculations";
import { format } from "date-fns";
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
	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";
	const screenWidth = Dimensions.get("window").width - 32; // Account for padding

	// Calculate the maximum (finite) payoff time
	const finitePayoffTimes = debts
		.map((debt, index) =>
			calculatePayoffTime(debt, recommendedPayments[debt.id])
		)
		.filter(time => isFinite(time) && time > 0);
	const maxPayoffTime =
		finitePayoffTimes.length > 0 ? Math.max(...finitePayoffTimes) : 1;

	// Calculate date labels
	const now = new Date();
	const startLabel = format(now, "MMM yyyy");
	let endDate = new Date(now);
	endDate.setMonth(endDate.getMonth() + Math.round(maxPayoffTime));
	const endLabel = format(endDate, "MMM yyyy");

	const timelineItems = debts.map((debt, index) => {
		const payoffTime = calculatePayoffTime(
			debt,
			recommendedPayments[debt.id]
		);
		// If payoffTime is not finite, set to minimal width
		let width = 10;
		if (isFinite(payoffTime) && payoffTime > 0 && maxPayoffTime > 0) {
			const widthPercentage = payoffTime / maxPayoffTime;
			width = Math.max(10, widthPercentage * (screenWidth - 32));
		}
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
			<Text style={[styles.title, { color: textColor }]}>
				Payoff Timeline
			</Text>
			<View
				style={[
					styles.timelineContainer,
					{
						backgroundColor,
						borderColor: isDark ? "#4a5568" : "#ddd",
					},
				]}>
				<View style={styles.timelineLabels}>
					<Text
						style={[
							styles.timelineLabel,
							{ color: iconColor, textAlign: "left" },
						]}>
						{startLabel}
					</Text>
					<Text
						style={[
							styles.timelineLabel,
							{ color: iconColor, textAlign: "right" },
						]}>
						{endLabel}
					</Text>
				</View>
				<View style={styles.timeline}>
					{timelineItems.map((item, index) => (
						<View
							key={item.debt.id}
							style={[
								styles.timelineBar,
								{
									width: item.width,
									backgroundColor: item.color,
									marginRight:
										index < timelineItems.length - 1
											? 4
											: 0,
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
								<Text
									style={[
										styles.legendName,
										{ color: textColor },
									]}>
									{item.debt.name}
								</Text>
								<Text
									style={[
										styles.legendTime,
										{ color: iconColor },
									]}>
									{!isFinite(item.payoffTime)
										? "Minimum payments only"
										: `${Math.floor(
												item.payoffTime / 12
										  )} years, ${Math.round(
												item.payoffTime % 12
										  )} months`}
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
		marginTop: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
	},
	timelineContainer: {
		borderRadius: 8,
		padding: 16,
		borderWidth: 1,
	},
	timeline: {
		height: 40,
		flexDirection: "row",
		marginBottom: 16,
		position: "relative",
		backgroundColor: "rgba(200, 200, 200, 0.2)",
		borderRadius: 4,
		overflow: "hidden",
	},
	timelineBar: {
		height: "100%",
		borderRadius: 4,
		opacity: 0.8,
		minWidth: 10,
	},
	timelineLabels: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 4,
		marginBottom: 8,
	},
	timelineLabel: {
		fontSize: 12,
		flex: 1,
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
	},
	legendTime: {
		fontSize: 12,
	},
});
