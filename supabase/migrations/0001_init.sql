-- How-Rich schema: profiles, accounts, categories, transactions.
-- Every table is scoped to its owner via Row Level Security.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  currency char(3) not null default 'PLN',
  created_at timestamptz not null default now()
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 60),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 60),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create type public.transaction_kind as enum ('income', 'expense', 'saving', 'transfer');

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind public.transaction_kind not null,
  amount numeric(14, 2) not null check (amount > 0),
  occurred_on date not null default current_date,
  account_id uuid references public.accounts (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  note text check (char_length(note) <= 280),
  created_at timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions (user_id, occurred_on desc);

-- Row Level Security: a user can only touch rows they own.
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own accounts" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own categories" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own transactions" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- On signup: create a profile (PLN) plus starter accounts and categories.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.accounts (user_id, name) values
    (new.id, 'Cash'), (new.id, 'Bank'), (new.id, 'Savings');
  insert into public.categories (user_id, name) values
    (new.id, 'Food'), (new.id, 'Rent'), (new.id, 'Transport'),
    (new.id, 'Fun'), (new.id, 'Bills'), (new.id, 'Salary');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
