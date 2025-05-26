-- Add category to debts table with the enum type
CREATE TYPE debt_category AS ENUM
(
    'CREDIT_CARD',
    'CAR_LOAN',
    'PERSONAL_LOAN',
    'OVERDRAFT',
    'SUBSCRIPTION',
    'OTHER'
);

ALTER TABLE debts
ADD COLUMN category debt_category NOT NULL DEFAULT 'OTHER';