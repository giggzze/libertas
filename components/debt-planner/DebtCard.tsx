import { IconSymbol } from "@/components/ui/IconSymbol";
import { DebtWithPayments } from "@/types/STT";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DebtCardProps {
	debt: DebtWithPayments;
	onEdit: (debt: DebtWithPayments) => void;
	onDelete: (id: string) => void;
}

export function DebtCard({ debt, onEdit, onDelete }: DebtCardProps) {
	// Calculate the current balance (remaining amount or original amount if no payments)
	const currentBalance = debt.remaining_balance || debt.amount;
	const totalPaid = debt.total_paid || 0;

	return (
		<View style={styles.debtCard}>
			<View style={styles.debtHeader}>
				<Text style={styles.debtName}>{debt.name}</Text>
				<Text style={styles.debtAmount}>
					${currentBalance.toLocaleString()}
				</Text>
			</View>
			<View style={styles.debtDetails}>
				<View style={styles.detailColumn}>
					<Text style={styles.debtDetail}>
						Interest Rate: {debt.interest_rate}%
					</Text>
					<Text style={styles.debtDetail}>
						Minimum Payment: ${debt.minimum_payment}
					</Text>
				</View>
				{totalPaid > 0 && (
					<View style={styles.detailColumn}>
						<Text style={styles.debtDetail}>
							Original: ${debt.amount.toLocaleString()}
						</Text>
						<Text style={[styles.debtDetail, styles.paidAmount]}>
							Paid: ${totalPaid.toLocaleString()}
						</Text>
					</View>
				)}
			</View>
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.actionButton, styles.editButton]}
					onPress={() => onEdit(debt)}>
					<IconSymbol
						name='pencil'
						size={16}
						color='white'
					/>
					<Text style={styles.actionButtonText}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, styles.deleteButton]}
					onPress={() => onDelete(debt.id)}>
					<IconSymbol
						name='trash'
						size={16}
						color='white'
					/>
					<Text style={styles.actionButtonText}>Delete</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	debtCard: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#ddd",
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
		color: "#333",
	},
	debtAmount: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2c3e50",
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
		color: "#666",
		fontSize: 14,
		marginBottom: 2,
	},
	paidAmount: {
		color: "#28a745",
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
	editButton: {
		backgroundColor: "#007AFF",
	},
	deleteButton: {
		backgroundColor: "#FF3B30",
	},
	actionButtonText: {
		color: "white",
		fontWeight: "600",
		fontSize: 14,
	},
});
