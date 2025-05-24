import { PayoffStrategy } from "@/components/debt-planner/StrategySelector";

interface Debt {
	id: string;
	name: string;
	amount: number;
	interestRate: number;
	minimumPayment: number;
}

export function calculatePayoffOrder(
	debts: Debt[],
	strategy: PayoffStrategy
): Debt[] {
	const sortedDebts = [...debts];

	switch (strategy) {
		case "snowball":
			// Sort by amount (smallest first)
			return sortedDebts.sort((a, b) => a.amount - b.amount);
		case "avalanche":
			// Sort by interest rate (highest first)
			return sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
		case "minimum":
			// No sorting needed for minimum payments
			return sortedDebts;
		default:
			return sortedDebts;
	}
}

export function calculatePayoffTime(
	debt: Debt,
	monthlyPayment: number
): number {
	if (monthlyPayment <= debt.minimumPayment) {
		return Infinity; // Will never be paid off with minimum payment
	}

	const monthlyRate = debt.interestRate / 100 / 12;
	const monthlyPaymentAmount = monthlyPayment - debt.minimumPayment;
	const remainingAmount = debt.amount;

	// Using the loan amortization formula to calculate months
	const months =
		Math.log(
			monthlyPaymentAmount /
				(monthlyPaymentAmount - remainingAmount * monthlyRate)
		) / Math.log(1 + monthlyRate);

	return Math.ceil(months);
}

export function calculateTotalInterest(
	debt: Debt,
	monthlyPayment: number
): number {
	if (monthlyPayment <= debt.minimumPayment) {
		return Infinity;
	}

	const months = calculatePayoffTime(debt, monthlyPayment);
	const totalPayment = months * monthlyPayment;
	return totalPayment - debt.amount;
}

export function calculateRecommendedPayment(
	debts: Debt[],
	strategy: PayoffStrategy,
	availablePayment: number
): { [key: string]: number } {
	const sortedDebts = calculatePayoffOrder(debts, strategy);
	const recommendedPayments: { [key: string]: number } = {};

	// Start with minimum payments for all debts
	debts.forEach(debt => {
		recommendedPayments[debt.id] = debt.minimumPayment;
	});

	// Calculate remaining payment amount
	const totalMinimumPayments = debts.reduce(
		(sum, debt) => sum + debt.minimumPayment,
		0
	);
	let remainingPayment = availablePayment - totalMinimumPayments;

	// Distribute remaining payment according to strategy
	if (strategy === "minimum") {
		return recommendedPayments;
	}

	for (const debt of sortedDebts) {
		if (remainingPayment <= 0) break;

		// Calculate how much extra we can pay on this debt
		const extraPayment = Math.min(
			remainingPayment,
			debt.amount - debt.minimumPayment
		);
		recommendedPayments[debt.id] += extraPayment;
		remainingPayment -= extraPayment;
	}

	return recommendedPayments;
}
