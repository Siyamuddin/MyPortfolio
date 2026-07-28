---
name: siyam-portfolio-admin
description: Use when managing any siyamuddin.com portfolio CMS content via the secured agent admin API (profile, lists, blog, FAQ, comments, upload, seed).
version: 2.0.0
author: Siyam Uddin
license: MIT
metadata:
  hermes:
    tags: [portfolio, cms, admin, blog, api]
    category: portfolio
---

# Siyam Portfolio Admin API

Full CMS control for **siyamuddin.com** through a Bearer-authenticated agent API (same key as before: `BLOG_API_KEY`).

## When to Use

Use this skill for any portfolio CMS task: profile, services, skills, education, experience, projects, blog (MDX), FAQ, comment moderation, file upload, or seeding from static data.

## Credentials

```bash
SITE_URL=https://siyamuddin.com
# Local: SITE_URL=http://localhost:3000
BLOG_API_KEY=<agent admin API key>
```

Every request:

```http
Authorization: Bearer $BLOG_API_KEY
Content-Type: application/json
```

(Upload uses `multipart/form-data` instead of JSON.)

Never print the key unless the user asks.

## Safety rules

1. Prefer blog `status: "draft"` unless the user explicitly asks to publish.
2. Call `GET /api/agent/portfolio` before large edits to see current IDs/slugs.
3. **Seed is destructive** — only `POST /api/agent/seed` when the user clearly confirms wiping CMS data. Body must be `{ "confirm": "SEED_FROM_STATIC" }`.
4. After mutations, verify with GET and report relevant `/admin/...` links.

## Procedure

1. `GET $SITE_URL/api/agent/portfolio` — full snapshot (includes draft blogs)
2. Mutate the needed resource(s)
3. Re-GET portfolio or the specific item
4. Summarize changes + admin URL

## Endpoint map

| Area | Endpoints |
|------|-----------|
| Snapshot | `GET /api/agent/portfolio` |
| Profile | `GET`/`PUT /api/agent/profile` |
| Services | `GET`/`POST /api/agent/services`, `GET`/`PUT`/`DELETE /api/agent/services/{id}` |
| Skills | same under `/api/agent/skills` |
| Education | `/api/agent/education` |
| Experience | `/api/agent/experience` (`highlights: string[]`) |
| Projects | `/api/agent/projects` (category enum) |
| FAQs | `/api/agent/faqs` |
| Blog | `POST /api/agent/blog`, `GET`/`PUT`/`DELETE /api/agent/blog/{slug}` |
| Comments | `GET /api/agent/comments?status=pending`, `PATCH`/`DELETE /api/agent/comments/{id}` |
| Upload | `POST /api/agent/upload` (multipart: `file`, `folder`) |
| Seed | `POST /api/agent/seed` |

Full payloads: load `references/api.md`.

## Blog MDX

Registered components only: `Callout`, `YouTube`, CodeBlock/fenced code, GFM. No arbitrary npm imports in MDX.

## Upload folders

`avatars` | `projects` | `blog` | `skills` | `resume` — max 10MB. Returns `{ url, path }` to store on profile/project/blog fields.

## Pitfalls

- `401` wrong/missing key · `503` key or Supabase missing on server · `409` blog slug conflict · use PUT for existing slugs
- List item IDs are UUIDs; blog keys are slugs
- Do not log the Bearer token

## Verification

Confirm GET reflects the change. For published posts with body: `$SITE_URL/blog/{slug}`. Point the user to `$SITE_URL/admin`.
