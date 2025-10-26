import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { useThemeColor } from "@/src/hooks/use-theme-color";

interface DebtProgressProps {
    amountPaidOff: number,
    debtProgressPercentage: number
}

export const DebtProgress = ({ amountPaidOff, debtProgressPercentage }: DebtProgressProps) => {
    const cardBackgroundColor = useThemeColor("card");
    const headerTitleColor = useThemeColor("healthGreen");
    const textColor = useThemeColor("text");
    const iconColor = useThemeColor("icon");

    return (
        <View
            style={[
                styles.insightCard,
                { backgroundColor: cardBackgroundColor }
            ]}
        >
            <View style={styles.insightHeader}>
                <IconSymbol
                    name="chart.pie"
                    size={20}
                    color={headerTitleColor}
                />
                <Text style={[styles.insightLabel, { color: iconColor }]}>
                    Debt Paid Off
                </Text>
            </View>
            <Text style={[styles.insightValue, { color: textColor }]}>
                £{amountPaidOff.toFixed(2)}
            </Text>
            <View style={styles.insightProgress}>
                <View
                    style={[
                        styles.insightProgressBar,
                        {
                            backgroundColor: cardBackgroundColor
                        }
                    ]}
                >
                    <View
                        style={[
                            styles.insightProgressFill,
                            {
                                width: `${Math.min(debtProgressPercentage, 100)}%`,
                                backgroundColor: headerTitleColor
                            }
                        ]}
                    />
                </View>
                <Text
                    style={[styles.insightProgressText, { color: iconColor }]}
                >
                    {debtProgressPercentage.toFixed(1)}%
                </Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
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
    }
});
