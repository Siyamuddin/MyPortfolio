# Admin CMS setup (Supabase)

The public site reads portfolio content via `getPortfolio()`:

1. If Supabase env vars are missing → static `src/data/portfolio.ts`
2. If Supabase errors → static fallback
3. If no `profile` row exists → static fallback
4. Otherwise → live Supabase data (nav stays code-defined)

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. Copy **Project URL** and **anon public** key
3. Copy **service_role** key (Settings → API) — server only, never expose to the browser

## 2. Apply schema

Run these in the Supabase SQL Editor (in order):

1. [`supabase/migrations/001_portfolio.sql`](../supabase/migrations/001_portfolio.sql)
2. [`supabase/migrations/002_content_cms.sql`](../supabase/migrations/002_content_cms.sql)
3. [`supabase/migrations/003_analytics.sql`](../supabase/migrations/003_analytics.sql)

`001` creates profile, services, skills, education, experience, projects, blog_posts, RLS, and the `portfolio` storage bucket.

`002` adds blog `slug` / `body` (MDX) / `status`, plus `faqs` and moderated `blog_comments`.

`003` adds first-party visitor analytics (`analytics_events` + `get_analytics_summary()`).

## 3. Create the admin user

In Supabase **Authentication → Users → Add user**, create one email/password user.  
There is no public signup UI — only this account can sign in at `/admin/login`.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=
CONTACT_TO_EMAIL=

# native | giscus | both
NEXT_PUBLIC_COMMENT_PROVIDER=both
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=

# Long random string — used to hash IP + User-Agent (raw IP is never stored)
ANALYTICS_SALT=replace-with-a-long-random-secret

# Hermes / agent admin API key (Authorization: Bearer <key>)
BLOG_API_KEY=replace-with-a-long-random-secret
```

Add the same values in Vercel → Project → Settings → Environment Variables.

### Giscus setup

1. Install the [giscus app](https://github.com/apps/giscus) on the repo
2. Enable Discussions and create a category
3. Copy repo/category IDs from [giscus.app](https://giscus.app)

## 5. Seed content

1. Start the app: `npm run dev`
2. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
3. Sign in
4. On the dashboard, click **Seed from static data**

That imports everything from `src/data/portfolio.ts` (including MDX bodies and FAQs). After a profile row exists, the public site serves Supabase data.

## 6. Editing content

Use `/admin` sections:

- Profile (avatar + resume uploads)
- Services, Skills, Education, Experience, Projects
- **Blog** — slug, MDX body, draft/published
- **FAQ** — About page accordion + FAQPage schema
- **Comments** — approve/reject native comments
- **Dashboard → Visitors** — page views + unique visitors by day / month / year

Uploads go to the `portfolio` Storage bucket (`avatars/`, `projects/`, `blog/`, `skills/`, `resume/`).

Published posts with a body are available at `/blog/{slug}`. List cards prefer the article route, then an external `url`, otherwise a non-clickable card.

## 7. Visitor analytics

Privacy-friendly first-party tracking (no third-party cookies):

1. Public pages send a beacon to `/api/analytics/collect` on each navigation
2. The API stores `path` + a SHA-256 `visitor_hash` of `ANALYTICS_SALT + IP + User-Agent` (never the raw IP)
3. `/admin` and `/api` paths are ignored; obvious bots are skipped
4. Admin dashboard shows today / this month / this year summaries, plus tables by day (30d), month (12m), and year

Unique visitors for a month or year use `COUNT(DISTINCT visitor_hash)` over that period (not a sum of daily uniques).

## 8. Extending MDX with a new npm package

CMS MDX cannot `import` arbitrary packages at runtime (unsafe). Use the code registry:

1. `npm install <package>`
2. Add a wrapper under `src/components/mdx/`
3. Register it in [`src/components/mdx/registry.tsx`](../src/components/mdx/registry.tsx)
4. Use `<WrapperName />` in the post MDX from admin

Built-ins: `Callout`, `YouTube`, `CodeBlock`, plus styled GFM elements.

## 9. Hermes agent admin API

Full CMS access for an external agent (e.g. Hermes). Auth is a shared secret (`BLOG_API_KEY`, the agent admin API key) — **not** your admin password.

### Auth header

```http
Authorization: Bearer <BLOG_API_KEY>
Content-Type: application/json
```

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/agent/portfolio` | Full CMS snapshot (includes draft blogs) |
| `GET`/`PUT` | `/api/agent/profile` | Read / upsert profile |
| `GET`/`POST` | `/api/agent/{resource}` | List / create (`services`, `skills`, `education`, `experience`, `projects`, `faqs`) |
| `GET`/`PUT`/`DELETE` | `/api/agent/{resource}/{id}` | By UUID |
| `POST` | `/api/agent/blog` | Create post (default `draft`) |
| `GET`/`PUT`/`DELETE` | `/api/agent/blog/{slug}` | By slug |
| `GET` | `/api/agent/comments?status=` | List comments |
| `PATCH`/`DELETE` | `/api/agent/comments/{id}` | Moderate / delete |
| `POST` | `/api/agent/upload` | Multipart `file` + `folder` (`avatars`\|`projects`\|`blog`\|`skills`\|`resume`) |
| `POST` | `/api/agent/seed` | Destructive wipe+seed; body `{ "confirm": "SEED_FROM_STATIC" }` |

Example snapshot:

```bash
export SITE_URL=https://siyamuddin.com
export BLOG_API_KEY=your-key

curl -sS "$SITE_URL/api/agent/portfolio" \
  -H "Authorization: Bearer $BLOG_API_KEY"
```

### Hermes skill

- Template (no secrets): [`hermes/skills/siyam-portfolio-admin/`](../hermes/skills/siyam-portfolio-admin/)
- Paste-ready with credentials (gitignored): `hermes/skills/siyam-portfolio-admin.PASTE.md`
- Installed locally at: `~/.hermes/skills/portfolio/siyam-portfolio-admin/SKILL.md`

```bash
mkdir -p ~/.hermes/skills/portfolio/siyam-portfolio-admin
cp hermes/skills/siyam-portfolio-admin.PASTE.md ~/.hermes/skills/portfolio/siyam-portfolio-admin/SKILL.md
```

Add the same `BLOG_API_KEY` in Vercel so production accepts the agent.

## Notes

- Nav labels/routes stay in code (`navPages` / SEO helpers)
- Without Supabase env vars the site keeps working from static data
- Contact form and pending-comment alerts use Resend (`RESEND_API_KEY` / `CONTACT_TO_EMAIL`)
- Comment alerts soft-fail (comment still saves) if Resend is not configured
- Analytics soft-fail if Supabase / service role is missing
- Agent admin API soft-fails with `503` if `BLOG_API_KEY` or Supabase is missing
- Never commit `*.PASTE.md` or real API keys
- Seed via API is destructive — require explicit confirmation
