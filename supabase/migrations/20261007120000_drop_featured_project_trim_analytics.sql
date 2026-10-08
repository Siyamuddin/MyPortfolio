-- Drop the unused featured-project pointer and the unread analytics series.

drop index if exists public.profile_featured_project_id_idx;

alter table public.profile drop column if exists featured_project_id;

create or replace function public.get_analytics_summary()
returns json
language plpgsql
security invoker
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
    )
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_analytics_summary() from public, anon;
grant execute on function public.get_analytics_summary() to authenticated, service_role;
