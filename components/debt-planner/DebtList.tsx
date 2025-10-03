import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DebtCategory, DebtInsert, DebtWithPayments } from '@/types/STT';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DebtCard } from './DebtCard';
import { useDebts } from '@/hooks/useDebt';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';

interface DebtListProps {
	debts: DebtWithPayments[];
	onEditDebt: (debt: DebtWithPayments) => void;
	onDeleteDebt: (id: string) => void;
	onMakePayment: (debt: DebtWithPayments) => void;
	onShowHistory: (debt: DebtWithPayments) => void;
	onAddCharge: (debt: DebtWithPayments) => void;
}

export function DebtList({ debts, onEditDebt, onDeleteDebt, onMakePayment, onShowHistory, onAddCharge }: DebtListProps) {
	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, 'background');
	const textColor = useThemeColor({}, 'text');
	const tintColor = useThemeColor({}, 'tint');
	const iconColor = useThemeColor({}, 'icon');
	const isDark = colorScheme === 'dark';

	const [newDebt, setNewDebt] = useState({
		name: '',
		amount: '',
		interest_rate: '',
		minimum_payment: '',
		term_in_months: '60', // Default to 5 years
		category: 'OTHER' as DebtCategory,
	});

	const {  createDebt, updateDebt, deleteDebt, loading: debtsLoading } = useDebts();
	const {user } = useUser();


	const handleAddDebt = async () => {
		// const debtData: DebtInsert = {
		// 	name: newDebt.name,
		// 	amount: Number(newDebt.amount),
		// 	interest_rate: Number(newDebt.interest_rate),
		// 	minimum_payment: Number(newDebt.minimum_payment),
		// 	start_date: new Date().toISOString().split('T')[0],
		// 	term_in_months: Number(newDebt.term_in_months),
		// 	category: newDebt.category,
		// 	is_paid: false,
		// 	user_id: user!.id,
		// };
		//
		// const success = await createDebt(debtData);
		// if (success) {
		// 	setNewDebt({
		// 		name: '',
		// 		amount: '',
		// 		interest_rate: '',
		// 		minimum_payment: '',
		// 		term_in_months: '60',
		// 		category: 'OTHER' as DebtCategory,
		// 	});
		// }

		router.push('/(tabs)/AddDebtModal')

	};


	return (
		<View style={styles.section}>
			<View style={styles.sectionHeader}>
				<Text style={[styles.sectionTitle, { color: textColor }]}>Debts</Text>
				<TouchableOpacity style={[styles.addButton, { backgroundColor: tintColor }]} onPress={handleAddDebt}>
					<Text style={[styles.addButtonText, { color: isDark ? '#000' : '#fff' }]}>Add Debt</Text>
				</TouchableOpacity>
			</View>
			{debts.length === 0 ? (
				<View style={[styles.emptyState, { borderColor: isDark ? '#4a5568' : '#e2e8f0' }]}>
					<Text style={{ color: iconColor, textAlign: 'center' }}>You haven't added any debts yet. Add your first debt to start tracking.</Text>
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
