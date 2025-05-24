import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Expense } from "@/types/STT";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ExpenseListProps {
	expenses: Expense[];
	onAddExpense: () => void;
	onEditExpense: (expense: Expense) => void;
	onDeleteExpense: (id: string) => void;
}

export function ExpenseList({
	expenses,
	onAddExpense,
	onEditExpense,
	onDeleteExpense,
}: ExpenseListProps) {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const textColor = useThemeColor({}, "text");
	const iconColor = useThemeColor({}, "icon");
	const tintColor = useThemeColor({}, "tint");

	const handleDelete = (expense: Expense) => {
		Alert.alert(
			"Delete Expense",
			`Are you sure you want to delete ${expense.name}?`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: () => onDeleteExpense(expense.id),
				},
			]
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: textColor }]}>
					Monthly Expenses
				</Text>
				<TouchableOpacity
					style={[styles.addButton, { backgroundColor: tintColor }]}
					onPress={onAddExpense}>
					<IconSymbol
						name='plus'
						size={20}
						color={isDark ? "black" : "white"}
					/>
				</TouchableOpacity>
			</View>

			{expenses.length === 0 ? (
				<Text style={[styles.emptyText, { color: iconColor }]}>
					No expenses added yet
				</Text>
			) : (
				expenses.map(expense => (
					<View
						key={expense.id}
						style={[
							styles.expenseItem,
							{
								backgroundColor: isDark ? "#2d3748" : "white",
								borderColor: isDark ? "#4a5568" : "#ddd",
							},
						]}>
						<View style={styles.expenseInfo}>
							<Text
								style={[
									styles.expenseName,
									{ color: textColor },
								]}>
								{expense.name}
							</Text>
							<Text
								style={[
									styles.expenseAmount,
									{ color: textColor },
								]}>
								${expense.amount.toLocaleString()}
							</Text>
							<Text
								style={[styles.dueDate, { color: iconColor }]}>
								Due: {expense.due_date}th
							</Text>
						</View>
						<View style={styles.actions}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={() => onEditExpense(expense)}>
								<IconSymbol
									name='pencil'
									size={20}
									color={iconColor}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={() => handleDelete(expense)}>
								<IconSymbol
									name='trash'
									size={20}
									color='#ff3b30'
								/>
							</TouchableOpacity>
						</View>
					</View>
				))
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	addButton: {
		padding: 8,
		borderRadius: 8,
	},
	emptyText: {
		textAlign: "center",
		fontSize: 16,
		marginTop: 16,
	},
	expenseItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		marginBottom: 8,
	},
	expenseInfo: {
		flex: 1,
	},
	expenseName: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	expenseAmount: {
		fontSize: 16,
		marginBottom: 4,
	},
	dueDate: {
		fontSize: 14,
	},
	actions: {
		flexDirection: "row",
		gap: 8,
	},
	actionButton: {
		padding: 8,
	},
});
