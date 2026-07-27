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

`001` creates profile, services, skills, education, experience, projects, blog_posts, RLS, and the `portfolio` storage bucket.

`002` adds blog `slug` / `body` (MDX) / `status`, plus `faqs` and moderated `blog_comments`.

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

Uploads go to the `portfolio` Storage bucket (`avatars/`, `projects/`, `blog/`, `skills/`, `resume/`).

Published posts with a body are available at `/blog/{slug}`. List cards prefer the article route, then an external `url`, otherwise a non-clickable card.

## 7. Extending MDX with a new npm package

CMS MDX cannot `import` arbitrary packages at runtime (unsafe). Use the code registry:

1. `npm install <package>`
2. Add a wrapper under `src/components/mdx/`
3. Register it in [`src/components/mdx/registry.tsx`](../src/components/mdx/registry.tsx)
4. Use `<WrapperName />` in the post MDX from admin

Built-ins: `Callout`, `YouTube`, `CodeBlock`, plus styled GFM elements.

## Notes

- Nav labels/routes stay in code (`navPages` / SEO helpers)
- Without Supabase env vars the site keeps working from static data
- Contact form and pending-comment alerts use Resend (`RESEND_API_KEY` / `CONTACT_TO_EMAIL`)
- Comment alerts soft-fail (comment still saves) if Resend is not configured
