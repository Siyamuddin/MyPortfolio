-- First-party visitor analytics (page views + unique visitors)

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  visitor_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_created_visitor_idx
  on public.analytics_events (created_at, visitor_hash);

create index if not exists analytics_events_path_idx
  on public.analytics_events (path);

alter table public.analytics_events enable row level security;

-- Inserts go through Next.js API with service role; no anon write policy.
-- Admin (authenticated) can read for dashboard stats.
drop policy if exists "Auth read analytics_events" on public.analytics_events;
create policy "Auth read analytics_events"
  on public.analytics_events
  for select
  to authenticated
  using (true);

-- Aggregated stats for admin dashboard (day / month / year + summary)
create or replace function public.get_analytics_summary()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'summary', json_build_object(
      'today', (
        select json_build_object(
          'page_views', count(*),
          'unique_visitors', count(distinct visitor_hash)
        )
        from public.analytics_events
        where created_at >= date_trunc('day', now())
      ),
      'this_month', (
        select json_build_object(
          'page_views', count(*),
          'unique_visitors', count(distinct visitor_hash)
        )
        from public.analytics_events
        where created_at >= date_trunc('month', now())
      ),
      'this_year', (
        select json_build_object(
          'page_views', count(*),
          'unique_visitors', count(distinct visitor_hash)
        )
        from public.analytics_events
        where created_at >= date_trunc('year', now())
      )
    ),
    'by_day', coalesce((
      select json_agg(row_to_json(d) order by d.period desc)
      from (
        select
          to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as period,
          count(*)::int as page_views,
          count(distinct visitor_hash)::int as unique_visitors
        from public.analytics_events
        where created_at >= date_trunc('day', now()) - interval '29 days'
        group by date_trunc('day', created_at)
      ) d
    ), '[]'::json),
    'by_month', coalesce((
      select json_agg(row_to_json(m) order by m.period desc)
      from (
        select
          to_char(date_trunc('month', created_at), 'YYYY-MM') as period,
          count(*)::int as page_views,
          count(distinct visitor_hash)::int as unique_visitors
        from public.analytics_events
        where created_at >= date_trunc('month', now()) - interval '11 months'
        group by date_trunc('month', created_at)
      ) m
    ), '[]'::json),
    'by_year', coalesce((
      select json_agg(row_to_json(y) order by y.period desc)
      from (
        select
          to_char(date_trunc('year', created_at), 'YYYY') as period,
          count(*)::int as page_views,
          count(distinct visitor_hash)::int as unique_visitors
        from public.analytics_events
        group by date_trunc('year', created_at)
      ) y
    ), '[]'::json)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_analytics_summary() from public;
grant execute on function public.get_analytics_summary() to authenticated;
