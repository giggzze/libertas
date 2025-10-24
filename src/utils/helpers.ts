import { Colors } from "@/src/constants/theme";
import { Debt, Expense } from "@/src/types/STT";

// Determine financial health color
export const getHealthColor = (isDark: boolean, monthlyIncome: number, incomeUsagePercentage: number) => {
    if (monthlyIncome === 0) return isDark ? Colors.dark.healthGray : Colors.light.healthGray;
    if (incomeUsagePercentage > 90) return isDark ? Colors.dark.healthRed : Colors.light.healthRed;// Red
    if (incomeUsagePercentage > 70) return isDark ? Colors.dark.healthYellow : Colors.light.healthYellow; // Orange
    return isDark ? Colors.dark.healthGreen : Colors.light.healthGreen; // Green
};

export const calculateTotalDebt = (debts: Debt[]) : number =>  {
    console.log("Calculating total debt for debts:", debts);
    if (!debts || debts?.length === 0 ) return 0;
    console.log("this should not run if the value is 0 or undefined: ", debts?.length)
    console.log("debts type:", typeof debts, "value:", debts);
    return debts.reduce((sum, debt) => sum + debt.amount, 0.0)
}

export const calculateTotalMonthlyPayment = (debts: Debt[]) => {
    if (!debts || debts?.length === 0 ) return 0;
    return debts.reduce(
        (sum, debt) => sum + debt.minimum_payment, 0.0);
}

export const calculateTotalExpense = (expenses: Expense[]) => {
    if (expenses?.length === 0 || expenses === undefined) return 0;
    return expenses.reduce(
    (sum, expense) => sum + expense.amount, 0.0);
}