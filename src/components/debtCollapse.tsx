import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import {IconSymbol} from '@/src/components/ui/IconSymbol'
import { router } from "expo-router";
import { DebtList } from "@/src/components/DebtList";
import { Debt } from "@/src/types/STT";
import { useState } from "react";
import { useThemeColor } from "@/src/hooks/use-theme-color";


interface DebtCollapseProps {
    debts: Debt[],
    totalDebtCount: number,
    totalDebtAmount : number
}

export const DebtCollapse = ({ debts, totalDebtCount, totalDebtAmount}: DebtCollapseProps) => {
    const [debtsExpanded, setDebtsExpanded] = useState(false)

    const isDark = !!useColorScheme()
    const textColor = useThemeColor("text");
    const iconColor = useThemeColor("icon");
    const cardColor = useThemeColor('card')
    const tabColor = useThemeColor('healthGray')

    const handleDeleteDebt = () => {}
    function handleEditDebt() {}
    function handleShowHistory() {}
    function handleMakePayment() {}
    function handleAddCharge() {}

    return (
        <View style={styles.collapsibleSection}>
            <View style={styles.collapsibleHeaderContainer}>
              <TouchableOpacity
                style={[
                  styles.collapsibleHeader,
                  { backgroundColor: cardColor},
                ]}
                onPress={() =>
                  debts.length > 0 && setDebtsExpanded(!debtsExpanded)
                }
                activeOpacity={debts.length > 0 ? 0.7 : 1}
              >
                <View style={styles.collapsibleHeaderLeft}>
                  {debts.length > 0 && (
                    <IconSymbol
                      name={debtsExpanded ? 'chevron.down' : 'chevron.right'}
                      size={20}
                      color={iconColor}
                    />
                  )}
                  <Text style={[styles.collapsibleTitle, { color: textColor }]}>
                    Debts
                  </Text>
                  {debts.length > 0 && (
                    <View
                      style={[
                        styles.countBadge,
                        { backgroundColor: tabColor},
                      ]}
                    >
                      <Text style={[styles.countBadgeText, { color: textColor }]}>
                        {totalDebtCount}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.collapsibleHeaderRight}>
                  {debts.length > 0 && (
                    <Text
                      style={[styles.collapsibleAmount, { color: iconColor }]}
                    >
                        £{totalDebtAmount}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.addButtonInHeader,
                      { backgroundColor: isDark ? '#3b82f6' : '#3b82f6' },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push('/(index)/AddDebtModal');
                    }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol name='plus' size={16} color='#ffffff' />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>

            {debts.length > 0 ? (
              debtsExpanded && (
                <View style={styles.collapsibleContent}>
                  <DebtList
                    debts={debts}
                    onEditDebt={handleEditDebt}
                    onDeleteDebt={handleDeleteDebt}
                    onMakePayment={handleMakePayment}
                    onShowHistory={handleShowHistory}
                    onAddCharge={handleAddCharge}
                  />
                </View>
              )
            ) : (
              <View
                style={[
                  styles.emptyState,
                  { borderColor: isDark ? '#374151' : '#e5e7eb' },
                ]}
              >
                <Text style={[styles.emptyStateText, { color: iconColor }]}>
                  No debts added yet. Tap the + button above.
                </Text>
              </View>
            )}
          </View>
    )
}


const styles = StyleSheet.create({
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
})