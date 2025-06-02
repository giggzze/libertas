import { Debt, DebtWithPayments, Expense, MonthlyIncome } from "@/types/STT";
import { SQLiteDatabase, openDatabaseSync } from "expo-sqlite";

class LocalDatabase {
	private db: SQLiteDatabase;

	constructor() {
		this.db = openDatabaseSync("libertas.db");
		this.initDatabase();
	}

	private initDatabase() {
		const createTables = `
			CREATE TABLE IF NOT EXISTS auth (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL,
				email TEXT,
				access_token TEXT,
				refresh_token TEXT,
				expires_at TEXT,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL
			);
			CREATE TABLE IF NOT EXISTS debts (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				amount REAL NOT NULL,
				remaining_balance REAL,
				interest_rate REAL NOT NULL,
				minimum_payment REAL NOT NULL,
				start_date TEXT NOT NULL,
				end_date TEXT,
				term_in_months INTEGER,
				category TEXT NOT NULL,
				is_paid BOOLEAN,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				sync_status TEXT DEFAULT 'synced'
			);
			CREATE TABLE IF NOT EXISTS expenses (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				amount REAL NOT NULL,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				sync_status TEXT DEFAULT 'synced'
			);
			CREATE TABLE IF NOT EXISTS monthly_income (
				id TEXT PRIMARY KEY,
				amount REAL NOT NULL,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				sync_status TEXT DEFAULT 'synced'
			);
		`;
		this.db.execSync(createTables);
	}

	// Auth operations
	async getAuthState(): Promise<{
		user: any;
		session: any;
	} | null> {
		const auth = await this.db.getFirstSync<{
			id: string;
			user_id: string;
			email: string;
			access_token: string;
			refresh_token: string;
			expires_at: string;
			created_at: string;
			updated_at: string;
		}>("SELECT * FROM auth LIMIT 1");

		if (!auth) return null;

		const now = new Date();
		const expiresAt = new Date(auth.expires_at);

		// Check if session is expired
		if (now > expiresAt) {
			await this.clearAuthState();
			return null;
		}

		return {
			user: {
				id: auth.user_id,
				email: auth.email,
			},
			session: {
				access_token: auth.access_token,
				refresh_token: auth.refresh_token,
				expires_at: auth.expires_at,
			},
		};
	}

	async setAuthState(user: any, session: any): Promise<void> {
		if (!user || !session) {
			await this.clearAuthState();
			return;
		}

		await this.db.runSync(
			`INSERT OR REPLACE INTO auth (
				id, user_id, email, access_token, refresh_token, expires_at, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				user.id,
				user.id,
				user.email,
				session.access_token,
				session.refresh_token,
				session.expires_at,
				new Date().toISOString(),
				new Date().toISOString(),
			]
		);
	}

	async clearAuthState(): Promise<void> {
		await this.db.runSync("DELETE FROM auth");
	}

	// Debt operations
	async getDebts(): Promise<DebtWithPayments[]> {
		return this.db.getAllSync<DebtWithPayments>(
			"SELECT * FROM debts ORDER BY created_at DESC"
		);
	}

	async addDebt(debt: Debt): Promise<void> {
		this.db.runSync(
			`INSERT INTO debts (id, name, amount, remaining_balance, interest_rate, minimum_payment, start_date, end_date, term_in_months, category, is_paid, created_at, updated_at, sync_status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				debt.id,
				debt.name,
				debt.amount,
				debt.amount, // Initial remaining balance equals amount
				debt.interest_rate,
				debt.minimum_payment,
				debt.start_date,
				debt.end_date,
				debt.term_in_months,
				debt.category,
				debt.is_paid,
				new Date().toISOString(),
				new Date().toISOString(),
				"pending",
			]
		);
	}

	async updateDebt(debt: Debt): Promise<void> {
		this.db.runSync(
			`UPDATE debts 
			SET name = ?, amount = ?, remaining_balance = ?, interest_rate = ?, 
				minimum_payment = ?, start_date = ?, end_date = ?, term_in_months = ?, 
				category = ?, is_paid = ?, updated_at = ?, sync_status = ?
			WHERE id = ?`,
			[
				debt.name,
				debt.amount,
				debt.amount, // Keep remaining balance equal to amount for now
				debt.interest_rate,
				debt.minimum_payment,
				debt.start_date,
				debt.end_date,
				debt.term_in_months,
				debt.category,
				debt.is_paid,
				new Date().toISOString(),
				"pending",
				debt.id,
			]
		);
	}

	async deleteDebt(id: string): Promise<void> {
		this.db.runSync("DELETE FROM debts WHERE id = ?", [id]);
	}

	// Expense operations
	async getExpenses(): Promise<Expense[]> {
		return this.db.getAllSync<Expense>(
			"SELECT * FROM expenses ORDER BY created_at DESC"
		);
	}

	async addExpense(expense: Expense): Promise<void> {
		this.db.runSync(
			`INSERT INTO expenses (id, name, amount, created_at, updated_at, sync_status)
			VALUES (?, ?, ?, ?, ?, ?)`,
			[
				expense.id,
				expense.name,
				expense.amount,
				new Date().toISOString(),
				new Date().toISOString(),
				"pending",
			]
		);
	}

	async updateExpense(expense: Expense): Promise<void> {
		this.db.runSync(
			`UPDATE expenses 
			SET name = ?, amount = ?, updated_at = ?, sync_status = ?
			WHERE id = ?`,
			[
				expense.name,
				expense.amount,
				new Date().toISOString(),
				"pending",
				expense.id,
			]
		);
	}

	async deleteExpense(id: string): Promise<void> {
		this.db.runSync("DELETE FROM expenses WHERE id = ?", [id]);
	}

	// Monthly Income operations
	async getMonthlyIncome(): Promise<MonthlyIncome | null> {
		return this.db.getFirstSync<MonthlyIncome>(
			"SELECT * FROM monthly_income ORDER BY created_at DESC LIMIT 1"
		);
	}

	async setMonthlyIncome(income: MonthlyIncome): Promise<void> {
		this.db.runSync(
			`INSERT OR REPLACE INTO monthly_income (id, amount, created_at, updated_at, sync_status)
			VALUES (?, ?, ?, ?, ?)`,
			[
				income.id,
				income.amount,
				new Date().toISOString(),
				new Date().toISOString(),
				"pending",
			]
		);
	}

	// Sync operations
	async getPendingSyncItems(): Promise<{
		debts: DebtWithPayments[];
		expenses: Expense[];
		monthlyIncome: MonthlyIncome | null;
	}> {
		const debts = this.db.getAllSync<DebtWithPayments>(
			"SELECT * FROM debts WHERE sync_status = ?",
			["pending"]
		);
		const expenses = this.db.getAllSync<Expense>(
			"SELECT * FROM expenses WHERE sync_status = ?",
			["pending"]
		);
		const monthlyIncome = this.db.getFirstSync<MonthlyIncome>(
			"SELECT * FROM monthly_income WHERE sync_status = ?",
			["pending"]
		);

		return { debts, expenses, monthlyIncome };
	}

	async markAsSynced(
		table: "debts" | "expenses" | "monthly_income",
		id: string
	): Promise<void> {
		this.db.runSync(`UPDATE ${table} SET sync_status = ? WHERE id = ?`, [
			"synced",
			id,
		]);
	}
}

export const localDatabase = new LocalDatabase();
