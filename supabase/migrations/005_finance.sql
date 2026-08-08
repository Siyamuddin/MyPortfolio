-- Personal finance dashboard (spends, config, obligations, guidelines)
-- Private tables: service_role only via API; no anon/public policies.

create extension if not exists "pgcrypto";

create table if not exists public.finance_spends (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  food bigint not null default 0,
  transport bigint not null default 0,
  shopping bigint not null default 0,
  subscriptions bigint not null default 0,
  remittance bigint not null default 0,
  other bigint not null default 0,
  total bigint not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (date)
);

create table if not exists public.finance_config (
  id int primary key default 1 check (id = 1),
  currency text not null default 'KRW',
  monthly_income bigint,
  budget_caps jsonb,
  total_monthly_budget bigint,
  emergency_fund_target bigint,
  emergency_fund_seed bigint,
  hero_metric text,
  tuition_due text,
  tuition_amount bigint,
  passport_cost bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_obligations (
  id text primary key,
  name text,
  amount bigint,
  paid boolean not null default false,
  due_date text,
  priority int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_guidelines (
  id text primary key,
  title text,
  body text,
  severity text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.finance_spends enable row level security;
alter table public.finance_config enable row level security;
alter table public.finance_obligations enable row level security;
alter table public.finance_guidelines enable row level security;

drop policy if exists "Service role full access finance_spends" on public.finance_spends;
create policy "Service role full access finance_spends"
  on public.finance_spends
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "Service role full access finance_config" on public.finance_config;
create policy "Service role full access finance_config"
  on public.finance_config
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "Service role full access finance_obligations" on public.finance_obligations;
create policy "Service role full access finance_obligations"
  on public.finance_obligations
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "Service role full access finance_guidelines" on public.finance_guidelines;
create policy "Service role full access finance_guidelines"
  on public.finance_guidelines
  for all
  to service_role
  using (true)
  with check (true);
