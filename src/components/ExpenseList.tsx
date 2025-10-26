import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Expense } from "@/src/types/STT";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import ExpenseItem from "@/src/components/ExpenseItem";

interface ExpenseListProps {
    expenses: Expense[];
    onDeleteExpense: (expenseId: string) => void;
    loading?: boolean;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const textColor = useThemeColor("text");
    const iconColor = useThemeColor("icon");

    // const onAddExpense = () => {
    //   router.push('/(tabs)/AddExpenseModal');
    // };

    return (
        <View style={styles.container}>
            {expenses.length === 0 ? (
                <Text style={[styles.emptyText, { color: iconColor }]}>
                    No expenses added yet
                </Text>
            ) : (
                expenses.map((expense) => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        onDeleteExpense={onDeleteExpense}
                        isDark={isDark}
                        textColor={textColor}
                        iconColor={iconColor}
                    />
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    addButton: {
        padding: 8,
        borderRadius: 8
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 16
    },
    expenseItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8
    },
    expenseInfo: {
        flex: 1
    },
    expenseName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4
    },
    expenseAmount: {
        fontSize: 16,
        marginBottom: 4
    },
    dueDate: {
        fontSize: 14
    },
    actions: {
        flexDirection: "row",
        gap: 8
    },
    actionButton: {
        padding: 8
    },
    deleteButton: {
        padding: 8,
        backgroundColor: "#e53e3e"
    }
});
