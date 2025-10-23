import { View, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { Debt } from "@/src/types/STT";
import { DebtProgress } from "@/src/components/debtProgress";


interface KeyInsightProps {
  isDark : boolean,
  amountPaidOff : number,
  debtProgressPercentage : number,
  debtFreeDate : Date,
  monthsUntilDebtFree : number,
  remainingIncome : number,
  averageInterestRate : number,
  debts: Debt[]
}
export const KeyInsight  = ({isDark, amountPaidOff, debtProgressPercentage,
    debtFreeDate, monthsUntilDebtFree, remainingIncome, averageInterestRate, debts } : KeyInsightProps) => {

  const textColor = useThemeColor('text')
  const iconColor = useThemeColor('icon')


    return (
        <View style={styles.insightsContainer}>
             <Text style={[styles.insightsTitle, { color: textColor }]}>
               Progress & Insights
             </Text>
             <View style={styles.insightsGrid}>
               {/* Debt Progress */}
               {amountPaidOff > 0 && (
                 <DebtProgress amountPaidOff={amountPaidOff} debtProgressPercentage={debtProgressPercentage} />
               )}

               {/* Debt-Free Date */}
               {/*{debtFreeDate && (*/}
               {/*  <DebtFreeDate />*/}
               {/*)}*/}

               {/*{/* Months Until Debt-Free */}
               {/*{monthsUntilDebtFree > 0 && (*/}
               {/*  <View*/}
               {/*    style={[*/}
               {/*      styles.insightCard,*/}
               {/*      { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },*/}
               {/*    ]}*/}
               {/*  >*/}
               {/*    <View style={styles.insightHeader}>*/}
               {/*      <IconSymbol*/}
               {/*        name='timer'*/}
               {/*        size={20}*/}
               {/*        color={isDark ? '#ec4899' : '#ec4899'}*/}
               {/*      />*/}
               {/*      <Text style={[styles.insightLabel, { color: iconColor }]}>*/}
               {/*        Months to Freedom*/}
               {/*      </Text>*/}
               {/*    </View>*/}
               {/*    <Text style={[styles.insightValue, { color: textColor }]}>*/}
               {/*      {monthsUntilDebtFree}*/}
               {/*    </Text>*/}
               {/*    <Text style={[styles.insightSubtext, { color: iconColor }]}>*/}
               {/*      {monthsUntilDebtFree === 1 ? 'Month' : 'Months'} at current*/}
               {/*      rate*/}
               {/*    </Text>*/}
               {/*  </View>*/}
               {/*)}*/}

               {/*/!* Extra Payment Potential *!/*/}
               {/*{remainingIncome > 0 && (*/}
               {/*  <View*/}
               {/*    style={[*/}
               {/*      styles.insightCard,*/}
               {/*      { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },*/}
               {/*    ]}*/}
               {/*  >*/}
               {/*    <View style={styles.insightHeader}>*/}
               {/*      <IconSymbol*/}
               {/*        name='arrow.up.circle'*/}
               {/*        size={20}*/}
               {/*        color={isDark ? '#8b5cf6' : '#8b5cf6'}*/}
               {/*      />*/}
               {/*      <Text style={[styles.insightLabel, { color: iconColor }]}>*/}
               {/*        Payment Potential*/}
               {/*      </Text>*/}
               {/*    </View>*/}
               {/*    <Text style={[styles.insightValue, { color: textColor }]}>*/}
               {/*      ${remainingIncome.toFixed(2)}*/}
               {/*    </Text>*/}
               {/*    <Text style={[styles.insightSubtext, { color: iconColor }]}>*/}
               {/*      Available this month*/}
               {/*    </Text>*/}
               {/*  </View>*/}
               {/*)}*/}

               {/*/!* Average Interest Rate *!/*/}
               {/*{averageInterestRate > 0 && (*/}
               {/*  <View*/}
               {/*    style={[*/}
               {/*      styles.insightCard,*/}
               {/*      { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },*/}
               {/*    ]}*/}
               {/*  >*/}
               {/*    <View style={styles.insightHeader}>*/}
               {/*      <IconSymbol*/}
               {/*        name='percent'*/}
               {/*        size={20}*/}
               {/*        color={isDark ? '#f59e0b' : '#f59e0b'}*/}
               {/*      />*/}
               {/*      <Text style={[styles.insightLabel, { color: iconColor }]}>*/}
               {/*        Avg Interest Rate*/}
               {/*      </Text>*/}
               {/*    </View>*/}
               {/*    <Text style={[styles.insightValue, { color: textColor }]}>*/}
               {/*      {averageInterestRate.toFixed(2)}%*/}
               {/*    </Text>*/}
               {/*    <Text style={[styles.insightSubtext, { color: iconColor }]}>*/}
               {/*      Across {debts.length} debt{debts.length > 1 ? 's' : ''}*/}
               {/*    </Text>*/}
               {/*  </View>*/}
               {/*)}*/}
             </View>
           </View>
    )
}


const styles = StyleSheet.create({
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
})