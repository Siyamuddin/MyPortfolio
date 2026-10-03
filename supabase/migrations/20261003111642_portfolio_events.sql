-- Event stories are independent of the core portfolio content. The ordered
-- photos array keeps its cover (first photo), captions, and ordering atomic.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  category text not null check (category in ('Hackathon', 'University', 'Conference', 'Workshop', 'Community', 'Other')),
  date date not null,
  location text not null default '' check (char_length(location) <= 200),
  organizer text not null default '' check (char_length(organizer) <= 200),
  description text not null default '' check (char_length(description) <= 6000),
  highlight text not null default '' check (char_length(highlight) <= 300),
  url text not null default '' check (char_length(url) <= 2048 and (url = '' or url ~* '^https?://[^[:space:]]+$')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_photos_array check (
    case when jsonb_typeof(photos) = 'array'
      then jsonb_array_length(photos) <= 20 and octet_length(photos::text) <= 100000
      else false end
  )
);

create index events_published_date_idx on public.events(date desc, created_at desc)
  where status = 'published';

alter table public.events enable row level security;
revoke all on public.events from public, anon, authenticated;
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;

create policy "Published events" on public.events for select to anon
  using (status = 'published');
create policy "Published or owner events" on public.events for select to authenticated
  using (status = 'published' or (select private.is_portfolio_admin()));
create policy "Owner insert events" on public.events for insert to authenticated
  with check ((select private.is_portfolio_admin()));
create policy "Owner update events" on public.events for update to authenticated
  using ((select private.is_portfolio_admin()))
  with check ((select private.is_portfolio_admin()));
create policy "Owner delete events" on public.events for delete to authenticated
  using ((select private.is_portfolio_admin()));

-- Photo uploads reuse the existing owner-only policies of the portfolio bucket.
notify pgrst, 'reload schema';
