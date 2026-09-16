-- Forward-only hardening for the existing portfolio schema. No content is deleted.
-- Bootstrap the verified owner in private.portfolio_admins separately at deployment.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

create table if not exists private.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table private.portfolio_admins enable row level security;
revoke all on private.portfolio_admins from public, anon, authenticated;
grant all on private.portfolio_admins to service_role;

create or replace function private.is_portfolio_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from private.portfolio_admins where user_id = auth.uid()
  );
$$;
revoke all on function private.is_portfolio_admin() from public, anon;
grant execute on function private.is_portfolio_admin() to authenticated, service_role;

create or replace function public.is_portfolio_admin()
returns boolean language sql stable security invoker set search_path = '' as $$
  select private.is_portfolio_admin();
$$;
revoke all on function public.is_portfolio_admin() from public, anon;
grant execute on function public.is_portfolio_admin() to authenticated, service_role;

-- Include the previously unapplied inbox without its permissive legacy policies.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  fullname text not null check (char_length(fullname) between 2 and 100),
  email text not null check (char_length(email) between 3 and 200),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contact_messages_status_idx on public.contact_messages(status);
create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);
create index if not exists profile_featured_project_id_idx on public.profile(featured_project_id);

-- Remove the broad authenticated policies before installing the owner predicate.
do $$
declare item record; table_name text;
begin
  for item in select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public' and tablename = any(array[
      'profile','services','skills','education','experience','projects','blog_posts',
      'faqs','blog_comments','contact_messages','analytics_events'
    ])
  loop
    execute format('drop policy %I on %I.%I', item.policyname, item.schemaname, item.tablename);
  end loop;

  foreach table_name in array array['profile','services','skills','education','experience','projects','faqs']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from public, anon, authenticated', table_name);
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from anon', table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
    execute format('grant all on public.%I to service_role', table_name);
    execute format('create policy "Public content" on public.%I for select to anon, authenticated using (true)', table_name);
    execute format('create policy "Owner insert" on public.%I for insert to authenticated with check ((select private.is_portfolio_admin()))', table_name);
    execute format('create policy "Owner update" on public.%I for update to authenticated using ((select private.is_portfolio_admin())) with check ((select private.is_portfolio_admin()))', table_name);
    execute format('create policy "Owner delete" on public.%I for delete to authenticated using ((select private.is_portfolio_admin()))', table_name);
  end loop;
end $$;

alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from public, anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
create policy "Published articles" on public.blog_posts for select to anon using (status = 'published');
create policy "Published or owner articles" on public.blog_posts for select to authenticated
  using (status = 'published' or (select private.is_portfolio_admin()));
create policy "Owner insert" on public.blog_posts for insert to authenticated with check ((select private.is_portfolio_admin()));
create policy "Owner update" on public.blog_posts for update to authenticated using ((select private.is_portfolio_admin())) with check ((select private.is_portfolio_admin()));
create policy "Owner delete" on public.blog_posts for delete to authenticated using ((select private.is_portfolio_admin()));

-- Public readers receive only public comment columns. Even signed-in non-admins
-- cannot ask the Data API for author_email. The owner email view uses a guarded
-- server read; no email is passed to public React components.
alter table public.blog_comments enable row level security;
revoke all on public.blog_comments from public, anon, authenticated;
grant select(id, post_id, author_name, body, status, created_at, updated_at) on public.blog_comments to anon, authenticated;
grant update(status, updated_at), delete on public.blog_comments to authenticated;
grant all on public.blog_comments to service_role;
create policy "Approved comments" on public.blog_comments for select to anon
  using (status = 'approved' and exists(select 1 from public.blog_posts where id = post_id and status = 'published'));
create policy "Approved or owner comments" on public.blog_comments for select to authenticated
  using ((select private.is_portfolio_admin()) or (status = 'approved' and exists(select 1 from public.blog_posts where id = post_id and status = 'published')));
create policy "Owner moderation" on public.blog_comments for update to authenticated
  using ((select private.is_portfolio_admin())) with check ((select private.is_portfolio_admin()));
create policy "Owner delete" on public.blog_comments for delete to authenticated using ((select private.is_portfolio_admin()));
-- NOT VALID preserves old content while enforcing constraints for new writes.
alter table public.blog_comments add constraint comment_name_length check (char_length(author_name) between 2 and 100) not valid;
alter table public.blog_comments add constraint comment_email_length check (char_length(author_email) between 3 and 200) not valid;
alter table public.blog_comments add constraint comment_body_length check (char_length(body) between 3 and 2000) not valid;

alter table public.contact_messages enable row level security;
alter table public.contact_messages add constraint contact_name_length check (char_length(fullname) between 2 and 100) not valid;
alter table public.contact_messages add constraint contact_email_length check (char_length(email) between 3 and 200) not valid;
alter table public.contact_messages add constraint contact_message_length check (char_length(message) between 10 and 5000) not valid;
revoke all on public.contact_messages from public, anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
create policy "Owner read" on public.contact_messages for select to authenticated using ((select private.is_portfolio_admin()));
create policy "Owner update" on public.contact_messages for update to authenticated using ((select private.is_portfolio_admin())) with check ((select private.is_portfolio_admin()));
create policy "Owner delete" on public.contact_messages for delete to authenticated using ((select private.is_portfolio_admin()));

alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from public, anon, authenticated;
grant select on public.analytics_events to authenticated;
grant all on public.analytics_events to service_role;
create policy "Owner analytics" on public.analytics_events for select to authenticated using ((select private.is_portfolio_admin()));
alter function public.get_analytics_summary() security invoker;
revoke all on function public.get_analytics_summary() from public, anon;
grant execute on function public.get_analytics_summary() to authenticated, service_role;

-- Keep private finance writes behind the guarded server APIs.
revoke all on public.finance_spends, public.finance_config, public.finance_obligations, public.finance_guidelines from public, anon, authenticated;
grant all on public.finance_spends, public.finance_config, public.finance_obligations, public.finance_guidelines to service_role;

-- Only portfolio bucket policies are replaced; unrelated buckets are untouched.
drop policy if exists "Auth upload portfolio storage" on storage.objects;
drop policy if exists "Auth update portfolio storage" on storage.objects;
drop policy if exists "Auth delete portfolio storage" on storage.objects;
create policy "Owner upload portfolio storage" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and (select private.is_portfolio_admin()));
create policy "Owner update portfolio storage" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and (select private.is_portfolio_admin()))
  with check (bucket_id = 'portfolio' and (select private.is_portfolio_admin()));
create policy "Owner delete portfolio storage" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and (select private.is_portfolio_admin()));
update storage.buckets set file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml','application/pdf']
  where id = 'portfolio';

-- Atomic, shared submission limits. Store keyed hashes, never raw IP addresses.
create table private.submission_limits (
  key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
  requests integer not null,
  expires_at timestamptz not null
);
create index submission_limits_expiry_idx on private.submission_limits(expires_at);
alter table private.submission_limits enable row level security;
revoke all on private.submission_limits from public, anon, authenticated;
grant all on private.submission_limits to service_role;

create function public.consume_submission_limit(key_hash text, window_seconds integer, max_requests integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare current_count integer;
begin
  if key_hash !~ '^[a-f0-9]{64}$' or window_seconds not between 1 and 3600 or max_requests not between 1 and 100 then
    raise exception 'Invalid rate limit parameters';
  end if;
  delete from private.submission_limits where expires_at <= now();
  insert into private.submission_limits as limits(key_hash, requests, expires_at)
    values (consume_submission_limit.key_hash, 1, now() + make_interval(secs => window_seconds))
    on conflict on constraint submission_limits_pkey do update set requests = least(limits.requests + 1, max_requests + 1)
    returning requests into current_count;
  return current_count <= max_requests;
end $$;
revoke all on function public.consume_submission_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_submission_limit(text, integer, integer) to service_role;

notify pgrst, 'reload schema';
