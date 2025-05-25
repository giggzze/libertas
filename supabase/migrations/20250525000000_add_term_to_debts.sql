-- Add term_in_months column to debts table
ALTER TABLE debts
ADD COLUMN term_in_months INTEGER NOT NULL DEFAULT 60;

-- Add a check constraint to ensure term_in_months is positive
ALTER TABLE debts
ADD CONSTRAINT debts_term_in_months_check
CHECK (term_in_months > 0);

-- Update existing records to use default value
UPDATE debts
SET term_in_months = 60
WHERE term_in_months IS NULL;

-- Add comment to explain the field
COMMENT ON COLUMN debts.term_in_months IS 'The number of months over which the debt is expected to be paid off'; 