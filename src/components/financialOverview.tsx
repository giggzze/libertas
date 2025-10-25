import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { MonthlyIncome } from "@/src/types/STT";
import { ProgressBar } from "@/src/components/progressBar";
import { getHealthColor } from "@/src/utils/helpers";

interface NameeProps {
    monthlyIncome: MonthlyIncome,
    incomeUsagePercentage: number,
    totalMonthlyObligations: number,
    remainingIncome: number
}

export const FinancialOverview = ({
                                      monthlyIncome, incomeUsagePercentage, totalMonthlyObligations,
                                      remainingIncome
                                  }: NameeProps) => {
    const backgroundColor = useThemeColor("background");
    const textColor = useThemeColor("text");
    const iconColor = useThemeColor("icon");
    const isDark = !!useColorScheme();
    const healthColor = monthlyIncome && getHealthColor(isDark, monthlyIncome.amount, incomeUsagePercentage);
    const cardColor = useThemeColor('card');

    return (
        <>
            {monthlyIncome ? (
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
                                £{monthlyIncome.amount ? monthlyIncome.amount.toFixed(2) : 0}
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
                                £{totalMonthlyObligations ? totalMonthlyObligations.toFixed(2) : 0}
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
                                                : healthColor
                                    }
                                ]}
                            >
                                £{remainingIncome.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <ProgressBar healthColor={healthColor} incomeUsagePercentage={incomeUsagePercentage} />

                </View>
            ) : <View
                style={[
                    styles.emptyState,
                    { borderColor: iconColor, margin: 20},
                ]}
            >
                <Text style={[styles.emptyStateText, { color: iconColor }]}>
                    You&#39;re income is required to display insight information
                </Text>
            </View>}
        </>
    );
};

const styles = StyleSheet.create({
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
    emptyState: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 12,
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.7,
    },
});