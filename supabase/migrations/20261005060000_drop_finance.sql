-- Drop the personal finance tables created in 005_finance.sql.
-- Production already applied an equivalent drop (migration name drop_finance).
-- This forward migration keeps a fresh database in line with that schema.
-- DROP POLICY requires its table, so each policy is removed only when the
-- table still exists. DROP TABLE IF EXISTS is safe if the tables are already gone.

do $$
declare
  item record;
begin
  for item in
    select *
    from (
      values
        ('finance_spends', 'Service role full access finance_spends'),
        ('finance_config', 'Service role full access finance_config'),
        ('finance_obligations', 'Service role full access finance_obligations'),
        ('finance_guidelines', 'Service role full access finance_guidelines')
    ) as policies(table_name, policy_name)
  loop
    if to_regclass('public.' || item.table_name) is not null then
      execute format(
        'drop policy if exists %I on public.%I',
        item.policy_name,
        item.table_name
      );
    end if;
  end loop;
end $$;

drop table if exists public.finance_spends;
drop table if exists public.finance_config;
drop table if exists public.finance_obligations;
drop table if exists public.finance_guidelines;
