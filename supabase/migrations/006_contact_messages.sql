-- Contact form submissions inbox

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  fullname text not null,
  email text not null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Visitors may submit a message, but the row is always created unread.
-- No public SELECT policy is defined, so submissions are never readable by anon.
create policy "Public insert contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (status = 'unread');

create policy "Auth read contact messages"
  on public.contact_messages for select
  to authenticated
  using (true);

create policy "Auth update contact messages"
  on public.contact_messages for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (true);
