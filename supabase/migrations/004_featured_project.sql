-- Featured project on About page (admin-selectable)

alter table public.profile
  add column if not exists featured_project_id uuid references public.projects(id) on delete set null;

-- PostgREST caches the schema, so new columns stay invisible to the API until reload.
notify pgrst, 'reload schema';
