import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DebtWithPayments } from "@/types/STT";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DebtCardProps {
	debt: DebtWithPayments;
	onEdit: (debt: DebtWithPayments) => void;
	onDelete: (debtId: string) => void;
}

export function DebtCard({ debt, onEdit, onDelete }: DebtCardProps) {
	// Calculate the current balance (remaining amount or original amount if no payments)
	const currentBalance = debt.remaining_balance || debt.amount;
	const totalPaid = debt.total_paid || 0;

	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";

	return (
		<View
			style={[
				styles.debtCard,
				{ backgroundColor, borderColor: isDark ? "#4a5568" : "#ddd" },
			]}>
			<View style={styles.debtHeader}>
				<Text style={[styles.debtName, { color: textColor }]}>
					{debt.name}
				</Text>
				<Text
					style={[
						styles.debtAmount,
						{ color: isDark ? "#81e6d9" : "#2c5282" },
					]}>
					{formatCurrency(currentBalance)}
				</Text>
			</View>
			<View style={styles.debtDetails}>
				<View style={styles.detailColumn}>
					<Text style={[styles.debtDetail, { color: iconColor }]}>
						Interest Rate: {debt.interest_rate}%
					</Text>
					<Text style={[styles.debtDetail, { color: iconColor }]}>
						Minimum Payment: {formatCurrency(debt.minimum_payment)}
					</Text>
				</View>
				{totalPaid > 0 && (
					<View style={styles.detailColumn}>
						<Text style={[styles.debtDetail, { color: iconColor }]}>
							Original: {formatCurrency(debt.amount)}
						</Text>
						<Text
							style={[
								styles.debtDetail,
								styles.paidAmount,
								{ color: isDark ? "#68d391" : "#28a745" },
							]}>
							Paid: {formatCurrency(totalPaid)}
						</Text>
					</View>
				)}
			</View>
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[
						styles.actionButton,
						styles.editButton,
						{ backgroundColor: tintColor },
					]}
					onPress={() => onEdit(debt)}>
					<IconSymbol
						name='pencil'
						size={16}
						color={isDark ? "#000" : "#fff"}
					/>
					<Text
						style={[
							styles.actionButtonText,
							{ color: isDark ? "#000" : "#fff" },
						]}>
						Edit
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, styles.deleteButton]}
					onPress={() => onDelete(debt.id)}>
					<IconSymbol
						name='trash'
						size={16}
						color={isDark ? "#000" : "#fff"}
					/>
					<Text
						style={[
							styles.actionButtonText,
							{ color: isDark ? "#000" : "#fff" },
						]}>
						Delete
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	debtCard: {
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
	},
	debtHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	debtName: {
		fontSize: 18,
		fontWeight: "600",
	},
	debtAmount: {
		fontSize: 18,
		fontWeight: "bold",
	},
	debtDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	detailColumn: {
		flex: 1,
	},
	debtDetail: {
		fontSize: 14,
		marginBottom: 2,
	},
	paidAmount: {
		fontWeight: "600",
	},
	actionButtons: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 8,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		gap: 4,
	},
	editButton: {},
	deleteButton: {
		backgroundColor: "#FF3B30",
	},
	actionButtonText: {
		fontWeight: "600",
		fontSize: 14,
	},
});
