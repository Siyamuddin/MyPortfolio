-- Run only against the disposable database bootstrapped by test-database.sh.
begin;
insert into auth.users(id,email,email_confirmed_at) values
 ('11111111-1111-4111-8111-111111111111','owner@example.test',now()),
 ('22222222-2222-4222-8222-222222222222','visitor@example.test',now());
insert into private.portfolio_admins(user_id) values('11111111-1111-4111-8111-111111111111');

-- The migration seeds the Digital AF starter tags into the registry.
do $$ begin
  if (select count(*) from public.tags where slug in
       ('hackathon','elevenlabs','lovable','mixroom-ai','daw','voice-assistant','seoul','korea-blockchain-week')) <> 8
  then raise exception 'FAIL: seeded tag registry'; end if;
  if (select label from public.tags where slug = 'mixroom-ai') <> 'Mixroom.ai'
  then raise exception 'FAIL: seeded tag label'; end if;
end $$;

set local role anon;
do $$ begin
  if (select count(*) from public.tags) < 8 then raise exception 'FAIL: anonymous tag read'; end if;
  if has_table_privilege('public.tags','INSERT') then raise exception 'FAIL: anonymous tag insert privilege'; end if;
end $$;
reset role;

-- Visitors (signed-in, non-admin) cannot write the registry.
set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';
set local role authenticated;
do $$ begin
  begin
    insert into public.tags(slug,label) values('forbidden','Forbidden');
    raise exception 'FAIL: visitor can write tag registry';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- Owner can manage the registry and tagged content; slugs auto-generate.
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
set local role authenticated;
do $$
declare a uuid; b uuid; slug_a text; slug_b text;
begin
  insert into public.tags(slug,label) values('owner-tag','Owner Tag')
    on conflict (slug) do update set label = excluded.label;
  if (select label from public.tags where slug = 'owner-tag') <> 'Owner Tag'
  then raise exception 'FAIL: owner tag upsert'; end if;

  -- Slug trigger fills a unique slug when none is provided.
  insert into public.events(title,category,date,tags)
    values('Digital AF Seoul','Hackathon','2026-09-10',array['seoul','hackathon'])
    returning id, slug into a, slug_a;
  insert into public.events(title,category,date)
    values('Digital AF Seoul','Hackathon','2026-09-11')
    returning id, slug into b, slug_b;
  if slug_a is null or slug_a = '' then raise exception 'FAIL: event slug generation'; end if;
  if slug_a = slug_b then raise exception 'FAIL: event slug uniqueness'; end if;
  if (select array_length(tags,1) from public.events where id = a) <> 2
  then raise exception 'FAIL: event tags persistence'; end if;

  -- The 12-tag ceiling is enforced.
  begin
    update public.events set tags = (select array_agg('t'||g) from generate_series(1,13) g) where id = a;
    raise exception 'FAIL: tag ceiling not enforced';
  exception when check_violation then null; end;

  delete from public.events where id in (a,b);
end $$;
reset role;
rollback;
select 'PASS: tag registry access control, seeded tags, event slug generation, and tag ceilings' as result;
