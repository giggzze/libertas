import { useColorScheme } from "@/hooks/useColorScheme";
import { DebtCategory } from "@/types/STT";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DebtCategoryPillProps {
	category: DebtCategory;
}

const categoryColors: Record<DebtCategory, { bg: string; text: string }> = {
	CREDIT_CARD: { bg: "#FFE5E5", text: "#FF4D4D" },
	OVERDRAFT: { bg: "#E5FFE5", text: "#4DFF4D" },
	CAR_LOAN: { bg: "#FFE5FF", text: "#FF4DFF" },
	PERSONAL_LOAN: { bg: "#FFE5D9", text: "#FF7A4D" },
	SUBSCRIPTION: { bg: "#E5E5FF", text: "#4D4DFF" },
	OTHER: { bg: "#E5E5E5", text: "#666666" },
};

const categoryLabels: Record<DebtCategory, string> = {
	CREDIT_CARD: "Credit Card",
	OVERDRAFT: "Overdraft",
	CAR_LOAN: "Car Loan",
	PERSONAL_LOAN: "Personal Loan",
	SUBSCRIPTION: "Subscription",
	OTHER: "Other",
};

export const DebtCategoryPill: React.FC<DebtCategoryPillProps> = ({
	category,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const colors = categoryColors[category];
	const label = categoryLabels[category];

	return (
		<View
			style={[
				styles.pill,
				{
					backgroundColor: isDark
						? `${colors.bg}20` // 20% opacity for dark mode
						: colors.bg,
				},
			]}>
			<Text
				style={[
					styles.text,
					{
						color: isDark
							? `${colors.text}CC` // 80% opacity for dark mode
							: colors.text,
					},
				]}>
				{label}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	pill: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		alignSelf: "flex-start",
	},
	text: {
		fontSize: 12,
		fontWeight: "500",
	},
});
