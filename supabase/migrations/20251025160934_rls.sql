ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_income ENABLE ROW LEVEL SECURITY;
-- TODO:: need to do the imp for these tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;


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