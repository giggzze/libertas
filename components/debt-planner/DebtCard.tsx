import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DebtWithPayments } from '@/types/STT';
import { formatCurrency } from '@/utils/formatCurrency';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface DebtCardProps {
	debt: DebtWithPayments;
	onEdit: (debt: DebtWithPayments) => void;
	onDelete: (debtId: string) => void;
	onMakePayment: (debt: DebtWithPayments) => void;
	onShowHistory: (debt: DebtWithPayments) => void;
	onAddCharge: (debt: DebtWithPayments) => void;
}

export function DebtCard({ debt, onDelete}: DebtCardProps) {
	// Calculate the current balance (remaining amount or original amount if no payments)
	const currentBalance = debt.remaining_balance || debt.amount;
	const totalPaid = debt.total_paid || 0;

	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, 'background');
	const textColor = useThemeColor({}, 'text');
	const iconColor = useThemeColor({}, 'icon');
	const isDark = colorScheme === 'dark';

	const handleDelete = () => {
		Alert.alert('Remove Debt', `Are you sure you want to delete ${debt.name}?`, [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => onDelete(debt.id),
			},
		]);
	};

	const renderRightActions = () => (
		<View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
			{/*<TouchableOpacity
				style={[styles.actionButton, styles.editButton, { backgroundColor: tintColor, height: '90%', justifyContent: 'center', marginBottom: 10 }]}
				onPress={() => onEdit(debt)}
			>
				<IconSymbol name="pencil" size={16} color={isDark ? '#000' : '#fff'} />
				<Text style={[styles.actionButtonText, { color: isDark ? '#000' : '#fff' }]}>Edit</Text>
			</TouchableOpacity>*/}
			<TouchableOpacity
				style={[styles.actionButton, styles.deleteButton, { marginLeft: 2, height: '90%', justifyContent: 'center', marginBottom: 10 }]}
				onPress={() => handleDelete()}
			>
				<IconSymbol name="trash" size={16} color={isDark ? '#000' : '#fff'} />
				<Text style={[styles.actionButtonText, { color: isDark ? '#000' : '#fff' }]}>Delete</Text>
			</TouchableOpacity>
			{/*<TouchableOpacity
				style={[styles.actionButton, { backgroundColor: '#A0AEC0', marginLeft: 2, height: '90%', justifyContent: 'center', marginBottom: 10 }]}
				onPress={() => onShowHistory(debt)}
			>
				<IconSymbol name="clock" size={16} color={isDark ? '#000' : '#fff'} />
				<Text style={[styles.actionButtonText, { color: isDark ? '#000' : '#fff' }]}>History</Text>
			</TouchableOpacity>*/}
		</View>
	);

	return (
		<Swipeable renderRightActions={renderRightActions}>
			<View style={[styles.debtCard, { backgroundColor, borderColor: isDark ? '#4a5568' : '#ddd' }]}>
				<View style={styles.debtHeader}>
					<Text style={[styles.debtName, { color: textColor }]}>{debt.name}</Text>
					<Text style={[styles.debtAmount, { color: isDark ? '#81e6d9' : '#2c5282' }]}>{formatCurrency(currentBalance)}</Text>
				</View>
				<View style={styles.debtDetails}>
					<View style={styles.detailColumn}>
						<Text style={[styles.debtDetail, { color: iconColor }]}>Interest Rate: {debt.interest_rate}%</Text>
						<Text style={[styles.debtDetail, { color: iconColor }]}>Minimum Payment: {formatCurrency(debt.minimum_payment)}</Text>
					</View>
					{totalPaid > 0 && (
						<View style={styles.detailColumn}>
							<Text style={[styles.debtDetail, { color: iconColor }]}>Original: {formatCurrency(debt.amount)}</Text>
							<Text style={[styles.debtDetail, styles.paidAmount, { color: isDark ? '#68d391' : '#28a745' }]}>
								Paid: {formatCurrency(totalPaid)}
							</Text>
						</View>
					)}
				</View>
				{/*<View style={styles.actionButtons}>
					<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4FD1C5' }]} onPress={() => onMakePayment(debt)}>
						<IconSymbol name="creditcard" size={16} color={isDark ? '#000' : '#fff'} />
						<Text style={[styles.actionButtonText, { color: isDark ? '#000' : '#fff' }]}>Pay</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFA500', marginLeft: 8 }]} onPress={() => onAddCharge(debt)}>
						<IconSymbol name="plus" size={16} color={isDark ? '#000' : '#fff'} />
						<Text style={[styles.actionButtonText, { color: isDark ? '#000' : '#fff' }]}>Add Charge</Text>
					</TouchableOpacity>
				</View>*/}
			</View>
		</Swipeable>
	);
}

const styles = StyleSheet.create({
	debtCard: {
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
	},
	debtHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	debtName: {
		fontSize: 18,
		fontWeight: '600',
	},
	debtAmount: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	debtDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	detailColumn: {
		flex: 1,
	},
	debtDetail: {
		fontSize: 14,
		marginBottom: 2,
	},
	paidAmount: {
		fontWeight: '600',
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		gap: 4,
	},
	editButton: {},
	deleteButton: {
		backgroundColor: '#FF3B30',
	},
	actionButtonText: {
		fontWeight: '600',
		fontSize: 14,
	},
});
