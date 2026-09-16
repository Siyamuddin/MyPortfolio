import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sourceLoader } from './load-source.mjs';

test('admin timestamps remain identical across server and browser time zones', () => {
  const { formatTimestamp } = sourceLoader()('src/lib/format-timestamp.ts');
  for (const value of ['2026-09-16T00:30:00Z', '2026-09-16T09:30:00+09:00', '2026-09-15T17:30:00-07:00']) {
    assert.equal(formatTimestamp(value), '2026-09-16 00:30 UTC');
  }
  assert.equal(formatTimestamp('invalid'), 'Unknown date');
});

test('owner authorization is checked against the database and fails closed', async () => {
  const { isPortfolioAdmin } = sourceLoader()('src/lib/supabase/authorization.ts');
  assert.equal(await isPortfolioAdmin({ rpc: async () => ({ data: true, error: null }) }), true);
  assert.equal(await isPortfolioAdmin({ rpc: async () => ({ data: false, error: null }) }), false);
  assert.equal(await isPortfolioAdmin({ rpc: async () => ({ data: true, error: { code: 'unavailable' } }) }), false);
});

test('finance client validates arrays and missing configuration before rendering', async () => {
  for (const data of [null, {}, { ok: true, data: [] }]) {
    const client = sourceLoader({}, { fetch: async () => ({ ok: true, json: async () => ({ ok: true, data }) }) })('src/lib/finance/client-api.ts');
    await assert.rejects(() => client.getSpends(), /incomplete|unavailable/);
    await assert.rejects(() => client.getConfig(), /incomplete|unavailable/);
  }
});

test('finance unavailable database produces an error instead of an empty success', async () => {
  const { GET } = sourceLoader({
    '@/lib/finance/auth': { guardFinanceRequest: async () => null },
    '@/lib/finance/supabase': { getSpends: async () => { throw new Error('mock outage'); } },
  })('src/app/api/agent/finance/spends/route.ts');
  const response = await GET({ nextUrl: new URL('https://example.test/api/agent/finance/spends') });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});

test('calendar and monetary validation rejects impossible values', () => {
  const { monthSchema, dateSchema, amountSchema } = sourceLoader()('src/lib/finance/validation.ts');
  for (const input of ['2026-00', '2026-13', '0000-01']) assert.equal(monthSchema.safeParse(input).success, false);
  for (const input of ['2026-02-29', '2026-04-31', '2026-99-99']) assert.equal(dateSchema.safeParse(input).success, false);
  assert.equal(dateSchema.safeParse('2028-02-29').success, true);
  assert.equal(amountSchema.safeParse(-1).success, false);
});

test('public comment mapping never serializes email, even if a wider row is supplied', () => {
  const { mapBlogComment } = sourceLoader()('src/lib/portfolio/mappers.ts');
  assert.equal(JSON.stringify(mapBlogComment({ id: 'test', author_name: 'Visitor', author_email: 'private@example.test', body: 'Comment' })).includes('private@example.test'), false);
});

test('CMS failure does not republish static article content', async () => {
  const chain = { select() { return this; }, eq() { return this; }, maybeSingle: async () => ({ error: { code: 'offline' } }) };
  const load = sourceLoader({
    react: { cache: fn => fn }, 'next/cache': { unstable_cache: fn => fn },
    '@supabase/supabase-js': { createClient: () => ({ from: () => chain }) },
    '@/lib/supabase/env': { isSupabaseConfigured: () => true },
  }, { process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.test', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock' } } });
  await assert.rejects(() => load('src/lib/portfolio/repository.ts').getBlogPostBySlug('sample'), /temporarily unavailable/);
});

test('production static seeding is denied before connecting to the database', async () => {
  const load = sourceLoader({
    '@/lib/agent/common': {}, '@/lib/supabase/admin': { createServiceClient: () => { throw new Error('must not connect'); } },
  }, { process: { env: { NODE_ENV: 'production', ALLOW_DESTRUCTIVE_SEED: 'true' } } });
  const result = await load('src/lib/agent/seed.ts').seedFromStatic('SEED_FROM_STATIC');
  assert.equal(result.status, 403);
});

test('shared limiter hashes identifiers and fails closed during database outages', async () => {
  let sent;
  const request = { headers: new Headers({ 'x-forwarded-for': '192.0.2.1' }) };
  const setup = (response) => sourceLoader({
    '@/lib/supabase/env': { isSupabaseConfigured: () => true },
    '@/lib/supabase/admin': { createServiceClient: () => ({ rpc: async (_name, args) => { sent = args; return response; } }) },
  }, { process: { env: { NODE_ENV: 'production', SUPABASE_SERVICE_ROLE_KEY: 'test-only' } } })('src/lib/rate-limit.ts');
  assert.equal(await setup({ data: true, error: null }).guardSubmissionRate(request, 'contact'), null);
  assert.match(sent.key_hash, /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(sent).includes('192.0.2.1'), false);
  const blocked = await setup({ data: false, error: null }).guardSubmissionRate(request, 'contact');
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get('Retry-After'), '60');
  assert.equal((await setup({ data: null, error: { code: 'offline' } }).guardSubmissionRate(request, 'contact')).status, 503);
});
