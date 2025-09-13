-- Migration: Add 'type' column to debt_payments for transaction log
-- 1. Create enum type for payment type
CREATE TYPE debt_payment_type AS ENUM ('payment', 'charge', 'adjustment');

-- 2. Add the column using the new enum type
ALTER TABLE debt_payments
ADD COLUMN type debt_payment_type NOT NULL DEFAULT 'payment'; 