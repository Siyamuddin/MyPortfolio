# Events journal

The public `/events` page shows published event stories, newest event date first. Manage stories at `/admin/events` using the existing portfolio owner account. New events start as drafts. Add a title, category and event date, then optional location, organizer, description, highlight and event link.

Upload up to 20 photos per event. JPEG, PNG, WebP, AVIF and GIF are supported, with a 4 MB limit per photo. Each photo can have a visible caption and an accessible description. Reorder photos to change the gallery; the first photo is the cover. Save changes after editing or removing photos. Photos use the existing public `portfolio` bucket and its owner-only upload policies. Removing a photo or deleting its event removes the gallery reference; uploaded files remain in Storage so a reused image is not accidentally deleted.

The per-file limit leaves room for multipart form fields within [Vercel's 4.5 MB function request limit](https://vercel.com/docs/functions/limitations#request-body-size). The admin uploads selected photos individually. Next.js accepts up to 5 MB per server action request, while the upload action enforces the stricter 4 MB photo limit.

Publish when the story is ready. Only published event records are readable by visitors, including visitors signed into a non-admin account. Draft photo files use the same public bucket as other portfolio images, so anyone who already knows a photo's URL can retrieve it.

Each published event also has its own crawlable detail page at `/events/[slug]`, with `Event` structured data, a canonical URL, and tags. See [`docs/seo-events.md`](./seo-events.md) for the full SEO architecture and the checklist for every new event.

## Featured event on the home page

The About / landing page (`/`) spotlights a single event instead of a flagship project. Pick it under **Profile → Featured event (Home page spotlight)** in the admin. The selector lists published events; choose one and save, or clear it to hide the spotlight entirely.

The spotlight card matches the dark + yellow UI and links to the event's `/events/[slug]` detail page plus the `/events` index. It is backed by `profile.featured_event_id`, which points at a single event and falls back to null if that event is deleted. If the referenced event is missing, unpublished, or unset, the home page omits the section rather than breaking.

Saving the profile revalidates the home page immediately, and editing the featured event's content (title, cover photo, highlight, etc.) from **Admin → Events** also revalidates `/`, so the spotlight stays in sync. Featured work selection still lives on the profile form and the full project list remains on `/portfolio`; only the home-page spotlight changed.

## Database setup

Apply `supabase/migrations/20261003111642_portfolio_events.sql` after the existing portfolio migrations. It adds only the `events` table, its index, grants and owner-only write policies. It depends on `private.is_portfolio_admin()` from the portfolio security migration and reuses the existing Storage bucket; no additional environment variables are required. This migration is already applied to the portfolio's existing Supabase project; its filename matches the recorded remote migration version.

Then apply `supabase/migrations/20261004120000_featured_event.sql`. It adds a single nullable `profile.featured_event_id` column with a foreign key to `public.events(id)` and `on delete set null`, mirroring `featured_project_id`. Apply it with the Supabase CLI (`supabase db push`) or by running the SQL in the Supabase SQL editor. It is idempotent (`add column if not exists`) and requires no data backfill or new environment variables.

Without Supabase configuration or while the new table is absent, the public page shows an empty journal. The admin page shows a setup error if the database table is missing. Other portfolio content queries are independent of the events table.

## Verification

Run `node --test tests/events.test.mjs` for validation, authorization, upload checks, cache invalidation and publication query coverage. Run `TEST_DATABASE_URL=postgresql://localhost/portfolio_test bash scripts/test-database.sh` against an empty disposable local PostgreSQL database to validate the complete migration chain and anonymous, non-admin and owner access. The script refuses non-local and nonempty databases.
