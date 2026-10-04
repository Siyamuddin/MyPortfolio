-- SEO architecture: per-event detail URLs, a normalized tag registry shared by
-- events, blog posts and projects, and optional per-item Open Graph images.
-- Forward-only and additive: no content is deleted and existing rows keep their
-- data (new array columns default to empty, slugs are backfilled from titles).

-- 1. Event detail URLs ------------------------------------------------------
alter table public.events
  add column if not exists slug text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists og_image text not null default '' check (char_length(og_image) <= 2048);

-- Backfill slugs from existing titles, then guarantee uniqueness.
update public.events
set slug = left(
  regexp_replace(
    regexp_replace(lower(btrim(title)), '[^a-z0-9]+', '-', 'g'),
    '(^-|-$)', '', 'g'
  ),
  50
)
where slug is null or btrim(slug) = '';

update public.events set slug = 'event' where slug is null or btrim(slug) = '';

do $$
declare
  r record;
  n int;
begin
  for r in
    select slug, array_agg(id order by created_at) as ids
    from public.events
    group by slug
    having count(*) > 1
  loop
    n := 1;
    for i in 2..array_length(r.ids, 1) loop
      update public.events
      set slug = left(r.slug, 46) || '-' || n::text
      where id = r.ids[i];
      n := n + 1;
    end loop;
  end loop;
end $$;

create unique index if not exists events_slug_key on public.events (slug);
alter table public.events alter column slug set not null;

-- Generate a unique slug for any insert/update that leaves it empty. Keeps
-- existing slugs stable (SEO canonical URLs do not churn when an event is edited)
-- and lets direct database inserts (dashboard, tests) work without a slug.
create or replace function public.generate_event_slug()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare
  base text;
  candidate text;
  n int := 0;
begin
  if new.slug is null or btrim(new.slug) = '' then
    base := regexp_replace(
      regexp_replace(lower(btrim(new.title)), '[^a-z0-9]+', '-', 'g'),
      '(^-|-$)', '', 'g'
    );
    if base = '' then base := 'event'; end if;
    base := left(base, 50);
    candidate := base;
    while exists (
      select 1 from public.events e where e.slug = candidate and e.id <> new.id
    ) loop
      n := n + 1;
      candidate := left(base, 46) || '-' || n::text;
    end loop;
    new.slug := candidate;
  end if;
  return new;
end $$;

drop trigger if exists events_set_slug on public.events;
create trigger events_set_slug
  before insert or update of title, slug on public.events
  for each row execute function public.generate_event_slug();

-- 2. Tags on the other taggable content types ------------------------------
alter table public.blog_posts
  add column if not exists tags text[] not null default '{}',
  add column if not exists og_image text not null default '' check (char_length(og_image) <= 2048);

alter table public.projects
  add column if not exists tags text[] not null default '{}',
  add column if not exists og_image text not null default '' check (char_length(og_image) <= 2048);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'events_tags_limit') then
    alter table public.events add constraint events_tags_limit
      check (coalesce(array_length(tags, 1), 0) <= 12);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'blog_posts_tags_limit') then
    alter table public.blog_posts add constraint blog_posts_tags_limit
      check (coalesce(array_length(tags, 1), 0) <= 12);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'projects_tags_limit') then
    alter table public.projects add constraint projects_tags_limit
      check (coalesce(array_length(tags, 1), 0) <= 12);
  end if;
end $$;

create index if not exists events_tags_gin on public.events using gin (tags);
create index if not exists blog_posts_tags_gin on public.blog_posts using gin (tags);
create index if not exists projects_tags_gin on public.projects using gin (tags);

-- 3. Normalized tag registry (slug + display label) ------------------------
create table if not exists public.tags (
  slug text primary key
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 50),
  label text not null check (char_length(btrim(label)) between 1 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tags enable row level security;
revoke all on public.tags from public, anon, authenticated;
grant select on public.tags to anon, authenticated;
grant insert, update, delete on public.tags to authenticated;
grant all on public.tags to service_role;

create policy "Public tags" on public.tags for select to anon, authenticated
  using (true);
create policy "Owner insert tags" on public.tags for insert to authenticated
  with check ((select private.is_portfolio_admin()));
create policy "Owner update tags" on public.tags for update to authenticated
  using ((select private.is_portfolio_admin()))
  with check ((select private.is_portfolio_admin()));
create policy "Owner delete tags" on public.tags for delete to authenticated
  using ((select private.is_portfolio_admin()));

-- 4. Seed sensible starter tags and attach them to the Digital AF event -----
insert into public.tags (slug, label) values
  ('hackathon', 'Hackathon'),
  ('elevenlabs', 'ElevenLabs'),
  ('lovable', 'Lovable'),
  ('mixroom-ai', 'Mixroom.ai'),
  ('daw', 'DAW'),
  ('voice-assistant', 'Voice Assistant'),
  ('seoul', 'Seoul'),
  ('korea-blockchain-week', 'Korea Blockchain Week')
on conflict (slug) do nothing;

update public.events
set tags = array[
  'hackathon', 'elevenlabs', 'lovable', 'mixroom-ai',
  'daw', 'voice-assistant', 'seoul', 'korea-blockchain-week'
]
where title ilike '%digital af%'
  and coalesce(array_length(tags, 1), 0) = 0;

notify pgrst, 'reload schema';
