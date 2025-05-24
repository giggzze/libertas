import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Debt {
	id: string;
	name: string;
	amount: number;
	interestRate: number;
	minimumPayment: number;
}

interface RecommendationItemProps {
	debt: Debt;
	index: number;
	recommendedPayment: number;
	payoffTime: number;
	totalInterest: number;
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({
	debt,
	index,
	recommendedPayment,
	payoffTime,
	totalInterest,
}) => {
	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";
	return (
		<View style={[styles.recommendationItem, { borderBottomColor: isDark ? "#4a5568" : "#eee" }]}>
			<Text style={[styles.recommendationNumber, { backgroundColor: tintColor, color: isDark ? "#000" : "#fff" }]}>{index + 1}</Text>
			<View style={styles.recommendationDetails}>
				<Text style={[styles.recommendationName, { color: textColor }]}>{debt.name}</Text>
				<Text style={[styles.recommendationPayment, { color: iconColor }]}>
					Pay: ${recommendedPayment.toLocaleString()}/month
				</Text>
				{payoffTime !== Infinity && (
					<>
						<Text style={[styles.recommendationTime, { color: iconColor }]}>
							Payoff Time: {Math.floor(payoffTime / 12)} years,{" "}
							{payoffTime % 12} months
						</Text>
						<Text style={[styles.recommendationInterest, { color: iconColor }]}>
							Total Interest: ${totalInterest.toLocaleString()}
						</Text>
					</>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	recommendationItem: {
		flexDirection: "row",
		marginBottom: 26,
		paddingBottom: 16,
		borderBottomWidth: 1,
	},
	recommendationNumber: {
		width: 24,
		height: 24,
		borderRadius: 12,
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
		marginBottom: 4,
	},
	recommendationPayment: {
		fontSize: 14,
		marginBottom: 2,
	},
	recommendationTime: {
		fontSize: 14,
		marginBottom: 2,
	},
	recommendationInterest: {
		fontSize: 14,
	},
});
