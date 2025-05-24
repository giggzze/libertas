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
	return (
		<View style={styles.recommendationItem}>
			<Text style={styles.recommendationNumber}>{index + 1}</Text>
			<View style={styles.recommendationDetails}>
				<Text style={styles.recommendationName}>{debt.name}</Text>
				<Text style={styles.recommendationPayment}>
					Pay: ${recommendedPayment.toLocaleString()}/month
				</Text>
				{payoffTime !== Infinity && (
					<>
						<Text style={styles.recommendationTime}>
							Payoff Time: {Math.floor(payoffTime / 12)} years,{" "}
							{payoffTime % 12} months
						</Text>
						<Text style={styles.recommendationInterest}>
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
