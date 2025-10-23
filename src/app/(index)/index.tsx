import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";
import HeaderButton from "@/src/components/ui/HeaderButton";
import { appleBlue } from "@/src/constants/theme";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useDebts } from "@/src/hooks/query/useDebts";
import { useCurrentIncome } from "@/src/hooks/query/useIncome";
import { useExpenses } from "@/src/hooks/query/useExpense";
import {
    calculateTotalDebt,
    calculateTotalExpense,
    calculateTotalMonthlyPayment,
    getHealthColor
} from "@/src/utils/helpers";


export default function HomeScreen() {
    // Colors
    const textColor = useThemeColor("text");
    const iconColor = useThemeColor("icon");
    const backgroundColor = useThemeColor("background");
    const isDark = !!useColorScheme();

    // Queries
    const { data: debts } = useDebts(false);
    const { data: monthlyIncome } = useCurrentIncome();
    const { data: expenses } = useExpenses();

    const totalDebts: number = calculateTotalDebt(debts)
    const totalMonthlyPayments: number = calculateTotalMonthlyPayment(debts)
    const totalExpenses: number = calculateTotalExpense(expenses)
    const totalExpenseCount : number = expenses?.length || 0;


    const incomeUsagePercentage = 100;
    const totalMonthlyObligations = totalMonthlyPayments + totalExpenses;
    const remainingIncome = 30;


    // const originalTotalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
    // const amountPaidOff = originalTotalDebt - totalDebt;
    // const debtProgressPercentage =
    //   originalTotalDebt > 0 ? (amountPaidOff / originalTotalDebt) * 100 : 0;
    //
    // // Calculate projected debt-free date (simplified calculation)
    // const calculateDebtFreeDate = () => {
    //   if (totalDebt === 0 || totalMonthlyPayments === 0) return null;
    //
    //   // Simple calculation: total debt / monthly payments
    //   // This doesn't account for interest, but gives a rough estimate
    //   const monthsToPayoff = Math.ceil(totalDebt / totalMonthlyPayments);
    //   const payoffDate = new Date();
    //   payoffDate.setMonth(payoffDate.getMonth() + monthsToPayoff);
    //   return payoffDate;
    // };
    //
    // const debtFreeDate = calculateDebtFreeDate();
    //
    // // Months until debt-free
    // const monthsUntilDebtFree =
    //   totalDebt > 0 && totalMonthlyPayments > 0
    //     ? Math.ceil(totalDebt / totalMonthlyPayments)
    //     : 0;
    //
    // // Average interest rate
    // const averageInterestRate =
    //   debts.length > 0
    //     ? debts.reduce((sum, debt) => sum + (debt.interest_rate || 0), 0) /
    //       debts.length
    //     : 0;


    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <View style={{ marginLeft: 5 }}>
                            <HeaderButton
                                onPress={() => router.push("/profile")}
                                iconName="gear"
                                color={appleBlue}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{ marginLeft: 5 }}>
                            <HeaderButton
                                onPress={() => router.push("/strategy")}
                                iconName="chart.bar"
                                color={appleBlue}
                            />
                        </View>
                    )
                }}
            />
            <BodyScrollView
            >
                {/* Income vs Outgoings Banner */}
                {monthlyIncome?.amount! > 0 && (
                    <View
                        style={[
                            styles.incomeBanner,
                            { backgroundColor: backgroundColor }
                        ]}
                    >
                        <View style={styles.incomeBannerHeader}>
                            <Text style={[styles.incomeBannerTitle, { color: textColor }]}>
                                Monthly Financial Health
                            </Text>
                            <View
                                style={[
                                    styles.healthIndicator,
                                    { backgroundColor: getHealthColor(isDark, monthlyIncome?.amount, incomeUsagePercentage) }
                                ]}
                            >
                                <Text style={styles.healthIndicatorText}>
                                    {incomeUsagePercentage.toFixed(0)}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.incomeComparisonRow}>
                            <View style={styles.incomeComparisonItem}>
                                <Text style={[styles.incomeLabel, { color: iconColor }]}>
                                    Income
                                </Text>
                                <Text style={[styles.incomeAmount, { color: textColor }]}>
                                    ${monthlyIncome?.amount.toFixed(2)}
                                </Text>
                            </View>

                            <View style={styles.incomeComparisonDivider}>
                                <Text style={[styles.minusSign, { color: iconColor }]}>−</Text>
                            </View>

                            <View style={styles.incomeComparisonItem}>
                                <Text style={[styles.incomeLabel, { color: iconColor }]}>
                                    Outgoings
                                </Text>
                                <Text style={[styles.incomeAmount, { color: textColor }]}>
                                    ${totalMonthlyObligations.toFixed(2)}
                                </Text>
                            </View>

                            <View style={styles.incomeComparisonDivider}>
                                <Text style={[styles.equalsSign, { color: iconColor }]}>=</Text>
                            </View>

                            <View style={styles.incomeComparisonItem}>
                                <Text style={[styles.incomeLabel, { color: iconColor }]}>
                                    Remaining
                                </Text>
                                <Text
                                    style={[
                                        styles.incomeAmount,
                                        {
                                            color:
                                                remainingIncome < 0
                                                    ? isDark
                                                        ? "#f87171"
                                                        : "#dc2626"
                                                    : getHealthColor(isDark, monthlyIncome?.amount, incomeUsagePercentage)
                                        }
                                    ]}
                                >
                                    ${remainingIncome.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        {/* Progress bar */}
                        <View
                            style={[
                                styles.progressBarContainer,
                                { backgroundColor: isDark ? "#374151" : "#e5e7eb" }
                            ]}
                        >
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: `${Math.min(incomeUsagePercentage, 100)}%`,
                                        backgroundColor: getHealthColor(isDark, monthlyIncome.amount, incomeUsagePercentage)
                                    }
                                ]}
                            />
                        </View>
                    </View>
                )}

                {/* Quick Stats Banner */}
                {(totalDebts > 0 || totalExpenseCount > 0) && (
                    <View style={styles.quickStatsContainer}>
                        {/* Top Row - Summary Cards */}
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
                                    ${totalMonthlyObligations.toFixed(2)}
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
                                    ${totalDebts.toFixed(2)}
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
                                    {totalDebts}
                                </Text>
                                <Text style={[styles.statLabel, { color: textColor }]}>
                                    Active Debts
                                </Text>
                                <Text style={[styles.statAmount, { color: textColor }]}>
                                    ${totalMonthlyPayments.toFixed(2)}/mo
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
                                    ${totalExpenses.toFixed(2)}/mo
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </BodyScrollView>
        </>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 60
    },
    incomeBanner: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4
    },
    incomeBannerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    incomeBannerTitle: {
        fontSize: 16,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    healthIndicator: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    healthIndicatorText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "700"
    },
    incomeComparisonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    incomeComparisonItem: {
        flex: 1,
        alignItems: "center"
    },
    incomeComparisonDivider: {
        paddingHorizontal: 8
    },
    minusSign: {
        fontSize: 20,
        fontWeight: "600",
        opacity: 0.6
    },
    equalsSign: {
        fontSize: 20,
        fontWeight: "600",
        opacity: 0.6
    },
    incomeLabel: {
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        opacity: 0.7,
        marginBottom: 6
    },
    incomeAmount: {
        fontSize: 18,
        fontWeight: "700"
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden"
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 4
    },
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
    },
    insightsContainer: {
        marginHorizontal: 16,
        marginBottom: 20
    },
    insightsTitle: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
        opacity: 0.7
    },
    insightsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12
    },
    insightCard: {
        flex: 1,
        minWidth: "47%",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    insightHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12
    },
    insightLabel: {
        fontSize: 12,
        fontWeight: "600",
        opacity: 0.7
    },
    insightValue: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4
    },
    insightSubtext: {
        fontSize: 11,
        opacity: 0.6
    },
    insightProgress: {
        marginTop: 8
    },
    insightProgressBar: {
        height: 6,
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 6
    },
    insightProgressFill: {
        height: "100%",
        borderRadius: 3
    },
    insightProgressText: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: "right"
    },
    collapsibleSection: {
        marginHorizontal: 16,
        marginBottom: 16
    },
    collapsibleHeaderContainer: {
        marginBottom: 12
    },
    collapsibleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    collapsibleHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1
    },
    collapsibleHeaderRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    collapsibleTitle: {
        fontSize: 17,
        fontWeight: "700"
    },
    countBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        minWidth: 26,
        alignItems: "center",
        justifyContent: "center"
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: "700"
    },
    collapsibleAmount: {
        fontSize: 15,
        fontWeight: "600",
        opacity: 0.75
    },
    addButtonInHeader: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    collapsibleContent: {
        marginTop: 12
    },
    emptyState: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 12,
        borderStyle: "dashed",
        alignItems: "center"
    },
    emptyStateText: {
        fontSize: 14,
        textAlign: "center",
        opacity: 0.7
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: "600",
        paddingHorizontal: 16,
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        opacity: 0.6
    },
    section: {
        marginBottom: 8,
        paddingHorizontal: 16
    },
    summarySection: {
        marginBottom: 24
    },
    summaryContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 6,
        gap: 12,
        marginBottom: 8
    },
    summaryCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    summaryTitle: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center",
        fontWeight: "500"
    },
    summaryAmount: {
        fontSize: 24,
        fontWeight: "bold"
    },
    summarySubtitle: {
        fontSize: 12,
        marginTop: 4,
        opacity: 0.8
    }
});