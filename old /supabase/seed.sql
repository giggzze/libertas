-- Seed data for testing the debt planner application

-- Insert test users into auth.users first
-- Note: These passwords are hashed versions of "password123" using bcrypt
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'u1@mail.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "John Doe"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
), (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'jane.smith@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Jane Smith"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
), (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'bob.johnson@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Bob Johnson"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert test profiles (these will be created automatically by the trigger, but we include them for completeness)
INSERT INTO profiles (id, email, full_name, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John Doe', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane Smith', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'bob.johnson@example.com', 'Bob Johnson', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert monthly income data
INSERT INTO monthly_income
    (id, user_id, amount, start_date, created_at, updated_at)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 5500.00, '2024-01-01', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 4200.00, '2024-01-01', NOW(), NOW()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 6800.00, '2024-01-01', NOW(), NOW());

-- Insert test debts for John Doe
INSERT INTO debts
    (id, user_id, name, amount, interest_rate, minimum_payment, start_date, created_at, updated_at)
VALUES
    ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Credit Card (Chase)', 8500.00, 19.99, 150.00, '2023-06-15', NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Student Loan', 32000.00, 5.50, 320.00, '2022-09-01', NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Car Loan', 18500.00, 4.25, 425.00, '2023-03-10', NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'Personal Loan', 12000.00, 12.99, 275.00, '2023-11-20', NOW(), NOW());

-- Insert test debts for Jane Smith
INSERT INTO debts
    (id, user_id, name, amount, interest_rate, minimum_payment, start_date, created_at, updated_at)
VALUES
    ('d2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Credit Card (Discover)', 4200.00, 16.99, 84.00, '2023-08-05', NOW(), NOW()),
    ('d2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Medical Debt', 3500.00, 0.00, 100.00, '2023-12-01', NOW(), NOW()),
    ('d2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Home Improvement Loan', 15000.00, 7.25, 180.00, '2023-04-15', NOW(), NOW());

-- Insert test debts for Bob Johnson
INSERT INTO debts
    (id, user_id, name, amount, interest_rate, minimum_payment, start_date, created_at, updated_at)
VALUES
    ('d3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Credit Card (Amex)', 12500.00, 21.99, 250.00, '2023-01-10', NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Mortgage', 285000.00, 6.75, 1850.00, '2022-05-01', NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Business Loan', 45000.00, 8.50, 580.00, '2023-07-01', NOW(), NOW());

-- Insert debt payments for John Doe's Credit Card
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d1111111-1111-1111-1111-111111111111', 150.00, '2024-01-15', false, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111111', 150.00, '2024-02-15', false, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111111', 200.00, '2024-02-28', true, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111111', 150.00, '2024-03-15', false, NOW(), NOW());

-- Insert debt payments for John Doe's Student Loan
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d1111111-1111-1111-1111-111111111112', 320.00, '2024-01-01', false, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111112', 320.00, '2024-02-01', false, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111112', 320.00, '2024-03-01', false, NOW(), NOW());

-- Insert debt payments for John Doe's Car Loan
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d1111111-1111-1111-1111-111111111113', 425.00, '2024-01-10', false, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111113', 425.00, '2024-02-10', false, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111113', 500.00, '2024-02-25', true, NOW(), NOW()),
    ('d1111111-1111-1111-1111-111111111113', 425.00, '2024-03-10', false, NOW(), NOW());

-- Insert debt payments for Jane Smith's Credit Card
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d2222222-2222-2222-2222-222222222221', 84.00, '2024-01-05', false, NOW(), NOW()),
    ('d2222222-2222-2222-2222-222222222221', 84.00, '2024-02-05', false, NOW(), NOW()),
    ('d2222222-2222-2222-2222-222222222221', 150.00, '2024-02-20', true, NOW(), NOW()),
    ('d2222222-2222-2222-2222-222222222221', 84.00, '2024-03-05', false, NOW(), NOW());

-- Insert debt payments for Jane Smith's Medical Debt
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d2222222-2222-2222-2222-222222222222', 100.00, '2024-01-01', false, NOW(), NOW()),
    ('d2222222-2222-2222-2222-222222222222', 100.00, '2024-02-01', false, NOW(), NOW()),
    ('d2222222-2222-2222-2222-222222222222', 100.00, '2024-03-01', false, NOW(), NOW());

-- Insert debt payments for Bob Johnson's Credit Card
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d3333333-3333-3333-3333-333333333331', 250.00, '2024-01-10', false, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333331', 300.00, '2024-01-25', true, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333331', 250.00, '2024-02-10', false, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333331', 250.00, '2024-03-10', false, NOW(), NOW());

-- Insert debt payments for Bob Johnson's Mortgage
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d3333333-3333-3333-3333-333333333332', 1850.00, '2024-01-01', false, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333332', 1850.00, '2024-02-01', false, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333332', 2000.00, '2024-02-15', true, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333332', 1850.00, '2024-03-01', false, NOW(), NOW());

-- Insert debt payments for Bob Johnson's Business Loan
INSERT INTO debt_payments
    (debt_id, amount, payment_date, is_extra_payment, created_at, updated_at)
VALUES
    ('d3333333-3333-3333-3333-333333333333', 580.00, '2024-01-01', false, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333333', 580.00, '2024-02-01', false, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333333', 700.00, '2024-02-20', true, NOW(), NOW()),
    ('d3333333-3333-3333-3333-333333333333', 580.00, '2024-03-01', false, NOW(), NOW()); 