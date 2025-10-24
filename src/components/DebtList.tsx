import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Debt, DebtWithPayments } from "@/src/types/STT";
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { DebtCard } from './DebtCard';
import { router } from 'expo-router';

interface DebtListProps {
  debts: Debt[];
  onEditDebt: (debt: DebtWithPayments) => void;
  onDeleteDebt: (id: string) => void;
  onMakePayment: (debt: DebtWithPayments) => void;
  onShowHistory: (debt: DebtWithPayments) => void;
  onAddCharge: (debt: DebtWithPayments) => void;
}

export function DebtList({
  debts,
  onEditDebt,
  onDeleteDebt,
  onMakePayment,
  onShowHistory,
  onAddCharge,
}: DebtListProps) {
  // Theme hooks
  const colorScheme = useColorScheme()
  const textColor = useThemeColor('text');
  const iconColor = useThemeColor('icon');
  const isDark = colorScheme === 'dark';

  const handleAddDebt = async () => {
    router.push('/(tabs)/AddDebtModal');
  };

  return (
    <View style={styles.section}>
      {debts.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            { borderColor: isDark ? '#4a5568' : '#e2e8f0' },
          ]}
        >
          <Text style={{ color: iconColor, textAlign: 'center' }}>
            You haven&#39;t added any debts yet. Add your first debt to start
            tracking.
          </Text>
        </View>
      ) : (
        debts.map((debt) => (
          <DebtCard
            key={debt.id}
            debt={debt}
            onEdit={onEditDebt}
            onDelete={onDeleteDebt}
            onMakePayment={onMakePayment}
            onShowHistory={onShowHistory}
            onAddCharge={onAddCharge}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
});
