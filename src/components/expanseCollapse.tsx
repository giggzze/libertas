import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import {IconSymbol} from '@/src/components/ui/IconSymbol'
import { router } from "expo-router";
import { ExpenseList } from "@/src/components/ExpenseList";
import { useState } from "react";
import { Expense} from "@/src/types/STT";
import { useThemeColor } from "@/src/hooks/use-theme-color";


export const ExpanseCollapse = ( {expenses }: {expenses : Expense[] }) => {
  const [expensesExpanded, setExpensesExpanded] = useState(false)
  console.log(expenses, "From component")
    let isDark = !useColorScheme();

    const iconColor = useThemeColor('icon')
    const textColor = useThemeColor('text')
    const cardColor = useThemeColor('card')
  const healthGreen = useThemeColor('healthGreen')
  const healthGray = useThemeColor('healthGray')
  
    let totalExpenses = expenses.length

  let totalExpenseCount = expenses.reduce((acc, curr )  => acc + curr.amount, 0)

  function handleDeleteExpense() {

  }

  let expensesLoading;
  return (
//            Expenses Section - Collapsible
                <View style={styles.collapsibleSection}>
                  <View style={styles.collapsibleHeaderContainer}>
                    <TouchableOpacity
                      style={[
                        styles.collapsibleHeader,
                        { backgroundColor: cardColor },
                      ]}
                      onPress={() =>
                        expenses?.length > 0 && setExpensesExpanded(!expensesExpanded)
                      }
                      activeOpacity={expenses.length > 0 ? 0.7 : 1}
                    >
                      <View style={styles.collapsibleHeaderLeft}>
                        {expenses?.length > 0 && (
                          <IconSymbol
                            name={expensesExpanded ? 'chevron.down' : 'chevron.right'}
                            size={20}
                            color={iconColor}
                          />
                        )}
                        <Text style={[styles.collapsibleTitle, { color: textColor }]}>
                          Expenses
                        </Text>
                        {expenses.length > 0 && (
                          <View
                            style={[
                              styles.countBadge,
                              { backgroundColor:  healthGray},
                            ]}
                          >
                            <Text style={[styles.countBadgeText, { color: textColor }]}>
                              {totalExpenses}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.collapsibleHeaderRight}>
                        {expenses.length > 0 && (
                          <Text
                            style={[styles.collapsibleAmount, { color: iconColor }]}
                          >
                            ${totalExpenseCount}/mo
                          </Text>
                        )}
                        <TouchableOpacity
                          style={[
                            styles.addButtonInHeader,
                            { backgroundColor: healthGreen },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push('/(index)/AddExpenseModal');
                          }}
                          activeOpacity={0.7}
                        >
                          <IconSymbol name='plus' size={16} color='#ffffff' />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {expenses.length > 0 ? (
                    expensesExpanded && (
                      <View style={styles.collapsibleContent}>
                        <ExpenseList
                          expenses={expenses}
                          onDeleteExpense={handleDeleteExpense}
                          loading={expensesLoading}
                        />
                      </View>
                    )
                  ) : (
                    <View
                      style={[
                        styles.emptyState,
                        { borderColor: iconColor},
                      ]}
                    >
                      <Text style={[styles.emptyStateText, { color: iconColor }]}>
                        No expenses added yet. Tap the + button above.
                      </Text>
                    </View>
                  )}
                </View>
    )
}


const styles = StyleSheet.create({
    collapsibleSection: {
        marginHorizontal: 16,
        marginBottom: 16,
      },
      collapsibleHeaderContainer: {
        marginBottom: 12,
      },
      collapsibleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      },
      collapsibleHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
      },
      collapsibleHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      collapsibleTitle: {
        fontSize: 17,
        fontWeight: '700',
      },
      countBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        minWidth: 26,
        alignItems: 'center',
        justifyContent: 'center',
      },
      countBadgeText: {
        fontSize: 12,
        fontWeight: '700',
      },
      collapsibleAmount: {
        fontSize: 15,
        fontWeight: '600',
        opacity: 0.75,
      },
      addButtonInHeader: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      collapsibleContent: {
        marginTop: 12,
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
})