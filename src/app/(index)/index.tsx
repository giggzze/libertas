import { BodyScrollView } from '@/src/components/ui/BodyScrollView';
import HeaderButton from '@/src/components/ui/HeaderButton';
import { appleBlue } from '@/src/constants/theme';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SummaryCard } from '@/src/components/ui/SummaryCard';
import { ExpenseList } from '@/src/components/debt-planner/ExpenseList';
import { useExpenses } from '@/src/hooks/useExpense';
import { DebtList } from '@/src/components/debt-planner/DebtList';
import { useDebts } from '@/src/hooks/queries/useDebts';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useMonthlyIncome } from '@/src/hooks/useMonthlyIncome';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { AddPaymentModal } from '@/src/components/debt-planner/AddPaymentModal';
import { DebtWithPayments } from '@/src/types/STT';
import { DatabaseService } from '@/src/services/database';

export default function HomeScreen() {
  const [debtsExpanded, setDebtsExpanded] = useState(false);
  const [expensesExpanded, setExpensesExpanded] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtWithPayments | null>(
    null,
  );

  const {
    expenses,
    deleteExpense,
    loading: expensesLoading,
    refetch,
  } = useExpenses();

  const { debts, deleteDebt, refetch: refetchDebts } = useDebts();
  const { currentIncome } = useMonthlyIncome();

  // Theme
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');

  const handleEditDebt = async (debt: DebtWithPayments) => {
    // TODO: Implement edit debt modal
    console.log('Edit debt:', debt);
  };

  const handleMakePayment = async (debt: DebtWithPayments) => {
    setSelectedDebt(debt);
    setPaymentModalVisible(true);
  };

  const handleAddPayment = async (amount: string, date: string) => {
    if (!selectedDebt) return;

    try {
      await DatabaseService.createDebtPayment({
        debt_id: selectedDebt.id,
        amount: parseFloat(amount),
        payment_date: date,
      });
      setPaymentModalVisible(false);
      setSelectedDebt(null);
      await refetchDebts();
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleAddCharge = async (debt: DebtWithPayments) => {
    // TODO: Implement add charge modal
    console.log('Add charge to debt:', debt);
  };

  const handleShowHistory = async (debt: DebtWithPayments) => {
    // TODO: Implement show history modal
    console.log('Show history for debt:', debt);
  };

  // const totalDebt = debts.reduce(
  //   (sum, debt) => sum + (debt.remaining_balance || debt.amount),
  //   0,
  // );
  const totalDebt = 10;

  // const totalMonthlyPayments = debts.reduce(
  //   (sum, debt) => sum + debt.minimum_payment,
  //   0,
  // );
  const totalMonthlyPayments = 10;

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const totalMonthlyObligations = totalMonthlyPayments + totalExpenses;

  // // Calculate additional insights
  // const totalDebts = debts.length;
  const totalDebts = 6;
  const totalExpenseCount = expenses.length;

  // Income vs Outgoings calculations
  const monthlyIncome = currentIncome?.amount || 1000;
  const remainingIncome = monthlyIncome - totalMonthlyObligations;
  const incomeUsagePercentage =
    monthlyIncome > 0 ? (totalMonthlyObligations / monthlyIncome) * 100 : 0;

  // Determine financial health color
  const getHealthColor = () => {
    if (monthlyIncome === 0) return isDark ? '#6b7280' : '#9ca3af'; // Gray
    if (incomeUsagePercentage > 90) return isDark ? '#dc2626' : '#ef4444'; // Red
    if (incomeUsagePercentage > 70) return isDark ? '#f59e0b' : '#f59e0b'; // Orange
    return isDark ? '#10b981' : '#10b981'; // Green
  };

  // Key Insights Calculations
  const originalTotalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const amountPaidOff = originalTotalDebt - totalDebt;
  const debtProgressPercentage =
    originalTotalDebt > 0 ? (amountPaidOff / originalTotalDebt) * 100 : 0;

  // Calculate projected debt-free date (simplified calculation)
  const calculateDebtFreeDate = () => {
    if (totalDebt === 0 || totalMonthlyPayments === 0) return null;

    // Simple calculation: total debt / monthly payments
    // This doesn't account for interest, but gives a rough estimate
    const monthsToPayoff = Math.ceil(totalDebt / totalMonthlyPayments);
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + monthsToPayoff);
    return payoffDate;
  };

  const debtFreeDate = calculateDebtFreeDate();

  // Months until debt-free
  const monthsUntilDebtFree =
    totalDebt > 0 && totalMonthlyPayments > 0
      ? Math.ceil(totalDebt / totalMonthlyPayments)
      : 0;

  // Average interest rate
  const averageInterestRate =
    debts.length > 0
      ? debts.reduce((sum, debt) => sum + (debt.interest_rate || 0), 0) /
        debts.length
      : 0;

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchDebts()]);
    setRefreshing(false);
  }, [refetch, refetchDebts]);

  // Refetch expenses when screen comes back into focus (e.g., after modal closes)
  // useFocusEffect(
  // 	useCallback(() => {
  // 		console.log('refetching expenses');
  // 		refetch();
  // 		refetchDebts();
  // 	}, [refetch, refetchDebts]),
  // );

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense(expenseId);
  };

  const handleDeleteDebt = async (debtId: string) => {
    await deleteDebt(debtId);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <View style={{ marginLeft: 5 }}>
              <HeaderButton
                onPress={() => router.push('/profile')}
                iconName='gear'
                color={appleBlue}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{ marginLeft: 5 }}>
              <HeaderButton
                onPress={() => router.push('/strategy')}
                iconName='chart.bar'
                color={appleBlue}
              />
            </View>
          ),
        }}
      />
      <BodyScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={appleBlue}
          />
        }
      >
        {/* Income vs Outgoings Banner */}
        {monthlyIncome > 0 && (
          <View
            style={[
              styles.incomeBanner,
              { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
            ]}
          >
            <View style={styles.incomeBannerHeader}>
              <Text style={[styles.incomeBannerTitle, { color: textColor }]}>
                Monthly Financial Health
              </Text>
              <View
                style={[
                  styles.healthIndicator,
                  { backgroundColor: getHealthColor() },
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
                  ${monthlyIncome.toFixed(2)}
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
                            ? '#f87171'
                            : '#dc2626'
                          : getHealthColor(),
                    },
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
                { backgroundColor: isDark ? '#374151' : '#e5e7eb' },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(incomeUsagePercentage, 100)}%`,
                    backgroundColor: getHealthColor(),
                  },
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
                  { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
                ]}
              >
                <Text style={[styles.summaryStatLabel, { color: iconColor }]}>
                  Total Outgoings
                </Text>
                <Text style={[styles.summaryStatAmount, { color: textColor }]}>
                  ${totalMonthlyObligations.toFixed(2)}
                </Text>
                <Text style={[styles.summaryStatSubtext, { color: iconColor }]}>
                  Monthly
                </Text>
              </View>
              <View
                style={[
                  styles.summaryStatCard,
                  { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
                ]}
              >
                <Text style={[styles.summaryStatLabel, { color: iconColor }]}>
                  Total Debt
                </Text>
                <Text style={[styles.summaryStatAmount, { color: textColor }]}>
                  ${totalDebt.toFixed(2)}
                </Text>
                <Text style={[styles.summaryStatSubtext, { color: iconColor }]}>
                  Remaining
                </Text>
              </View>
            </View>

            {/* Bottom Row - Detailed Stats */}
            <View
              style={[
                styles.quickStats,
                { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
              ]}
            >
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: textColor }]}>
                  {totalDebts}
                </Text>
                <Text style={[styles.statLabel, { color: iconColor }]}>
                  Active Debts
                </Text>
                <Text style={[styles.statAmount, { color: iconColor }]}>
                  ${totalMonthlyPayments.toFixed(2)}/mo
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: isDark ? '#374151' : '#e2e8f0' },
                ]}
              />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: textColor }]}>
                  {totalExpenseCount}
                </Text>
                <Text style={[styles.statLabel, { color: iconColor }]}>
                  Monthly Expenses
                </Text>
                <Text style={[styles.statAmount, { color: iconColor }]}>
                  ${totalExpenses.toFixed(2)}/mo
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Key Insights Section */}
        {debts.length > 0 && (
          <View style={styles.insightsContainer}>
            <Text style={[styles.insightsTitle, { color: textColor }]}>
              Progress & Insights
            </Text>
            <View style={styles.insightsGrid}>
              {/* Debt Progress */}
              {amountPaidOff > 0 && (
                <View
                  style={[
                    styles.insightCard,
                    { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <IconSymbol
                      name='chart.pie'
                      size={20}
                      color={isDark ? '#10b981' : '#10b981'}
                    />
                    <Text style={[styles.insightLabel, { color: iconColor }]}>
                      Debt Paid Off
                    </Text>
                  </View>
                  <Text style={[styles.insightValue, { color: textColor }]}>
                    ${amountPaidOff.toFixed(2)}
                  </Text>
                  <View style={styles.insightProgress}>
                    <View
                      style={[
                        styles.insightProgressBar,
                        {
                          backgroundColor: isDark ? '#374151' : '#e5e7eb',
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.insightProgressFill,
                          {
                            width: `${Math.min(debtProgressPercentage, 100)}%`,
                            backgroundColor: isDark ? '#10b981' : '#10b981',
                          },
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
              )}

              {/* Debt-Free Date */}
              {debtFreeDate && (
                <View
                  style={[
                    styles.insightCard,
                    { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <IconSymbol
                      name='calendar'
                      size={20}
                      color={isDark ? '#3b82f6' : '#3b82f6'}
                    />
                    <Text style={[styles.insightLabel, { color: iconColor }]}>
                      Debt-Free Date
                    </Text>
                  </View>
                  <Text style={[styles.insightValue, { color: textColor }]}>
                    {debtFreeDate.toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={[styles.insightSubtext, { color: iconColor }]}>
                    At current payment rate
                  </Text>
                </View>
              )}

              {/* Months Until Debt-Free */}
              {monthsUntilDebtFree > 0 && (
                <View
                  style={[
                    styles.insightCard,
                    { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <IconSymbol
                      name='timer'
                      size={20}
                      color={isDark ? '#ec4899' : '#ec4899'}
                    />
                    <Text style={[styles.insightLabel, { color: iconColor }]}>
                      Months to Freedom
                    </Text>
                  </View>
                  <Text style={[styles.insightValue, { color: textColor }]}>
                    {monthsUntilDebtFree}
                  </Text>
                  <Text style={[styles.insightSubtext, { color: iconColor }]}>
                    {monthsUntilDebtFree === 1 ? 'Month' : 'Months'} at current
                    rate
                  </Text>
                </View>
              )}

              {/* Extra Payment Potential */}
              {remainingIncome > 0 && (
                <View
                  style={[
                    styles.insightCard,
                    { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <IconSymbol
                      name='arrow.up.circle'
                      size={20}
                      color={isDark ? '#8b5cf6' : '#8b5cf6'}
                    />
                    <Text style={[styles.insightLabel, { color: iconColor }]}>
                      Payment Potential
                    </Text>
                  </View>
                  <Text style={[styles.insightValue, { color: textColor }]}>
                    ${remainingIncome.toFixed(2)}
                  </Text>
                  <Text style={[styles.insightSubtext, { color: iconColor }]}>
                    Available this month
                  </Text>
                </View>
              )}

              {/* Average Interest Rate */}
              {averageInterestRate > 0 && (
                <View
                  style={[
                    styles.insightCard,
                    { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <IconSymbol
                      name='percent'
                      size={20}
                      color={isDark ? '#f59e0b' : '#f59e0b'}
                    />
                    <Text style={[styles.insightLabel, { color: iconColor }]}>
                      Avg Interest Rate
                    </Text>
                  </View>
                  <Text style={[styles.insightValue, { color: textColor }]}>
                    {averageInterestRate.toFixed(2)}%
                  </Text>
                  <Text style={[styles.insightSubtext, { color: iconColor }]}>
                    Across {debts.length} debt{debts.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Debts Section - Collapsible */}
        <View style={styles.collapsibleSection}>
          <View style={styles.collapsibleHeaderContainer}>
            <TouchableOpacity
              style={[
                styles.collapsibleHeader,
                { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
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
                      { backgroundColor: isDark ? '#374151' : '#e5e7eb' },
                    ]}
                  >
                    <Text style={[styles.countBadgeText, { color: textColor }]}>
                      {totalDebts}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.collapsibleHeaderRight}>
                {debts.length > 0 && (
                  <Text
                    style={[styles.collapsibleAmount, { color: iconColor }]}
                  >
                    ${totalDebt.toFixed(2)}
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

        {/* Expenses Section - Collapsible */}
        <View style={styles.collapsibleSection}>
          <View style={styles.collapsibleHeaderContainer}>
            <TouchableOpacity
              style={[
                styles.collapsibleHeader,
                { backgroundColor: isDark ? '#1f2937' : '#f8fafc' },
              ]}
              onPress={() =>
                expenses.length > 0 && setExpensesExpanded(!expensesExpanded)
              }
              activeOpacity={expenses.length > 0 ? 0.7 : 1}
            >
              <View style={styles.collapsibleHeaderLeft}>
                {expenses.length > 0 && (
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
                      { backgroundColor: isDark ? '#374151' : '#e5e7eb' },
                    ]}
                  >
                    <Text style={[styles.countBadgeText, { color: textColor }]}>
                      {totalExpenseCount}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.collapsibleHeaderRight}>
                {expenses.length > 0 && (
                  <Text
                    style={[styles.collapsibleAmount, { color: iconColor }]}
                  >
                    ${totalExpenses.toFixed(2)}/mo
                  </Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.addButtonInHeader,
                    { backgroundColor: isDark ? '#10b981' : '#10b981' },
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
                { borderColor: isDark ? '#374151' : '#e5e7eb' },
              ]}
            >
              <Text style={[styles.emptyStateText, { color: iconColor }]}>
                No expenses added yet. Tap the + button above.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom padding for better scroll */}
        <View style={{ height: 40 }} />
      </BodyScrollView>

      {/* Payment Modal */}
      <AddPaymentModal
        visible={paymentModalVisible}
        onClose={() => {
          setPaymentModalVisible(false);
          setSelectedDebt(null);
        }}
        onAdd={handleAddPayment}
        debt={selectedDebt}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
  },
  incomeBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  incomeBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  incomeBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  healthIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  healthIndicatorText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  incomeComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  incomeComparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  incomeComparisonDivider: {
    paddingHorizontal: 8,
  },
  minusSign: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.6,
  },
  equalsSign: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.6,
  },
  incomeLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
    marginBottom: 6,
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickStatsContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
    marginBottom: 8,
  },
  summaryStatAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryStatSubtext: {
    fontSize: 11,
    opacity: 0.6,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 60,
    marginHorizontal: 16,
  },
  insightsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    opacity: 0.7,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  insightSubtext: {
    fontSize: 11,
    opacity: 0.6,
  },
  insightProgress: {
    marginTop: 8,
  },
  insightProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  insightProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightProgressText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  section: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 12,
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summarySubtitle: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
});
