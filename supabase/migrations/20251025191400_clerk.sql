ALTER TABLE debts DROP CONSTRAINT IF EXISTS debts_user_id_fkey;
ALTER TABLE debt_payments DROP CONSTRAINT IF EXISTS debt_payments_debt_id_fkey;
ALTER TABLE monthly_income DROP CONSTRAINT IF EXISTS monthly_income_user_id_fkey;
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_user_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

DROP POLICY IF EXISTS "Users can delete their own debts" ON debts;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own monthly income" ON monthly_income;
DROP POLICY IF EXISTS "Users can insert their own debt payments" ON debt_payments;
DROP POLICY IF EXISTS "Users can insert their own debts" ON debts;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own monthly income" ON monthly_income;
DROP POLICY IF EXISTS "Users can update their own debt payments" ON debt_payments;
DROP POLICY IF EXISTS "Users can update their own debts" ON debts;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own monthly income" ON monthly_income;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own debt payments" ON debt_payments;
DROP POLICY IF EXISTS "Users can view their own debts" ON debts;
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view their own monthly income" ON monthly_income;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own debt payments" ON debt_payments;

ALTER TABLE debts ALTER COLUMN user_id type text;
ALTER TABLE debts ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub')::text;
ALTER TABLE monthly_income ALTER COLUMN user_id type text;
ALTER TABLE monthly_income ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub')::text;
ALTER TABLE expenses ALTER COLUMN user_id type text;
ALTER TABLE expenses ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub')::text;
ALTER TABLE debt_payments ADD COLUMN user_id text DEFAULT (auth.jwt()->>'sub')::text;

-- GET
-- Users can view their own debts
CREATE
POLICY "Users can view their own debts" ON debts
    FOR
SELECT
    TO authenticated
    USING (user_id = (auth.jwt()->>'sub')::text);

-- Users can view their own expenses
CREATE
POLICY "Users can view their own expenses" ON expenses
    FOR
SELECT
    TO authenticated
    USING (user_id = (auth.jwt()->>'sub')::text);

-- Users can view their own monthly income
CREATE
POLICY "Users can view their own montly income" ON monthly_income
    FOR
SELECT
    TO authenticated
    USING (user_id = (auth.jwt()->>'sub')::text);


-- CREATE
-- Users can insert their own debt
CREATE
POLICY "Users can insert their own debt" ON debts
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (auth.jwt()->>'sub')::text);

-- Users can insert their own expense
CREATE
POLICY "Users can insert their own expense" ON expenses
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (auth.jwt()->>'sub')::text);

-- Users can insert their own income
CREATE
POLICY "Users can insert their own income" ON monthly_income
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (auth.jwt()->>'sub')::text);