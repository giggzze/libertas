import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { formatCurrency } from "@/src/utils/formatCurrency";
import React, { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "@/src/components/ui/IconSymbol";

interface SummaryCardProps {
	title: string;
	amount: number;
	subtitle?: string;
	isNegative?: boolean;
	iconName?: ComponentProps<typeof IconSymbol>['name'];
}

export function SummaryCard({
	title,
	amount,
	subtitle,
	isNegative = false,
	iconName,
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
					borderColor: isDark ? "#4a5568" : "#e2e8f0",
				},
			]}>
			{iconName && (
				<View style={[styles.iconContainer, { backgroundColor: isDark ? "#374151" : "#f1f5f9" }]}>
					<IconSymbol name={iconName} size={20} color={amountColor} />
				</View>
			)}
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
		padding: 18,
		borderRadius: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 3,
		borderWidth: 1,
		minHeight: 120,
		justifyContent: "center",
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	title: {
		fontSize: 13,
		marginBottom: 8,
		textAlign: "center",
		fontWeight: "500",
		opacity: 0.8,
	},
	amount: {
		fontSize: 22,
		fontWeight: "700",
		letterSpacing: -0.5,
	},
	subtitle: {
		fontSize: 11,
		marginTop: 4,
		opacity: 0.7,
		fontWeight: "500",
	},
});
