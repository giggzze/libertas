// Example of how to update your HomeScreen component to use React Query hooks

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
import { DebtList } from '@/src/components/debt-planner/DebtList';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { AddPaymentModal } from '@/src/components/debt-planner/AddPaymentModal';
import { DebtWithPayments } from '@/src/types/STT';

// Import the new React Query hooks
import {
  useDebts,
  useExpenses,
  useCurrentIncome,
  useDeleteDebt,
  useDeleteExpense,
  useCreateDebtPayment,
} from '@/src/hooks';

export default function HomeScreen() {
  const [debtsExpanded, setDebtsExpanded] = useState(false);
  const [expensesExpanded, setExpensesExpanded] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtWithPayments | null>(
    null,
  );

  // React Query hooks - much cleaner!
  const {
    data: expenses = [],
    isLoading: expensesLoading,
    refetch: refetchExpenses,
  } = useExpenses();

  const {
    data: debts = [],
    isLoading: debtsLoading,
    refetch: refetchDebts,
  } = useDebts();

  const { data: currentIncome, isLoading: incomeLoading } = useCurrentIncome();

  // Mutation hooks
  const deleteDebtMutation = useDeleteDebt();
  const deleteExpenseMutation = useDeleteExpense();
  const createPaymentMutation = useCreateDebtPayment();

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
      await createPaymentMutation.mutateAsync({
        debt_id: selectedDebt.id,
        amount: parseFloat(amount),
        payment_date: date,
      });
      setPaymentModalVisible(false);
      setSelectedDebt(null);
      // No need to manually refetch - React Query handles this automatically!
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

  const handleDeleteDebt = async (debtId: string) => {
    try {
      await deleteDebtMutation.mutateAsync(debtId);
      // React Query automatically updates the cache!
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpenseMutation.mutateAsync(expenseId);
      // React Query automatically updates the cache!
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const totalDebt = debts.reduce(
    (sum, debt) => sum + (debt.remaining_balance || debt.amount),
    0,
  );
  const totalMonthlyPayments = debts.reduce(
    (sum, debt) => sum + debt.minimum_payment,
    0,
  );
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // React Query's refetch is much simpler
      await Promise.all([refetchExpenses(), refetchDebts()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchExpenses, refetchDebts]);

  // Focus effect for refreshing data
  useFocusEffect(
    useCallback(() => {
      // React Query handles background updates automatically
      // This is optional - you might not need manual refetching
      refetchExpenses();
      refetchDebts();
    }, [refetchExpenses, refetchDebts]),
  );

  const isLoading = expensesLoading || debtsLoading || incomeLoading;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.loadingText, { color: textColor }]}>
          Loading your financial data...
        </Text>
      </View>
    );
  }

  return (
    <BodyScrollView
      style={[styles.container, { backgroundColor }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Rest of your component JSX remains the same */}
      <SummaryCard
        totalDebt={totalDebt}
        totalMonthlyPayments={totalMonthlyPayments}
        income={currentIncome?.amount || 0}
        totalExpenses={totalExpenses}
      />

      <DebtList
        debts={debts}
        onEditDebt={handleEditDebt}
        onDeleteDebt={handleDeleteDebt}
        onMakePayment={handleMakePayment}
        onShowHistory={handleShowHistory}
        onAddCharge={handleAddCharge}
      />

      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />

      <AddPaymentModal
        visible={paymentModalVisible}
        debt={selectedDebt}
        onClose={() => setPaymentModalVisible(false)}
        onAddPayment={handleAddPayment}
      />
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
