import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DebtCard } from "./DebtCard";

interface Debt {
	id: string;
	name: string;
	amount: number;
	interestRate: number;
	minimumPayment: number;
}

interface DebtListProps {
	debts: Debt[];
	onAddDebt: () => void;
	onEditDebt: (debt: Debt) => void;
	onDeleteDebt: (id: string) => void;
}

export function DebtList({
	debts,
	onAddDebt,
	onEditDebt,
	onDeleteDebt,
}: DebtListProps) {
	return (
		<View style={styles.section}>
			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>Your Debts</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={onAddDebt}>
					<Text style={styles.addButtonText}>Add Debt</Text>
				</TouchableOpacity>
			</View>
			{debts.map(debt => (
				<DebtCard
					key={debt.id}
					debt={debt}
					onEdit={onEditDebt}
					onDelete={onDeleteDebt}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
	},
	addButton: {
		backgroundColor: "#007AFF",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	addButtonText: {
		color: "white",
		fontWeight: "600",
	},
});
