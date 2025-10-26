import { Debt, DebtWithPayments, PayoffStrategy } from "@/src/types/STT";

/**
 * Determines the order in which debts should be paid off based on the selected strategy.
 *
 * @param debts - Array of debts to be ordered
 * @param strategy - The payoff strategy to use:
 *   - "snowball": Orders debts from smallest to largest balance (debt snowball method)
 *   - "avalanche": Orders debts from highest to lowest interest rate (debt avalanche method)
 *   - "minimum": Maintains original order for minimum payments only
 * @returns Array of debts sorted according to the selected strategy
 */
export function calculatePayoffOrder(
	debts: (Debt | DebtWithPayments)[],
	strategy: PayoffStrategy
): (Debt | DebtWithPayments)[] {
	const sortedDebts = [...debts];

	switch (strategy) {
		case "snowball":
			// Sort by remaining balance (smallest first), then by interest rate for ties
			return sortedDebts.sort((a, b) => {
				const balanceA =
					"remaining_balance" in a
						? a.remaining_balance ?? a.amount
						: a.amount;
				const balanceB =
					"remaining_balance" in b
						? b.remaining_balance ?? b.amount
						: b.amount;
				if (balanceA === balanceB) {
					return b.interest_rate - a.interest_rate; // Higher interest first for ties
				}
				return balanceA - balanceB;
			});
		case "avalanche":
			// Sort by interest rate (highest first), then by remaining balance for ties
			return sortedDebts.sort((a, b) => {
				if (a.interest_rate === b.interest_rate) {
					const balanceA =
						"remaining_balance" in a
							? a.remaining_balance ?? a.amount
							: a.amount;
					const balanceB =
						"remaining_balance" in b
							? b.remaining_balance ?? b.amount
							: b.amount;
					return balanceA - balanceB; // Smaller balance first for ties
				}
				return b.interest_rate - a.interest_rate;
			});
		case "minimum":
			// No sorting needed for minimum payments
			return sortedDebts;
		default:
			return sortedDebts;
	}
}

/**
 * Calculates the number of months needed to pay off a debt given a monthly payment amount.
 * Uses loan amortization formula to determine payoff time, accounting for interest and minimum payments.
 *
 * @param debt - The debt to calculate payoff time for
 * @param monthlyPayment - The total monthly payment amount (including minimum payment)
 * @returns The number of months needed to pay off the debt, or Infinity if it cannot be paid off
 */
export function calculatePayoffTime(
	debt: Debt | DebtWithPayments,
	monthlyPayment: number
): number {
	// Validate inputs
	if (monthlyPayment <= 0 || debt.interest_rate < 0) {
		console.log("Invalid inputs", {
			monthlyPayment,
			interestRate: debt.interest_rate,
		});
		return Infinity;
	}

	const monthlyRate = debt.interest_rate / 100 / 12;
	const remainingAmount =
		"remaining_balance" in debt
			? debt.remaining_balance ?? debt.amount
			: debt.amount;

	// If payment is less than or equal to minimum payment, calculate months with minimum payment
	if (monthlyPayment <= debt.minimum_payment) {
		console.log("Using minimum payment", {
			monthlyPayment,
			minimumPayment: debt.minimum_payment,
		});

		// Handle 0% interest rate case with minimum payment
		if (debt.interest_rate === 0) {
			return Math.ceil(remainingAmount / debt.minimum_payment);
		}

		// Check if minimum payment covers interest
		const monthlyInterest = remainingAmount * monthlyRate;
		if (debt.minimum_payment <= monthlyInterest) {
			return Infinity; // Will never be paid off as minimum payment only covers interest
		}

		// Calculate months with minimum payment
		const months =
			-Math.log(
				1 - (remainingAmount * monthlyRate) / debt.minimum_payment
			) / Math.log(1 + monthlyRate);

		return Math.ceil(months);
	}

	const monthlyPaymentAmount = monthlyPayment - debt.minimum_payment;

	// Handle 0% interest rate case with extra payment
	if (debt.interest_rate === 0) {
		return Math.ceil(remainingAmount / monthlyPaymentAmount);
	}

	// Check if the payment only covers the interest
	const monthlyInterest = remainingAmount * monthlyRate;
	if (monthlyPaymentAmount <= monthlyInterest) {
		return Infinity; // Will never be paid off as payment only covers interest
	}

	// Using the loan amortization formula to calculate months
	// n = -log(1 - (P * r) / PMT) / log(1 + r)
	// where:
	// n = number of months
	// P = principal (remaining amount)
	// r = monthly interest rate
	// PMT = monthly payment
	const months =
		-Math.log(1 - (remainingAmount * monthlyRate) / monthlyPaymentAmount) /
		Math.log(1 + monthlyRate);

	return Math.ceil(months);
}

/**
 * Calculates the total interest paid over the life of a debt based on a given monthly payment.
 * Uses loan amortization to determine total interest by subtracting the principal from total payments.
 *
 * @param debt - The debt to calculate total interest for
 * @param monthlyPayment - The total monthly payment amount (including minimum payment)
 * @returns The total interest paid over the life of the debt, or Infinity if the debt cannot be paid off
 */
export function calculateTotalInterest(
	debt: Debt | DebtWithPayments,
	monthlyPayment: number
): number {
	// Validate inputs
	if (monthlyPayment <= 0 || debt.interest_rate < 0) {
		return Infinity;
	}

	if (monthlyPayment <= debt.minimum_payment) {
		return Infinity;
	}

	const months = calculatePayoffTime(debt, monthlyPayment);
	if (!isFinite(months)) {
		return Infinity;
	}

	const monthlyRate = debt.interest_rate / 100 / 12;
	const remainingAmount =
		"remaining_balance" in debt
			? debt.remaining_balance ?? debt.amount
			: debt.amount;

	// Handle 0% interest rate case
	if (debt.interest_rate === 0) {
		return 0;
	}

	// Calculate total interest using amortization schedule
	let balance = remainingAmount;
	let totalInterest = 0;

	for (let i = 0; i < months; i++) {
		const interestPayment = balance * monthlyRate;
		const principalPayment = monthlyPayment - interestPayment;

		totalInterest += interestPayment;
		balance -= principalPayment;
	}

	return Math.round(totalInterest * 100) / 100;
}

/**
 * Calculates recommended monthly payments for each debt based on the chosen payoff strategy
 * and available payment amount.
 *
 * @param debts - Array of debts to calculate payments for
 * @param strategy - The debt payoff strategy to use (snowball, avalanche, or minimum)
 * @param availablePayment - Total amount available for monthly debt payments
 * @returns Object mapping debt IDs to their recommended monthly payment amounts
 */
export function calculateRecommendedPayment(
	debts: Debt[],
	strategy: PayoffStrategy,
	availablePayment: number
): { [key: string]: number } {
	// Validate inputs
	if (availablePayment <= 0) {
		return {};
	}

	const sortedDebts = calculatePayoffOrder(debts, strategy);
	const recommendedPayments: { [key: string]: number } = {};

	// Start with minimum payments for all debts
	debts.forEach(debt => {
		recommendedPayments[debt.id] = debt.minimum_payment;
	});

	// Calculate remaining payment amount
	const totalMinimumPayments = debts.reduce(
		(sum, debt) => sum + debt.minimum_payment,
		0
	);
	let remainingPayment = availablePayment - totalMinimumPayments;

	// If we can't even cover minimum payments, return minimum payments
	if (remainingPayment <= 0) {
		return recommendedPayments;
	}

	// Distribute remaining payment according to strategy
	if (strategy === "minimum") {
		return recommendedPayments;
	}

	for (const debt of sortedDebts) {
		if (remainingPayment <= 0) break;

		const remainingBalance =
			"remaining_balance" in debt
				? debt.remaining_balance ?? debt.amount
				: debt.amount;
		// Calculate how much extra we can pay on this debt
		const extraPayment = Math.min(
			remainingPayment,
			remainingBalance - debt.minimum_payment
		);
		recommendedPayments[debt.id] += extraPayment;
		remainingPayment -= extraPayment;
	}

	return recommendedPayments;
}

/**
 * Calculates the minimum monthly payment required to pay off a debt within a standard term.
 * Uses loan amortization formula to determine the minimum payment needed to pay off the debt
 * within a reasonable timeframe (typically 5 years/60 months for consumer debt).
 *
 * @param amount - The principal amount of the debt
 * @param interestRate - The annual interest rate (as a percentage)
 * @param termInMonths - The desired term in months (defaults to 60 months/5 years)
 * @returns The minimum monthly payment required
 */
export function calculateMinimumPayment(
	amount: number,
	interestRate: number,
	termInMonths: number = 60
): number {
	// Validate inputs
	if (amount <= 0 || interestRate < 0 || termInMonths <= 0) {
		return 0;
	}

	// Handle 0% interest rate case
	if (interestRate === 0) {
		return Math.ceil((amount / termInMonths) * 100) / 100;
	}

	const monthlyRate = interestRate / 100 / 12;

	// Using the loan amortization formula to calculate monthly payment:
	// PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
	// where:
	// PMT = monthly payment
	// P = principal (amount)
	// r = monthly interest rate
	// n = number of months (term)

	const monthlyPayment =
		(amount * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths))) /
		(Math.pow(1 + monthlyRate, termInMonths) - 1);

	// Round to nearest cent
	return Math.ceil(monthlyPayment * 100) / 100;
}
