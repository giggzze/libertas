import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import { Colors } from "@/src/constants/theme";
import { useCreateExpense } from "@/src/hooks/mutations/useExpenseMutations";
import { ExpenseInsert } from "@/src/types/STT";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";


export default function AddExpenseModal() {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");

    const { user } = useUser();
    const { mutate: createExpense } = useCreateExpense();

    const handleAddExpense = async () => {
        if (!name.trim() || !amount || !dueDate) {
            return;
        }

        const expenseData: ExpenseInsert = {
            name: name.trim(),
            amount: Number(amount),
            due_date: Number(dueDate),
            user_id: user!.id
        };

        createExpense(expenseData);
        router.dismiss();
    };

    return (
        <BodyScrollView contentContainerStyle={{ marginTop: 16 }}>
            <View style={styles.container}>
                <TextInput placeholder="Expense name" variant="filled" placeholderTextColor={Colors.light.icon}
                           value={name} onChangeText={setName} />

                <TextInput
                    variant="filled"
                    placeholder="Amount"
                    placeholderTextColor={Colors.light.icon}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <TextInput
                    variant="filled"
                    placeholder="Due date (1-31)"
                    placeholderTextColor={Colors.light.icon}
                    keyboardType="numeric"
                    value={dueDate}
                    onChangeText={setDueDate}
                />

                <View style={styles.buttonContainer}>
                    <Button onPress={handleAddExpense}>Add Expense</Button>
                </View>
            </View>
        </BodyScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginTop: 20
    }
});
