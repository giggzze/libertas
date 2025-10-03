-- Consolidated Migration: Complete Database Schema
-- This migration consolidates all previous migrations into a single schema definition

-- Create enum types
CREATE TYPE debt_category AS ENUM (
    'CREDIT_CARD',
    'CAR_LOAN',
    'PERSONAL_LOAN',
    'OVERDRAFT',
    'SUBSCRIPTION',
    'OTHER'
);

CREATE TYPE debt_payment_type AS ENUM ('payment', 'charge', 'adjustment');

-- Create profiles table (with text id, no auth.users reference)
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create debts table
CREATE TABLE debts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    minimum_payment DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    term_in_months INTEGER NOT NULL DEFAULT 60 CHECK (term_in_months > 0),
    category debt_category NOT NULL DEFAULT 'OTHER',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create debt_payments table
CREATE TABLE debt_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    debt_id UUID REFERENCES debts(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    is_extra_payment BOOLEAN DEFAULT FALSE,
    type debt_payment_type NOT NULL DEFAULT 'payment',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create monthly_income table
CREATE TABLE monthly_income (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create expenses table
CREATE TABLE expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- No foreign key reference since profiles.id is now text
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    due_date INTEGER NOT NULL CHECK (due_date BETWEEN 1 AND 31),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (updated for text id)
-- Note: These policies will need to be updated based on your new authentication approach
-- since profiles no longer references auth.users directly

-- Create RLS policies for debts
CREATE POLICY "Users can view their own debts"
    ON debts FOR SELECT
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own debts"
    ON debts FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own debts"
    ON debts FOR UPDATE
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own debts"
    ON debts FOR DELETE
    USING (user_id = current_setting('app.current_user_id', true));

-- Create RLS policies for debt_payments
CREATE POLICY "Users can view their own debt payments"
    ON debt_payments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM debts
        WHERE debts.id = debt_payments.debt_id
        AND debts.user_id = current_setting('app.current_user_id', true)
    ));

CREATE POLICY "Users can insert their own debt payments"
    ON debt_payments FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM debts
        WHERE debts.id = debt_payments.debt_id
        AND debts.user_id = current_setting('app.current_user_id', true)
    ));

CREATE POLICY "Users can update their own debt payments"
    ON debt_payments FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM debts
        WHERE debts.id = debt_payments.debt_id
        AND debts.user_id = current_setting('app.current_user_id', true)
    ));

CREATE POLICY "Users can delete their own debt payments"
    ON debt_payments FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM debts
        WHERE debts.id = debt_payments.debt_id
        AND debts.user_id = current_setting('app.current_user_id', true)
    ));

-- Create RLS policies for monthly_income
CREATE POLICY "Users can view their own monthly income"
    ON monthly_income FOR SELECT
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own monthly income"
    ON monthly_income FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own monthly income"
    ON monthly_income FOR UPDATE
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own monthly income"
    ON monthly_income FOR DELETE
    USING (user_id = current_setting('app.current_user_id', true));

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses"
    ON expenses FOR SELECT
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own expenses"
    ON expenses FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own expenses"
    ON expenses FOR UPDATE
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own expenses"
    ON expenses FOR DELETE
    USING (user_id = current_setting('app.current_user_id', true));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON debts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON debt_payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON monthly_income
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX expenses_user_id_idx ON expenses(user_id);
CREATE INDEX expenses_due_date_idx ON expenses(due_date);

-- Add comments
COMMENT ON COLUMN debts.term_in_months IS 'The number of months over which the debt is expected to be paid off';
