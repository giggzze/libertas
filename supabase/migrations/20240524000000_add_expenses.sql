-- Create expenses table
CREATE TABLE expenses
(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    due_date INTEGER NOT NULL CHECK (due_date BETWEEN 1 AND 31),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add RLS policies
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own expenses
CREATE POLICY "Users can view their own expenses"
    ON expenses FOR
SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own expenses
CREATE POLICY "Users can insert their own expenses"
    ON expenses FOR
INSERT
    WITH CHECK (auth.uid() =
user_id);

-- Policy to allow users to update their own expenses
CREATE POLICY "Users can update their own expenses"
    ON expenses FOR
UPDATE
    USING (auth.uid()
= user_id)
    WITH CHECK
(auth.uid
() = user_id);

-- Policy to allow users to delete their own expenses
CREATE POLICY "Users can delete their own expenses"
    ON expenses FOR
DELETE
    USING (auth.uid
() = user_id);

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX expenses_user_id_idx ON expenses(user_id);
CREATE INDEX expenses_due_date_idx ON expenses(due_date); 