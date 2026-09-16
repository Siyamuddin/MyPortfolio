# Audit fixes — 16 September 2026

This release preserves the existing public design and CMS content while repairing the findings from the September audit.

## Changes

- Require a database owner allowlist in admin routes, server actions, finance session authorization, CMS policies, and storage policies. Public signup is disabled in production.
- Remove public comment email access, restrict drafts to their owner, restrict analytics, and block direct anonymous submissions.
- Create the missing contact inbox. Report delivery failures accurately, retain form text, and show an email alternative. Contact and comments use a shared database rate limit with hashed identifiers.
- Validate and unwrap finance responses, distinguish database failures from empty results, and reject invalid dates and negative amounts.
- Escape structured data safely, correct article navigation, provide independent project links and local image fallbacks, fix mobile overflow, add visible form labels, and improve keyboard dialog behavior.
- Improve page descriptions, headings, social-image fallbacks, structured facts, and sitemap modification dates.
- Patch dependencies, block destructive production seeding, and add CI checks.
- Defer desktop 3D effects and omit them on mobile or when reduced motion is requested. The CMS production build estimates homepage initial JavaScript at 146 kB, down from 391 kB. These are build estimates, not Core Web Vitals measurements.

## Verification

- Clean `npm ci`; lint, 35 isolated regression tests, production build, and TypeScript checks pass.
- Dependency audit reports zero known vulnerabilities in the installed lockfile.
- All migrations and owner/non-admin/anonymous database-policy tests pass in disposable PostgreSQL. CI repeats these checks on PostgreSQL 17.
- Six public page types checked at actual widths 320, 390, 768, and 1440 pixels, with no horizontal overflow.
- Public pages have one H1, canonical URLs, valid JSON-LD, and social images. Missing articles return 404/noindex; admin login remains noindex.
- Production Data API denies anonymous access to comment emails, finance, inbox, raw analytics and analytics summaries. Public signup is confirmed disabled.
- Delivery tests use mocks. No real contact email, comment, finance entry, or new account was created.

## Database deployment and maintenance

`20260916012653_portfolio_audit_security.sql` is a forward migration applied to production. The existing owner was independently verified and added to `private.portfolio_admins`; that identity is deliberately not hardcoded in portable migrations.

Existing production schema was compared with a clean database built from the historical migrations. Versions 001–005 were recorded as a reviewed baseline. Version 006 was recorded as satisfied by the equivalent inbox schema in the security migration. Its permissive legacy policies were **not** replayed. The migration history records this distinction. Future deployments must apply only new migrations, never replay old SQL or run a production seed.

For a new environment, apply the migration chain and bootstrap an independently verified owner through a trusted database administrator. Public visitors must not have access to the private schema. The two private tables intentionally have RLS with no public policies; service-role/server operations and the guarded owner-check function provide the required access.

Required production settings: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY`. The service role is required for validated submissions and shared rate limiting. `RATE_LIMIT_SALT` may supply a separate hashing secret. Resend is optional when inbox persistence works. Configure a verified sender separately if enabling external email delivery; the existing Resend onboarding sender has provider restrictions.

Run database tests only against a fresh disposable local database:

```sh
TEST_DATABASE_URL=postgresql://localhost/portfolio_test bash scripts/test-database.sh
```

The script refuses non-local URLs and nonempty application databases. Sample seeding is allowed only when `NODE_ENV=development` and `ALLOW_DESTRUCTIVE_SEED=true`.

## Remaining external limits

Supabase leaked-password protection requires a Pro plan on this project and remains disabled. No paid plan was purchased. Newly created indexes may show informational “unused index” notices until relevant traffic occurs; indexes are not removed solely because their counters are zero.

A full screen-reader/cross-browser certification, external mailbox receipt, load testing, backup restore drill, Search Console evaluation and real-user Core Web Vitals measurement are outside the verified results. PageSpeed previously returned a quota error. A passing build or smaller JavaScript bundle does not establish those outcomes.
