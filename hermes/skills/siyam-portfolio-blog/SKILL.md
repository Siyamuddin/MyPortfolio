---
name: siyam-portfolio-blog
description: Use when creating, updating, or deleting blog posts on siyamuddin.com via the secured agent API.
version: 1.0.0
author: Siyam Uddin
license: MIT
metadata:
  hermes:
    tags: [blog, portfolio, mdx, api]
    category: portfolio
---

# Siyam Portfolio Blog API

Manage MDX blog posts on the portfolio site through a Bearer-authenticated API.

## When to Use

Use this skill when the user asks you to write, revise, publish, unpublish, or delete a blog post for **siyamuddin.com**.

## Credentials

Set these before calling the API (prefer environment variables; never print the key unless asked):

```bash
SITE_URL=https://siyamuddin.com
# Local testing:
# SITE_URL=http://localhost:3000
BLOG_API_KEY=<from user env / Vercel / paste skill>
```

Auth header on every request:

```http
Authorization: Bearer $BLOG_API_KEY
Content-Type: application/json
```

## Status rules

- Default status is **`draft`** (safe).
- Only set `"status": "published"` when the user explicitly asks to publish.
- Drafts do not appear on the public `/blog` list.

## MDX components (registered only)

You may use these in `body` — do **not** invent npm imports:

- `<Callout type="info|warn|tip" title="...">...</Callout>`
- `<YouTube id="VIDEO_ID" title="..." />`
- `<CodeBlock>...</CodeBlock>` (or fenced markdown code blocks)
- Standard GFM: headings, lists, links, tables

## Procedure (upsert)

1. Derive a kebab-case `slug` from the title (lowercase, hyphens).
2. `GET $SITE_URL/api/agent/blog/{slug}`
   - If `404` → `POST $SITE_URL/api/agent/blog` with full payload
   - If `200` → `PUT $SITE_URL/api/agent/blog/{slug}` with changed fields
3. Prefer `status: "draft"` unless told to publish.
4. `GET` again to verify; report `slug`, `status`, and admin URL `$SITE_URL/admin/blog`.

### Create example

```bash
curl -sS -X POST "$SITE_URL/api/agent/blog" \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My new post",
    "slug": "my-new-post",
    "excerpt": "Short summary",
    "category": "Tutorial",
    "body": "## Intro\n\nHello from Hermes.\n",
    "status": "draft"
  }'
```

### Update example

```bash
curl -sS -X PUT "$SITE_URL/api/agent/blog/my-new-post" \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"published","body":"## Intro\n\nUpdated body.\n"}'
```

### Delete example

```bash
curl -sS -X DELETE "$SITE_URL/api/agent/blog/my-new-post" \
  -H "Authorization: Bearer $BLOG_API_KEY"
```

### Get / verify

```bash
curl -sS "$SITE_URL/api/agent/blog/my-new-post" \
  -H "Authorization: Bearer $BLOG_API_KEY"
```

## Payload fields

| Field | Create | Notes |
|-------|--------|-------|
| `title` | required | Max 300 |
| `slug` | optional | Auto from title if omitted; kebab-case |
| `body` | optional | MDX string, max 200k |
| `excerpt` | optional | Card summary |
| `category` | optional | Default `General` |
| `date` | optional | Display label e.g. `Mar 2026` |
| `date_time` | optional | e.g. `2026-03` |
| `image` | optional | URL or `/images/...` path (no upload in v1) |
| `url` | optional | External fallback URL |
| `status` | optional | `draft` (default) or `published` |
| `sort_order` | optional | Integer |

For full schemas, load: `references/api.md`

## Pitfalls

- `401` → wrong or missing `BLOG_API_KEY`
- `409` → slug already exists on create; use PUT instead
- `503` → API key or Supabase not configured on the server
- Do not log the Bearer token
- Image upload is not supported via this API; pass an existing image path/URL

## Verification

After create/update:

1. GET returns `ok: true` and expected `status` / `body`
2. If published + body set → public URL `$SITE_URL/blog/{slug}` should load
3. Tell the user to review in `$SITE_URL/admin/blog`
