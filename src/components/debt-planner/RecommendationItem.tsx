import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Debt } from "@/src/types/STT";
import { formatCurrency } from "@/src/utils/formatCurrency";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DebtCategoryPill } from "./DebtCategoryPill";

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
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	const formatPayoffTime = (months: number) => {
		if (!isFinite(months)) {
			return "Cannot be paid off with current payment";
		}
		const years = Math.floor(months / 12);
		const remainingMonths = Math.round(months % 12);
		if (years === 0) {
			return `${remainingMonths} months`;
		}
		return `${years} years${
			remainingMonths > 0 ? `, ${remainingMonths} months` : ""
		}`;
	};

	const isMinimumPayment = recommendedPayment <= debt.minimum_payment;

	return (
		<View
			style={[
				styles.recommendationItem,
				{ borderBottomColor: isDark ? "#4a5568" : "#eee" },
			]}>
			<Text
				style={[
					styles.recommendationNumber,
					{
						backgroundColor: tintColor,
						color: isDark ? "#000" : "#fff",
					},
				]}>
				{index + 1}
			</Text>
			<View style={styles.recommendationDetails}>
				<View style={styles.headerRow}>
					<Text
						style={[
							styles.recommendationName,
							{ color: textColor },
						]}>
						{debt.name}
					</Text>
					<DebtCategoryPill category={debt.category} />
				</View>
				<Text
					style={[
						styles.recommendationPayment,
						{ color: iconColor },
					]}>
					{isMinimumPayment ? (
						<>
							Minimum Payment:{" "}
							{formatCurrency(recommendedPayment)}/month
						</>
					) : (
						<>Pay: {formatCurrency(recommendedPayment)}/month</>
					)}
				</Text>
				<Text style={[styles.recommendationTime, { color: iconColor }]}>
					Payoff Time: {formatPayoffTime(payoffTime)}
				</Text>
				{isFinite(totalInterest) && (
					<Text
						style={[
							styles.recommendationInterest,
							{ color: iconColor },
						]}>
						Total Interest: {formatCurrency(totalInterest)}
					</Text>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	recommendationItem: {
		flexDirection: "row",
		marginBottom: 6,
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
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	recommendationName: {
		fontSize: 16,
		fontWeight: "600",
		flex: 1,
		marginRight: 8,
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
