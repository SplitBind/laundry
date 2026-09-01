-- Run this in the Supabase SQL editor for your project.

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  item text not null,
  quantity numeric not null check (quantity > 0),
  price numeric not null check (price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_id_date_idx on public.expenses (user_id, date desc);

alter table public.expenses enable row level security;

-- Users can only see their own expenses
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

-- Users can only insert expenses for themselves
create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

-- Users can only update their own expenses
create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

-- Users can only delete their own expenses
create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);
