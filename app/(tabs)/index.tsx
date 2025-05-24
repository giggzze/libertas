import { AddDebtModal } from "@/components/debt-planner/AddDebtModal";
import { DebtList } from "@/components/debt-planner/DebtList";
import { EditDebtModal } from "@/components/debt-planner/EditDebtModal";
import { IncomeInput } from "@/components/debt-planner/IncomeInput";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Mock data for initial development
const mockDebts = [
	{
		id: "1",
		name: "Credit Card",
		amount: 5000,
		interestRate: 19.99,
		minimumPayment: 100,
	},
	{
		id: "2",
		name: "Student Loan",
		amount: 25000,
		interestRate: 5.5,
		minimumPayment: 300,
	},
	{
		id: "3",
		name: "Car Loan",
		amount: 15000,
		interestRate: 4.5,
		minimumPayment: 350,
	},
];

export default function HomeScreen() {
	const [income, setIncome] = useState("");
	const [debts, setDebts] = useState(mockDebts);
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [selectedDebt, setSelectedDebt] = useState<
		(typeof mockDebts)[0] | null
	>(null);
	const [newDebt, setNewDebt] = useState({
		name: "",
		amount: "",
		interestRate: "",
		minimumPayment: "",
	});

	const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
	const totalMonthlyPayments = debts.reduce(
		(sum, debt) => sum + debt.minimumPayment,
		0
	);

	const handleAddDebt = (debt: typeof newDebt) => {
		const newDebtWithId = {
			id: Date.now().toString(),
			name: debt.name,
			amount: Number(debt.amount),
			interestRate: Number(debt.interestRate),
			minimumPayment: Number(debt.minimumPayment),
		};

		setDebts([...debts, newDebtWithId]);
		setNewDebt({
			name: "",
			amount: "",
			interestRate: "",
			minimumPayment: "",
		});
		setIsAddModalVisible(false);
	};

	const handleEditDebt = (debt: (typeof mockDebts)[0]) => {
		setSelectedDebt(debt);
		setIsEditModalVisible(true);
	};

	const handleSaveEdit = (editedDebt: (typeof mockDebts)[0]) => {
		setDebts(
			debts.map(debt => (debt.id === editedDebt.id ? editedDebt : debt))
		);
		setIsEditModalVisible(false);
		setSelectedDebt(null);
	};

	const handleDeleteDebt = (id: string) => {
		setDebts(debts.filter(debt => debt.id !== id));
	};

	return (
		<ScrollView
			contentContainerStyle={styles.scrollViewContent}
			showsVerticalScrollIndicator={false}>
			<View style={styles.summaryCard}>
				<Text style={styles.summaryTitle}>Summary</Text>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Total Debt:</Text>
					<Text style={styles.summaryValue}>
						${totalDebt.toLocaleString()}
					</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Monthly Payments:</Text>
					<Text style={styles.summaryValue}>
						${totalMonthlyPayments.toLocaleString()}
					</Text>
				</View>
				{income && (
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Monthly Income:</Text>
						<Text style={styles.summaryValue}>
							${Number(income).toLocaleString()}
						</Text>
					</View>
				)}
			</View>
			<View style={styles.sectionSpacing}>
				<IncomeInput
					income={income}
					onIncomeChange={setIncome}
				/>
			</View>
			<View style={styles.sectionSpacing}>
				<DebtList
					debts={debts}
					onAddDebt={() => setIsAddModalVisible(true)}
					onEditDebt={handleEditDebt}
					onDeleteDebt={handleDeleteDebt}
				/>
			</View>
			<AddDebtModal
				visible={isAddModalVisible}
				onClose={() => setIsAddModalVisible(false)}
				onAdd={handleAddDebt}
				newDebt={newDebt}
				onNewDebtChange={setNewDebt}
			/>
			<EditDebtModal
				visible={isEditModalVisible}
				onClose={() => {
					setIsEditModalVisible(false);
					setSelectedDebt(null);
				}}
				onSave={handleSaveEdit}
				debt={selectedDebt}
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollViewContent: {
		padding: 16,
		paddingBottom: 32,
		flexGrow: 1,
	},
	summaryCard: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		marginTop: 0,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	summaryTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	summaryLabel: {
		fontSize: 16,
		color: "#666",
	},
	summaryValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	sectionSpacing: {
		marginBottom: 24,
	},
});
