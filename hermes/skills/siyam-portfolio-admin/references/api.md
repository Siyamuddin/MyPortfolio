# Agent admin API reference

Base: `$SITE_URL` · Auth: `Authorization: Bearer $BLOG_API_KEY`

## GET /api/agent/portfolio

Returns `{ ok, portfolio: { profile, services, skills, education, experience, projects, blogPosts, faqs } }` (all blog statuses).

## Profile

### GET /api/agent/profile
### PUT /api/agent/profile

```json
{
  "name": "Siyam Uddin",
  "title": "...",
  "email": "...",
  "location": "...",
  "bio": ["paragraph"],
  "bio_highlight": "",
  "socials": {
    "github": "",
    "linkedin": "",
    "googlescholar": "",
    "facebook": "",
    "youtube": "",
    "twitter": ""
  },
  "avatar": "",
  "resume_url": null
}
```

## List resources

Pattern for `services`, `skills`, `education`, `experience`, `projects`, `faqs`:

- `GET /api/agent/{resource}` → `{ items: [...] }`
- `POST /api/agent/{resource}` → create
- `GET|PUT|DELETE /api/agent/{resource}/{uuid}`

### services create

`{ "title", "description", "icon": "Code2", "sort_order"? }`

### skills create

`{ "name", "color", "icon", "sort_order"? }`

### education create

`{ "school", "degree", "period", "description", "sort_order"? }`

### experience create

`{ "role", "company", "period", "location", "highlights": [], "sort_order"? }`

### projects create

```json
{
  "title": "...",
  "category": "Web Development | Applications | Automation",
  "image": "",
  "url": "",
  "description": "",
  "sort_order": 0
}
```

### faqs create

`{ "question", "answer", "sort_order"? }`

PUT bodies are partial (at least one field).

## Blog

- `POST /api/agent/blog` — create; default `status: draft`; optional `slug`
- `GET|PUT|DELETE /api/agent/blog/{slug}`

Create fields: `title`, `slug?`, `body`, `excerpt`, `category`, `date`, `date_time`, `image`, `url`, `status`, `sort_order`

## Comments

- `GET /api/agent/comments?status=pending|approved|rejected`
- `PATCH /api/agent/comments/{id}` `{ "status": "approved" }`
- `DELETE /api/agent/comments/{id}`

## Upload

`POST /api/agent/upload` multipart:

- `file` — binary
- `folder` — `avatars` | `projects` | `blog` | `skills` | `resume`

Response: `{ ok, url, path }`

## Seed (destructive)

`POST /api/agent/seed`

```json
{ "confirm": "SEED_FROM_STATIC" }
```

Wipes CMS tables and reloads from static portfolio data.

## Errors

`{ "ok": false, "error": "..." }` — 400 / 401 / 404 / 409 / 429 / 503
