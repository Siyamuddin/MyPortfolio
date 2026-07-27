-- Portfolio CMS schema, RLS, and Storage policies
-- Run in Supabase SQL editor or via CLI.

create extension if not exists "pgcrypto";

-- Profile (single row)
create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  email text not null,
  location text not null,
  bio jsonb not null default '[]'::jsonb,
  bio_highlight text not null default '',
  socials jsonb not null default '{}'::jsonb,
  avatar text not null default '',
  resume_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null default 'Code2',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#ffffff',
  icon text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text not null,
  period text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  period text not null,
  location text not null default '',
  highlights text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Web Development', 'Applications', 'Automation')),
  image text not null default '',
  url text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  date text not null default '',
  date_time text not null default '',
  excerpt text not null default '',
  image text not null default '',
  url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.profile enable row level security;
alter table public.services enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;

-- Public read
create policy "Public read profile" on public.profile for select using (true);
create policy "Public read services" on public.services for select using (true);
create policy "Public read skills" on public.skills for select using (true);
create policy "Public read education" on public.education for select using (true);
create policy "Public read experience" on public.experience for select using (true);
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read blog_posts" on public.blog_posts for select using (true);

-- Authenticated write
create policy "Auth insert profile" on public.profile for insert to authenticated with check (true);
create policy "Auth update profile" on public.profile for update to authenticated using (true) with check (true);
create policy "Auth delete profile" on public.profile for delete to authenticated using (true);

create policy "Auth insert services" on public.services for insert to authenticated with check (true);
create policy "Auth update services" on public.services for update to authenticated using (true) with check (true);
create policy "Auth delete services" on public.services for delete to authenticated using (true);

create policy "Auth insert skills" on public.skills for insert to authenticated with check (true);
create policy "Auth update skills" on public.skills for update to authenticated using (true) with check (true);
create policy "Auth delete skills" on public.skills for delete to authenticated using (true);

create policy "Auth insert education" on public.education for insert to authenticated with check (true);
create policy "Auth update education" on public.education for update to authenticated using (true) with check (true);
create policy "Auth delete education" on public.education for delete to authenticated using (true);

create policy "Auth insert experience" on public.experience for insert to authenticated with check (true);
create policy "Auth update experience" on public.experience for update to authenticated using (true) with check (true);
create policy "Auth delete experience" on public.experience for delete to authenticated using (true);

create policy "Auth insert projects" on public.projects for insert to authenticated with check (true);
create policy "Auth update projects" on public.projects for update to authenticated using (true) with check (true);
create policy "Auth delete projects" on public.projects for delete to authenticated using (true);

create policy "Auth insert blog_posts" on public.blog_posts for insert to authenticated with check (true);
create policy "Auth update blog_posts" on public.blog_posts for update to authenticated using (true) with check (true);
create policy "Auth delete blog_posts" on public.blog_posts for delete to authenticated using (true);

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

create policy "Public read portfolio storage"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "Auth upload portfolio storage"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio');

create policy "Auth update portfolio storage"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio')
  with check (bucket_id = 'portfolio');

create policy "Auth delete portfolio storage"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio');
