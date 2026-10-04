# SEO architecture & the reusable event SEO plan

This portfolio has a single, centralized SEO layer so every route type produces
consistent, high-quality metadata and structured data without hand-rolling tags
per page. New events and blog posts get full SEO automatically — publish and the
rest (meta, Open Graph, structured data, sitemap, tag pages) follows.

## The pieces

| Concern | Where | Notes |
| --- | --- | --- |
| Metadata builder | `src/lib/seo.ts` → `buildPageMetadata` | One function every route uses for `<title>`, description, canonical, Open Graph and Twitter. Override hooks: `ogTitle`, `ogImage`, `openGraphType`, `publishedTime`/`modifiedTime`, `keywords`. |
| Fixed-page metadata | `src/lib/seo.ts` → `buildProfileAwarePageSeo` | Home, resume, portfolio, events, blog, contact. |
| Structured data | `src/lib/seo/jsonld.tsx` | `buildEventJsonLd`, `buildEventItemListJsonLd`, `buildTagItemListJsonLd`, plus the existing Person/Website/Breadcrumb/BlogPosting builders. |
| Helpers | `src/lib/seo.ts` | `resolveOgImage` (reference → absolute OG image with fallback), `toMetaDescription` (clamp long text), `absoluteUrl`. |
| Sitemap | `src/app/sitemap.ts` | Auto-includes published events (`/events/[slug]`, `lastmod` from `updated_at`), blog posts, tag pages and the tags index. |
| Robots | `src/app/robots.ts` | `/admin/` and `/api/` stay disallowed; the sitemap is advertised. |

## Events

- Every published event has a crawlable detail page at `/events/[slug]`.
- The slug is generated from the title by a database trigger
  (`generate_event_slug`) and stays stable across edits, so canonical URLs do
  not churn. Direct database inserts and the Supabase dashboard work without
  supplying a slug.
- The detail page emits `Event` JSON-LD (name, `startDate`, `location`,
  `organizer`, `award` from the highlight, `keywords` from tags, `image` from the
  cover) and a breadcrumb. `H1` is the event title. Canonical + unique
  title/description/OG/Twitter come from the event fields.
- The `/events` listing emits `ItemList` JSON-LD whose items point at the detail
  URLs, and each card/featured hero links to the detail page.

### Checklist for every new event

The create/edit flow at `/admin/events` already captures everything SEO needs.
When adding an event, confirm:

1. **Title** — becomes the `H1`, `<title>`, slug, and `Event.name`.
2. **Category, date, location, organizer** — power the meta description, the
   `Event` schema, and the on-page metadata. The date is required.
3. **Description / highlight** — the description seeds the meta description; if
   left blank it is auto-generated from category, date, location and organizer.
   The highlight maps to `Event.award`.
4. **Tags** — add topic tags (see below). They render as crawlable chips, feed
   the `keywords`, and list the event on each `/tags/[slug]` page.
5. **Cover photo** — the first photo is the cover and the default OG image.
   Optionally set a **Social image URL** to override it.
6. **Publish** — only published events appear on the site, in the sitemap, in the
   `ItemList`, and on tag pages. Publishing revalidates `/events`, the detail
   page, `/tags`, and the sitemap automatically.

No manual meta, schema, or sitemap edits are ever required.

## Blog posts

Blog articles follow the same model: `/blog/[slug]` uses `buildPageMetadata`
with `openGraphType: "article"`, `publishedTime`/`modifiedTime`, an OG image from
the post's `og_image` (falling back to the cover image, then the shared default),
`keywords` from tags, and `BlogPosting` JSON-LD. The admin blog form exposes
tags and an optional social image URL. Empty excerpts should be filled in;
titles always drive the `H1` and `<title>`.

## Tags / hashtags

- **Model** — a normalized registry table `public.tags` (`slug` + display
  `label`), plus `tags text[]` columns on `events`, `blog_posts` and `projects`.
- **Admin** — a tag editor (`TagsInput`) on the event, blog and project forms.
  You type labels; the server slugifies them, dedupes, stores the slugs on the
  content row, and upserts the registry labels.
- **Public** — crawlable chips on event detail pages, blog articles and project
  cards link to `/tags/[slug]`.
- **Pages** — `/tags` lists every tag used by published content with counts;
  `/tags/[slug]` lists the matching articles, events and projects with
  `ItemList` JSON-LD and unique metadata. Both are in the sitemap.
- **Seeded tags** — the migration seeds the Digital AF Seoul starter tags
  (`hackathon`, `elevenlabs`, `lovable`, `mixroom-ai`, `daw`, `voice-assistant`,
  `seoul`, `korea-blockchain-week`) and attaches them to the Digital AF event
  when present.

## Database setup

Apply `supabase/migrations/20261004100000_portfolio_tags_seo.sql` after the
existing portfolio migrations. It is additive and forward-only:

- adds `slug`, `tags`, `og_image` to `events` (slug backfilled from titles, made
  unique, kept populated by the `generate_event_slug` trigger);
- adds `tags` and `og_image` to `blog_posts` and `projects`, with GIN indexes and
  a 12-tag ceiling;
- creates the `public.tags` registry with owner-only write RLS
  (`private.is_portfolio_admin()`), reusing the existing security model;
- seeds the starter tags and tags the Digital AF event.

No new environment variables are required. Without Supabase configured, tag
pages fall back to labels derived from slugs and the system still builds.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build` — static checks and the
  full App Router build (events detail, tag pages, sitemap).
- `node --test tests/*.test.mjs` — unit coverage, including tag slugification,
  the event model (slug/tags/og_image) and sitemap composition.
- `TEST_DATABASE_URL=postgresql://localhost/portfolio_test bash scripts/test-database.sh`
  — runs the full migration chain against a disposable local PostgreSQL database
  and checks anonymous, non-admin and owner access for events and the tag
  registry.
