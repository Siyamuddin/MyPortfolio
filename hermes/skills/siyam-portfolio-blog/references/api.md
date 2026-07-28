# Agent blog API reference

Base URL: `$SITE_URL` (`https://siyamuddin.com` in production).

All endpoints require:

```http
Authorization: Bearer $BLOG_API_KEY
```

## POST /api/agent/blog

Create a post. Default `status` is `draft`.

**Body (JSON)**

```json
{
  "title": "string (required)",
  "slug": "kebab-case (optional)",
  "body": "mdx string",
  "excerpt": "string",
  "category": "string",
  "date": "Mar 2026",
  "date_time": "2026-03",
  "image": "/images/blog/x.jpg",
  "url": "",
  "status": "draft | published",
  "sort_order": 0
}
```

**201**

```json
{ "ok": true, "post": { "id": "...", "slug": "...", "status": "draft", "title": "..." } }
```

**409** slug conflict · **400** validation · **401** unauthorized · **429** rate limit · **503** not configured

## GET /api/agent/blog/{slug}

Returns one post including `body` (for agent verify). Works for drafts.

**200** `{ "ok": true, "post": { ... } }`  
**404** not found

## PUT /api/agent/blog/{slug}

Partial update. At least one field required.

**200** `{ "ok": true, "post": { ... } }`  
**404** not found · **409** if renaming `slug` collides

## DELETE /api/agent/blog/{slug}

**200** `{ "ok": true, "deleted": { "id": "...", "slug": "...", "title": "..." } }`  
**404** not found

## Errors

All errors: `{ "ok": false, "error": "message" }` (validation may include `errors`).
