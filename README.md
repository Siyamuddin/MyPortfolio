# Siyam Uddin — portfolio

Next.js 15 site for [siyamuddin.com](https://siyamuddin.com): projects, blog, events, and a Supabase-backed admin CMS.

## Develop

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm test
npm run lint
npm run typecheck
TEST_DATABASE_URL=postgresql://localhost/portfolio_test bash scripts/test-database.sh
```

`scripts/test-database.sh` needs a disposable local `TEST_DATABASE_URL`.

## Docs

- [Admin CMS](docs/admin-cms.md)
- [Events](docs/events.md)
- [SEO and events](docs/seo-events.md)
