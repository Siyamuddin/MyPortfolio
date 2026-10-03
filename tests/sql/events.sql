-- Run only against the disposable database bootstrapped by test-database.sh.
begin;
insert into auth.users(id,email,email_confirmed_at) values
 ('11111111-1111-4111-8111-111111111111','owner@example.test',now()),
 ('22222222-2222-4222-8222-222222222222','visitor@example.test',now());
insert into private.portfolio_admins(user_id) values('11111111-1111-4111-8111-111111111111');
insert into public.events(id,title,category,date,status,photos) values
 ('33333333-3333-4333-8333-333333333333','Published event','Hackathon','2026-09-01','published', '[{"id":"55555555-5555-4555-8555-555555555555","url":"https://example.test/photo.png","caption":"Team presentation","alt":"A team at the stage"}]'),
 ('44444444-4444-4444-8444-444444444444','Private draft','University','2026-09-02','draft','[]');

set local role anon;
do $$ begin
  if (select count(*) from public.events) <> 1 then raise exception 'FAIL: anonymous event draft visibility'; end if;
  if has_table_privilege('public.events','INSERT') or has_table_privilege('public.events','TRUNCATE') then raise exception 'FAIL: anonymous events mutation privilege'; end if;
end $$;
reset role;

set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","user_metadata":{"role":"admin"}}';
set local role authenticated;
do $$ declare changed integer; begin
  if (select count(*) from public.events) <> 1 then raise exception 'FAIL: visitor event draft visibility'; end if;
  update public.events set title = 'Tampered';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'FAIL: visitor can update events'; end if;
  delete from public.events;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'FAIL: visitor can delete events'; end if;
  begin
    insert into public.events(title,category,date) values('Forbidden','Other','2026-09-03');
    raise exception 'FAIL: visitor can create events';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
set local role authenticated;
do $$ declare new_id uuid; changed integer; begin
  if (select count(*) from public.events) <> 2 then raise exception 'FAIL: owner cannot read event drafts'; end if;
  insert into public.events(title,category,date) values('Owner event','Conference','2026-09-03') returning id into new_id;
  if (select status from public.events where id = new_id) <> 'draft' then raise exception 'FAIL: event must default to draft'; end if;
  update public.events set title = 'Edited event', status = 'published', photos = '[{"id":"66666666-6666-4666-8666-666666666666","url":"https://example.test/photo.png","caption":"New caption","alt":"Team"}]' where id = new_id;
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'FAIL: owner event edit'; end if;
  if (select photos->0->>'caption' from public.events where id = new_id) <> 'New caption' then raise exception 'FAIL: event caption persistence'; end if;
  begin
    update public.events set photos = '{}' where id = new_id;
    raise exception 'FAIL: object accepted as album';
  exception when check_violation then null; end;
  delete from public.events where id = new_id;
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'FAIL: owner event delete'; end if;
end $$;
reset role;
rollback;
select 'PASS: events published visibility, owner CRUD, photo captions, draft privacy, and visitor isolation' as result;
