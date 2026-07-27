-- Blog articles, FAQs, and moderated comments

-- blog_posts: slug, body (MDX), status
alter table public.blog_posts
  add column if not exists slug text,
  add column if not exists body text not null default '',
  add column if not exists status text not null default 'draft';

update public.blog_posts
set slug = lower(
  regexp_replace(
    regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-|-$)',
    '',
    'g'
  )
)
where slug is null or slug = '';

-- Ensure uniqueness if collisions
do $$
declare
  r record;
  n int;
begin
  for r in
    select slug, array_agg(id order by created_at) as ids
    from public.blog_posts
    group by slug
    having count(*) > 1
  loop
    n := 1;
    for i in 2..array_length(r.ids, 1) loop
      update public.blog_posts
      set slug = r.slug || '-' || n
      where id = r.ids[i];
      n := n + 1;
    end loop;
  end loop;
end $$;

alter table public.blog_posts
  alter column slug set not null;

create unique index if not exists blog_posts_slug_key on public.blog_posts (slug);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'blog_posts_status_check'
  ) then
    alter table public.blog_posts
      add constraint blog_posts_status_check
      check (status in ('draft', 'published'));
  end if;
end $$;

update public.blog_posts
set status = 'published'
where coalesce(body, '') <> '';

-- faqs
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "Public read faqs" on public.faqs for select using (true);
create policy "Auth insert faqs" on public.faqs for insert to authenticated with check (true);
create policy "Auth update faqs" on public.faqs for update to authenticated using (true) with check (true);
create policy "Auth delete faqs" on public.faqs for delete to authenticated using (true);

-- blog_comments
create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  author_name text not null,
  author_email text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_comments_post_id_idx on public.blog_comments (post_id);
create index if not exists blog_comments_status_idx on public.blog_comments (status);

alter table public.blog_comments enable row level security;

create policy "Public read approved comments"
  on public.blog_comments for select
  using (status = 'approved');

create policy "Public insert pending comments"
  on public.blog_comments for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "Auth read all comments"
  on public.blog_comments for select
  to authenticated
  using (true);

create policy "Auth update comments"
  on public.blog_comments for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete comments"
  on public.blog_comments for delete
  to authenticated
  using (true);
