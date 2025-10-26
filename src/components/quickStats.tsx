import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "@/src/hooks/use-theme-color";


interface QuickStatsProps {
    totalDebts: number,
    totalExpenses: number,
    totalMonthlyObligations: number,
    totalDebtCount: number,
    totalExpenseCount: number,
    totalMonthlyPayments: number
}

export const QuickStats = ({
                               totalDebts,
                               totalExpenses,
                               totalMonthlyObligations,
                               totalExpenseCount,
                               totalMonthlyPayments,
                                totalDebtCount,
                           }: QuickStatsProps) => {
    const textColor = useThemeColor("text");
    const backgroundColor = useThemeColor("background");


    return (
        <View style={styles.quickStatsContainer}>
            {/*Top Row - Summary Cards */}
            <View style={styles.summaryRow}>
                <View
                    style={[
                        styles.summaryStatCard,
                        { backgroundColor: backgroundColor }
                    ]}
                >
                    <Text style={[styles.summaryStatLabel, { color: textColor }]}>
                        Total Outgoings
                    </Text>
                    <Text style={[styles.summaryStatAmount, { color: textColor }]}>
                        £{totalMonthlyObligations.toFixed(2)}
                    </Text>
                    <Text style={[styles.summaryStatSubtext, { color: textColor }]}>
                        Monthly
                    </Text>
                </View>
                <View
                    style={[
                        styles.summaryStatCard,
                        { backgroundColor: backgroundColor }
                    ]}
                >
                    <Text style={[styles.summaryStatLabel, { color: textColor }]}>
                        Total Debt
                    </Text>
                    <Text style={[styles.summaryStatAmount, { color: textColor }]}>
                        £{totalDebts ? totalDebts.toFixed(2) : 0}
                    </Text>
                    <Text style={[styles.summaryStatSubtext, { color: textColor }]}>
                        Remaining
                    </Text>
                </View>
            </View>

            {/* Bottom Row - Detailed Stats */}
            <View
                style={[
                    styles.quickStats,
                    { backgroundColor: backgroundColor }
                ]}
            >
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: textColor }]}>
                        {totalDebtCount}
                    </Text>
                    <Text style={[styles.statLabel, { color: textColor }]}>
                        Active Debts
                    </Text>
                    <Text style={[styles.statAmount, { color: textColor }]}>
                        £{totalMonthlyPayments.toFixed(2)}/mo
                    </Text>
                </View>
                <View
                    style={[
                        styles.statDivider,
                        { backgroundColor: backgroundColor }
                    ]}
                />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: textColor }]}>
                        {totalExpenseCount}
                    </Text>
                    <Text style={[styles.statLabel, { color: textColor }]}>
                        Monthly Expenses
                    </Text>
                    <Text style={[styles.statAmount, { color: textColor }]}>
                        £{totalExpenses.toFixed(2)}/mo
                    </Text>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    quickStatsContainer: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
        gap: 12
    },
    summaryRow: {
        flexDirection: "row",
        gap: 12
    },
    summaryStatCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    summaryStatLabel: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        opacity: 0.7,
        marginBottom: 8
    },
    summaryStatAmount: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4
    },
    summaryStatSubtext: {
        fontSize: 11,
        opacity: 0.6
    },
    quickStats: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    statItem: {
        flex: 1,
        alignItems: "center"
    },
    statNumber: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 4
    },
    statLabel: {
        fontSize: 13,
        opacity: 0.7,
        marginBottom: 4
    },
    statAmount: {
        fontSize: 12,
        fontWeight: "600",
        opacity: 0.8
    },
    statDivider: {
        width: 1,
        height: 60,
        marginHorizontal: 16
    }
});
