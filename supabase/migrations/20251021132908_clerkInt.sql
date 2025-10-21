-- Remove all foreign key relationships and ensure all tables have user_id column
-- This migration removes foreign key constraints and standardizes user_id columns

-- Step 1: Remove all foreign key relationships
ALTER TABLE debts DROP CONSTRAINT IF EXISTS debts_user_id_fkey;
ALTER TABLE debt_payments DROP CONSTRAINT IF EXISTS debt_payments_debt_id_fkey;
ALTER TABLE monthly_income DROP CONSTRAINT IF EXISTS monthly_income_user_id_fkey;

-- Step 2: Handle existing user_id columns and ensure they have the correct default
-- For tables that already have user_id columns, update the default value

-- Update debts table user_id default
ALTER TABLE debts ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub')::text;
ALTER TABLE monthly_income ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub')::text;
ALTER TABLE expenses ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub')::text;

-- Step 3: Add user_id column to tables that don't have it
ALTER TABLE debt_payments ADD COLUMN user_id text DEFAULT (auth.jwt()->>'sub')::text;

-- Step 4: Rename profiles.id to profiles.user_id
-- First drop the primary key constraint, then rename, then recreate
alter table profiles add column user_id text default (auth.jwt()->>'sub')::text;




