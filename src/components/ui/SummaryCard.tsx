import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { formatCurrency } from "@/src/utils/formatCurrency";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SummaryCardProps {
	title: string;
	amount: number;
	subtitle?: string;
	isNegative?: boolean;
}

export function SummaryCard({
	title,
	amount,
	subtitle,
	isNegative = false,
}: SummaryCardProps) {
	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	// Determine color based on isNegative flag
	const amountColor = isNegative
		? isDark
			? "#fc8181"
			: "#dc3545"
		: isDark
		? "#81e6d9"
		: "#2c5282";

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor,
					borderColor: isDark ? "#4a5568" : "#ddd",
				},
			]}>
			<Text style={[styles.title, { color: iconColor }]}>{title}</Text>
			<Text style={[styles.amount, { color: amountColor }]}>
				{formatCurrency(amount)}
			</Text>
			{subtitle && (
				<Text style={[styles.subtitle, { color: iconColor }]}>
					{subtitle}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		padding: 20,
		borderRadius: 12,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
	},
	title: {
		fontSize: 14,
		marginBottom: 12,
		textAlign: "center",
		fontWeight: "500",
	},
	amount: {
		fontSize: 24,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 12,
		marginTop: 4,
		opacity: 0.8,
	},
});
