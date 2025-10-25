import { ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useDebts } from "@/src/hooks/query/useDebts";
import { useCurrentIncome } from "@/src/hooks/query/useIncome";
import { useExpenses } from "@/src/hooks/query/useExpense";
import { calculateTotalDebt, calculateTotalExpense, calculateTotalMonthlyPayment } from "@/src/utils/helpers";
import { FinancialOverview } from "@/src/components/financialOverview";
import { QuickStats } from "@/src/components/quickStats";
import { DebtCollapse } from "@/src/components/debtCollapse";
import { ExpanseCollapse } from "@/src/components/expanseCollapse";


export default function HomeScreen() {
    // Colors
    const textColor = useThemeColor("text");
    const iconColor = useThemeColor("icon");
    const backgroundColor = useThemeColor("background");
    const isDark = !!useColorScheme();

    // Queries
    const { data: debts, isLoading: debtLoading } = useDebts(false);
    const { data: monthlyIncome, isLoading: incomeLoading } = useCurrentIncome();
    const { data: expenses, isLoading: expensesLoading } = useExpenses();

    if (debtLoading || incomeLoading || expensesLoading) {
        return <ActivityIndicator />;
    }

    console.log(expenses, "expenses");

    const totalDebtAmount: number = calculateTotalDebt(debts!);
    const totalMonthlyPaymentAmount: number = calculateTotalMonthlyPayment(debts!);
    const totalExpenseAmount: number = calculateTotalExpense(expenses!);
    const totalExpenseCount: number = expenses?.length ?? 0;
    const totalDebtCount: number = debts?.length ?? 0;

    const totalMonthlyObligations = totalMonthlyPaymentAmount + totalExpenseAmount;
    const incomeUsagePercentage =  monthlyIncome?.amount > 0 ? (totalMonthlyObligations / monthlyIncome?.amount) * 100 : 0;
    const remainingIncome = monthlyIncome?.amount - totalMonthlyObligations;


    const originalTotalDebt = debts?.reduce((sum, debt) => sum + debt.amount, 0);
//     const amountPaidOff = originalTotalDebt - totalDebt;
//     const debtProgressPercentage =
//       originalTotalDebt > 0 ? (amountPaidOff / originalTotalDebt) * 100 : 0;

    const calculateDebtFreeDate = () => {
        if (totalDebtAmount === 0 || totalMonthlyPaymentAmount === 0) return null;

        const monthsToPayoff = Math.ceil(totalDebtAmount / totalMonthlyPaymentAmount);
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + monthsToPayoff);
        return payoffDate;
    };

    const debtFreeDate = calculateDebtFreeDate();

    // // Months until debt-free
    const monthsUntilDebtFree =
        totalDebtAmount > 0 && totalMonthlyPaymentAmount > 0
            ? Math.ceil(totalDebtAmount / totalMonthlyPaymentAmount)
            : 0;

    // // Average interest rate
//     const averageInterestRate =
//       debts.length > 0
//         ? debts.reduce((sum, debt) => sum + (debt.interest_rate || 0), 0) /
//           debts.length
//         : 0;


    return (
        <BodyScrollView>
            {/* Income vs Outgoings Banner */}
            <FinancialOverview
                incomeUsagePercentage={incomeUsagePercentage}
                monthlyIncome={monthlyIncome}
                remainingIncome={remainingIncome}
                totalMonthlyObligations={totalMonthlyObligations} />

            {/* Quick Stats Banner */}
            {(totalDebtAmount > 0 || totalExpenseCount > 0) && (
                <QuickStats totalDebts={totalDebtAmount}
                            totalExpenseCount={totalExpenseCount}
                            totalExpenses={totalExpenseAmount}
                            totalDebtCount={totalDebtCount}
                            totalMonthlyObligations={totalMonthlyObligations}
                            totalMonthlyPayments={totalMonthlyPaymentAmount} />
            )}

            {/*{debts ? debts.length > 0 && (*/}
            {/*    <KeyInsight isDark={false}*/}
            {/*                amountPaidOff={amountPaidOff}*/}
            {/*                debtProgressPercentage={0}*/}
            {/*                debtFreeDate={debtFreeDate}*/}
            {/*                monthsUntilDebtFree={0}*/}
            {/*                remainingIncome={0}*/}
            {/*                averageInterestRate={0}*/}
            {/*                debts={[]} />*/}
            {/*) : <Text>Nothing</Text>}*/}

            <DebtCollapse debts={debts} totalDebtCount={totalDebtCount} totalDebtAmount={totalDebtAmount} />

            <ExpanseCollapse expenses={expenses} />

        </BodyScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 60
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