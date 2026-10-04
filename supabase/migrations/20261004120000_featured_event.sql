-- Featured event on the About / landing page (admin-selectable).
-- Mirrors profile.featured_project_id: a single optional pointer that falls
-- back to null when the referenced event is deleted, so the homepage can
-- degrade gracefully.

alter table public.profile
  add column if not exists featured_event_id uuid references public.events(id) on delete set null;

notify pgrst, 'reload schema';
