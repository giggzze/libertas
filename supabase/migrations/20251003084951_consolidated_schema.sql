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


