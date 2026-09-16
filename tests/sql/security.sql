begin;
insert into auth.users(id,email,email_confirmed_at) values
 ('11111111-1111-4111-8111-111111111111','owner@example.test',now()),
 ('22222222-2222-4222-8222-222222222222','visitor@example.test',now());
insert into private.portfolio_admins(user_id) values('11111111-1111-4111-8111-111111111111');
insert into public.blog_posts(id,title,category,date,date_time,excerpt,image,url,slug,body,status) values
 ('33333333-3333-4333-8333-333333333333','Published','Test','Today','2026-09-16','Test','','','published-test','Test article','published'),
 ('44444444-4444-4444-8444-444444444444','Draft','Test','Today','2026-09-16','Test','','','draft-test','Private draft','draft');
insert into public.blog_comments(post_id,author_name,author_email,body,status) values
 ('33333333-3333-4333-8333-333333333333','Test Visitor','private@example.test','Approved comment','approved'),
 ('33333333-3333-4333-8333-333333333333','Test Visitor','private@example.test','Pending comment','pending');
insert into public.contact_messages(fullname,email,message) values ('Test Visitor','private@example.test','A private test message.');

set local role anon;
do $$ begin
  if (select count(*) from public.blog_posts) <> 1 then raise exception 'FAIL: anon can read drafts'; end if;
  if (select count(id) from public.blog_comments) <> 1 then raise exception 'FAIL: pending comments visible'; end if;
  if has_column_privilege('public.blog_comments','author_email','SELECT') then raise exception 'FAIL: public comment email'; end if;
  if has_table_privilege('public.blog_comments','INSERT') then raise exception 'FAIL: public comment insert'; end if;
  if has_table_privilege('public.contact_messages','INSERT') then raise exception 'FAIL: public inbox insert'; end if;
  if has_function_privilege('public.get_analytics_summary()','EXECUTE') then raise exception 'FAIL: public analytics function'; end if;
  if has_function_privilege('public.consume_submission_limit(text,integer,integer)','EXECUTE') then raise exception 'FAIL: public limiter execution'; end if;
end $$;
reset role;

set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","user_metadata":{"role":"admin"}}';
set local role authenticated;
do $$ declare rows_changed integer; begin
  if public.is_portfolio_admin() then raise exception 'FAIL: registered visitor accepted as admin'; end if;
  if (select count(*) from public.blog_posts) <> 1 then raise exception 'FAIL: visitor can read drafts'; end if;
  if (select count(id) from public.contact_messages) <> 0 then raise exception 'FAIL: visitor can read inbox'; end if;
  if has_table_privilege('public.profile','TRUNCATE') then raise exception 'FAIL: visitor can truncate profile'; end if;
  if has_column_privilege('public.blog_comments','author_email','SELECT') then raise exception 'FAIL: visitor can read email'; end if;
  update public.blog_posts set title = 'Tampered';
  get diagnostics rows_changed = row_count;
  if rows_changed <> 0 then raise exception 'FAIL: visitor can edit content'; end if;
  begin
    insert into storage.objects(bucket_id,name) values('portfolio','forbidden.txt');
    raise exception 'FAIL: visitor can upload';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
set local role authenticated;
do $$ declare rows_changed integer; begin
  if not public.is_portfolio_admin() then raise exception 'FAIL: owner denied'; end if;
  if (select count(*) from public.blog_posts) <> 2 then raise exception 'FAIL: owner cannot read draft'; end if;
  if (select count(*) from public.contact_messages) <> 1 then raise exception 'FAIL: owner cannot read inbox'; end if;
  update public.blog_comments set status = 'approved', updated_at = now() where status = 'pending';
  get diagnostics rows_changed = row_count;
  if rows_changed <> 1 then raise exception 'FAIL: owner moderation denied'; end if;
  insert into storage.objects(bucket_id,name) values('portfolio','owner.png');
  update storage.objects set name = 'owner-updated.png' where bucket_id = 'portfolio';
  delete from storage.objects where bucket_id = 'portfolio';
end $$;
reset role;

set local role service_role;
do $$ begin
  for i in 1..5 loop
    if not public.consume_submission_limit(repeat('a',64),60,5) then raise exception 'FAIL: allowed submission denied'; end if;
  end loop;
  if public.consume_submission_limit(repeat('a',64),60,5) then raise exception 'FAIL: sixth submission accepted'; end if;
  update private.submission_limits set expires_at = now() - interval '1 second';
  if not public.consume_submission_limit(repeat('a',64),60,5) then raise exception 'FAIL: limit did not expire'; end if;
  if (select count(author_email) from public.blog_comments) <> 2 then raise exception 'FAIL: guarded server cannot read moderation emails'; end if;
end $$;
reset role;
rollback;
select 'PASS: anonymous, non-admin, owner, storage, comments, inbox, drafts, and shared rate limits' as result;
