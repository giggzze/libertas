 -- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for debts
create table debts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  amount decimal(12,2) not null,
  interest_rate decimal(5,2) not null,
  minimum_payment decimal(12,2) not null,
  start_date date not null,
  end_date date,
  is_paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for debt payments
create table debt_payments (
  id uuid default gen_random_uuid() primary key,
  debt_id uuid references debts(id) on delete cascade not null,
  amount decimal(12,2) not null,
  payment_date date not null,
  is_extra_payment boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for monthly income
create table monthly_income (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  amount decimal(12,2) not null,
  start_date date not null,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table debts enable row level security;
alter table debt_payments enable row level security;
alter table monthly_income enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can view their own debts"
  on debts for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own debts"
  on debts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own debts"
  on debts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own debts"
  on debts for delete
  using ( auth.uid() = user_id );

create policy "Users can view their own debt payments"
  on debt_payments for select
  using ( exists (
    select 1 from debts
    where debts.id = debt_payments.debt_id
    and debts.user_id = auth.uid()
  ));

create policy "Users can insert their own debt payments"
  on debt_payments for insert
  with check ( exists (
    select 1 from debts
    where debts.id = debt_payments.debt_id
    and debts.user_id = auth.uid()
  ));

create policy "Users can update their own debt payments"
  on debt_payments for update
  using ( exists (
    select 1 from debts
    where debts.id = debt_payments.debt_id
    and debts.user_id = auth.uid()
  ));

create policy "Users can delete their own debt payments"
  on debt_payments for delete
  using ( exists (
    select 1 from debts
    where debts.id = debt_payments.debt_id
    and debts.user_id = auth.uid()
  ));

create policy "Users can view their own monthly income"
  on monthly_income for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own monthly income"
  on monthly_income for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own monthly income"
  on monthly_income for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own monthly income"
  on monthly_income for delete
  using ( auth.uid() = user_id );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers for updated_at
create trigger handle_updated_at
  before update on profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on debts
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on debt_payments
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on monthly_income
  for each row execute procedure public.handle_updated_at();