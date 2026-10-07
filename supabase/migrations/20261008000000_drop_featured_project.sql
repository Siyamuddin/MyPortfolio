-- Drop the write-only featured project pointer after the app stops writing it.

drop index if exists public.profile_featured_project_id_idx;
alter table public.profile drop column if exists featured_project_id;
