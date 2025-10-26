import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Debt, DebtWithPayments } from "@/src/types/STT";
import { formatCurrency } from "@/src/utils/formatCurrency";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { appleBlue, appleGreen, appleRed } from "@/src/constants/theme";

interface DebtCardProps {
    debt: Debt;
    onEdit: (debt: DebtWithPayments) => void;
    onDelete: (debtId: string) => void;
    onMakePayment: (debt: DebtWithPayments) => void;
    onShowHistory: (debt: DebtWithPayments) => void;
    onAddCharge: (debt: DebtWithPayments) => void;
}

export function DebtCard({ debt, onDelete }: DebtCardProps) {
    const currentBalance = debt.amount;
    const totalPaid = 0;

    // Theme hooks
    const colorScheme = useColorScheme();
    const backgroundColor = useThemeColor("background");
    const textColor = useThemeColor("text");
    const iconColor = useThemeColor("icon");
    const isDark = colorScheme === "dark";

    const handleDelete = () => {
        Alert.alert("Remove Debt", `Are you sure you want to delete ${debt.name}?`, [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(debt.id)
            }
        ]);
    };
    const handlePayment = () => {
    };
    const handleHistory = () => {
    };
    const handleCharge = () => {
    };

    return (
        <View style={[styles.debtCard, { backgroundColor }]}>
            <View style={styles.debtHeader}>
                <Text style={[styles.debtName, { color: textColor }]}>{debt.name}</Text>
                <Text style={[styles.debtAmount, { color: isDark ? "#81e6d9" : "#2c5282" }]}>
                    {formatCurrency(currentBalance)}
                </Text>
            </View>

            <View style={styles.debtDetails}>
                <View style={styles.detailRow}>
                    <Text style={[styles.debtDetail, { color: iconColor }]}>Interest Rate: {debt.interest_rate}%</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.debtDetail, { color: iconColor }]}>
                        Minimum Payment: {formatCurrency(debt.minimum_payment)}
                    </Text>
                </View>
                {totalPaid > 0 && (
                    <>
                        <View style={styles.detailRow}>
                            <Text style={[styles.debtDetail, { color: iconColor }]}>
                                Original: {formatCurrency(debt.amount)}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text
                                style={[
                                    styles.debtDetail,
                                    styles.paidAmount,
                                    { color: isDark ? "#68d391" : "#28a745" }
                                ]}
                            >
                                Paid: {formatCurrency(totalPaid)}
                            </Text>
                        </View>
                    </>
                )}
            </View>

            {/*<View style={styles.actionButtons}>*/}
            {/*    <TouchableOpacity*/}
            {/*        style={[styles.actionButton, { backgroundColor: appleGreen }]}*/}
            {/*        onPress={() => handlePayment()}*/}
            {/*    >*/}
            {/*        <IconSymbol name="arrow.down" size={16} color="#ffffff" />*/}
            {/*        <Text style={styles.actionButtonText}>Pay</Text>*/}
            {/*    </TouchableOpacity>*/}

            {/*    <TouchableOpacity*/}
            {/*        style={[styles.actionButton, { backgroundColor: appleBlue }]}*/}
            {/*        onPress={() => handleCharge()}*/}
            {/*    >*/}
            {/*        <IconSymbol name="arrow.up" size={16} color="#ffffff" />*/}
            {/*        <Text style={styles.actionButtonText}>Charge</Text>*/}
            {/*    </TouchableOpacity>*/}

            {/*    <TouchableOpacity*/}
            {/*        style={[styles.actionButton, { backgroundColor: iconColor }]}*/}
            {/*        onPress={() => handleHistory()}*/}
            {/*    >*/}
            {/*        <IconSymbol name="clock" size={16} color="#ffffff" />*/}
            {/*        <Text style={styles.actionButtonText}>History</Text>*/}
            {/*    </TouchableOpacity>*/}

            {/*    <TouchableOpacity*/}
            {/*        style={[styles.deleteButton, { backgroundColor: appleRed }]}*/}
            {/*        onPress={() => handleDelete()}*/}
            {/*    >*/}
            {/*        <IconSymbol name="trash" size={16} color="#ffffff" />*/}
            {/*        <Text style={styles.actionButtonText}>Delete</Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*</View>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    debtCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    debtHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    debtName: {
        fontSize: 17,
        fontWeight: "700"
    },
    debtAmount: {
        fontSize: 17,
        fontWeight: "700"
    },
    debtDetails: {
        marginBottom: 12
    },
    detailRow: {
        marginBottom: 6
    },
    toggleButton: {
        alignItems: "center",
        paddingVertical: 8
    },
    debtDetail: {
        fontSize: 14,
        opacity: 0.8
    },
    paidAmount: {
        fontWeight: "600",
        opacity: 1
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 8
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
        width: "85%"
    },
    actionButtonText: {
        fontWeight: "600",
        fontSize: 14,
        color: "#ffffff"
    }
});
