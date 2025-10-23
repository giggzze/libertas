import { Colors } from "@/src/constants/theme";

// Determine financial health color
export const getHealthColor = (isDark: boolean, monthlyIncome: number, incomeUsagePercentage: number) => {
    if (monthlyIncome === 0) return isDark ? Colors.dark.healthGray : Colors.light.healthGray;
    if (incomeUsagePercentage > 90) return isDark ? Colors.dark.healthRed : Colors.light.healthRed;// Red
    if (incomeUsagePercentage > 70) return isDark ? Colors.dark.healthYellow : Colors.light.healthYellow; // Orange
    return isDark ? Colors.dark.healthGreen : Colors.light.healthGreen; // Green
};