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

Run [`supabase/migrations/001_portfolio.sql`](../supabase/migrations/001_portfolio.sql) in the Supabase SQL Editor.

This creates:

- Tables: `profile`, `services`, `skills`, `education`, `experience`, `projects`, `blog_posts`
- RLS: public `SELECT`, authenticated `INSERT`/`UPDATE`/`DELETE`
- Storage bucket: `portfolio` (public read, authenticated write)

## 3. Create the admin user

In Supabase **Authentication → Users → Add user**, create one email/password user.  
There is no public signup UI — only this account can sign in at `/admin/login`.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Add the same values in Vercel → Project → Settings → Environment Variables.

## 5. Seed content

1. Start the app: `npm run dev`
2. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
3. Sign in
4. On the dashboard, click **Seed from static data**

That imports everything from `src/data/portfolio.ts`. After a profile row exists, the public site serves Supabase data.

## 6. Editing content

Use `/admin` sections:

- Profile (avatar + resume uploads)
- Services, Skills, Education, Experience, Projects, Blog

Uploads go to the `portfolio` Storage bucket (`avatars/`, `projects/`, `blog/`, `skills/`, `resume/`).

## Notes

- Nav labels/routes stay in code (`navPages` / SEO helpers)
- Without Supabase env vars the site keeps working from static data
- Contact form (`/api/contact`) is unchanged and still uses Resend
