import { StyleSheet, Text, useColorScheme } from "react-native";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useDebts } from "@/src/hooks/query/useDebts";
import { useCurrentIncome } from "@/src/hooks/query/useIncome";
import { useExpenses } from "@/src/hooks/query/useExpense";
import { calculateTotalDebt, calculateTotalExpense, calculateTotalMonthlyPayment } from "@/src/utils/helpers";
import { FinancialOverview } from "@/src/components/financialOverview";
import { QuickStats } from "@/src/components/quickStats";


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

    const totalDebts: number = calculateTotalDebt(debts);
    const totalMonthlyPayments: number = calculateTotalMonthlyPayment(debts);
    const totalExpenses: number = calculateTotalExpense(expenses);
    const totalExpenseCount: number = expenses?.length || 0;


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
        <BodyScrollView>
            {/* Income vs Outgoings Banner */}
            {monthlyIncome?.amount ? monthlyIncome.amount > 0 && (
                <FinancialOverview
                    incomeUsagePercentage={incomeUsagePercentage}
                    monthlyIncome={monthlyIncome}
                    remainingIncome={remainingIncome}
                    totalMonthlyObligations={totalMonthlyObligations} />
            ) : (
                <Text>Nothing</Text>
            )}

            {/* Quick Stats Banner */}
            {(totalDebts > 0 || totalExpenseCount > 0) && (
                <QuickStats totalDebts={totalDebts}
                            totalExpenseCount={totalExpenseCount}
                            totalExpenses={totalExpenses}
                            totalMonthlyObligations={totalMonthlyObligations}
                            totalMonthlyPayments={totalMonthlyPayments} />
            )}
        </BodyScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 60
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