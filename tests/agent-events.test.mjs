import { test } from "node:test"
import assert from "node:assert/strict"
import { sourceLoader } from "./load-source.mjs"

const eventId = "11111111-1111-4111-8111-111111111111"
const photoId = "22222222-2222-4222-8222-222222222222"
const minimal = {
  title: "Campus hackathon",
  category: "Hackathon",
  date: "2026-09-20",
}

const storedEvent = (overrides = {}) => ({
  id: eventId,
  slug: "campus-hackathon",
  title: "Campus hackathon",
  category: "Hackathon",
  date: "2026-09-20",
  location: "Seoul",
  organizer: "University",
  description: "A weekend of building.",
  highlight: "Finalist",
  url: "https://example.com/event",
  status: "draft",
  photos: [],
  tags: [],
  og_image: "",
  created_at: "2026-10-07T00:00:00.000Z",
  updated_at: "2026-10-07T00:00:00.000Z",
  ...overrides,
})

const readyEnv = {
  BLOG_API_KEY: "test-only-key",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
}

function harness({ responses = [], env = readyEnv } = {}) {
  const writes = []
  const invalidations = []
  const queue = [...responses]
  const from = (table) => {
    const state = { table, operation: "select", row: undefined, filters: [], orders: [], options: undefined }
    const finish = () => {
      writes.push({
        table: state.table,
        operation: state.operation,
        row: Array.isArray(state.row)
          ? state.row.map((item) => ({ ...item }))
          : state.row ? { ...state.row } : state.row,
        filters: state.filters.map((entry) => [...entry]),
        orders: state.orders.map((entry) => [...entry]),
        options: state.options,
      })
      return queue.shift() ?? { data: null, error: null }
    }
    const builder = {
      select() { return builder },
      order(...args) { state.orders.push(args); return builder },
      eq(column, value) { state.filters.push([column, value]); return builder },
      insert(row) { state.operation = "insert"; state.row = row; return builder },
      update(row) { state.operation = "update"; state.row = row; return builder },
      delete() { state.operation = "delete"; return builder },
      upsert(row, options) {
        state.operation = "upsert"
        state.row = row
        state.options = options
        return Promise.resolve(finish())
      },
      maybeSingle() { return Promise.resolve(finish()) },
      single() { return Promise.resolve(finish()) },
      then(resolve, reject) { return Promise.resolve(finish()).then(resolve, reject) },
    }
    return builder
  }
  const cache = {
    revalidateTag: (tag) => invalidations.push(["tag", tag]),
    revalidatePath: (path, type) => invalidations.push(["path", path, type ?? null]),
    unstable_cache: (fn) => fn,
  }
  const NextResponse = {
    json(body, init = {}) {
      return { body, status: init.status ?? 200 }
    },
  }
  const load = sourceLoader({
    "next/cache": cache,
    "next/server": { NextResponse },
    "@/lib/supabase/admin": { createServiceClient: () => ({ from, rpc: async () => ({ data: true, error: null }) }) },
  }, { Buffer, process: { env } })
  return { writes, invalidations, cache, load }
}

const clone = (value) => JSON.parse(JSON.stringify(value))

let ip = 1
const request = ({ body, auth = "Bearer test-only-key", failJson = false } = {}) => ({
  headers: {
    get(name) {
      const key = String(name).toLowerCase()
      if (key === "authorization") return auth
      if (key === "x-forwarded-for") return `203.0.113.${ip++}`
      return null
    },
  },
  json: async () => {
    if (failJson) throw new Error("invalid json")
    return body
  },
})

const expectRefresh = (cache, invalidations) => {
  const seen = invalidations.splice(0, invalidations.length)
  const { refreshEvents } = sourceLoader({ "next/cache": cache })("src/lib/portfolio/events-cache.ts")
  const before = invalidations.length
  refreshEvents()
  assert.deepEqual(seen, invalidations.slice(before))
  for (const entry of [
    ["tag", "portfolio"],
    ["tag", "portfolio-tags"],
    ["tag", "portfolio-events"],
    ["path", "/", "layout"],
    ["path", "/sitemap.xml", null],
  ]) {
    assert.ok(
      seen.some((actual) => actual.every((value, index) => value === entry[index])),
      `missing cache refresh ${JSON.stringify(entry)}`
    )
  }
  return seen
}

test("event agent create accepts a short body and rejects unsafe event fields", () => {
  const { load } = harness()
  const { createEventSchema, updateEventSchema } = load("src/lib/agent/events.ts")
  const created = createEventSchema.safeParse(minimal)
  assert.equal(created.success, true)
  assert.equal(created.data.status, "draft")
  assert.equal(created.data.location, "")
  assert.deepEqual(clone(created.data.photos), [])
  assert.deepEqual(clone(created.data.tags), [])
  assert.equal(created.data.slug, undefined)
  assert.equal("id" in created.data, false)

  const published = createEventSchema.safeParse({ ...minimal, status: "published", slug: "campus-hackathon" })
  assert.equal(published.success, true)
  assert.equal(published.data.status, "published")
  assert.equal(published.data.slug, "campus-hackathon")

  for (const override of [
    { date: "2026-02-30" },
    { category: "Party" },
    { url: "javascript:alert(1)" },
    { status: "archived" },
    { slug: "Campus Hackathon" },
    { photos: [{ id: photoId, url: "data:image/svg+xml,<svg/>", caption: "", alt: "" }] },
    { photos: [
      { id: photoId, url: "https://example.com/a.jpg", caption: "", alt: "" },
      { id: photoId, url: "https://example.com/b.jpg", caption: "", alt: "" },
    ] },
    { tags: ["Not A Slug"] },
  ]) {
    assert.equal(createEventSchema.safeParse({ ...minimal, ...override }).success, false, JSON.stringify(override))
  }

  assert.equal(updateEventSchema.safeParse({}).success, false)
  const partial = updateEventSchema.safeParse({ status: "published" })
  assert.equal(partial.success, true)
  assert.deepEqual(clone(partial.data), { status: "published" })
})

test("creating an event defaults to draft and refreshes the public events cache", async () => {
  const { writes, invalidations, cache, load } = harness({
    responses: [{ data: storedEvent(), error: null }],
  })
  const routes = load("src/app/api/agent/events/route.ts")
  const response = await routes.POST(request({ body: minimal }))
  assert.equal(response.status, 201)
  assert.equal(response.body.event.slug, "campus-hackathon")
  assert.equal(response.body.event.status, "draft")
  assert.equal(writes[0].operation, "insert")
  assert.equal(writes[0].table, "events")
  assert.equal(writes[0].row.status, "draft")
  assert.equal(writes[0].row.location, "")
  assert.equal("slug" in writes[0].row, false)
  assert.equal("id" in writes[0].row, false)
  assert.equal(writes.some((write) => write.table === "tags"), false)
  expectRefresh(cache, invalidations)
})

test("published creates keep the requested slug, photos, and tag registry", async () => {
  const photos = [{ id: photoId, url: "https://example.com/photo.jpg", caption: "The team", alt: "Our team presenting" }]
  const { writes, load } = harness({
    responses: [{ data: storedEvent({ status: "published", slug: "campus-day", photos, tags: ["hackathon"] }), error: null }],
  })
  const { createEvent, createEventSchema } = load("src/lib/agent/events.ts")
  const result = await createEvent(createEventSchema.parse({
    ...minimal,
    status: "published",
    slug: "campus-day",
    location: "Seoul",
    photos,
    tags: ["hackathon", "hackathon"],
  }))
  assert.equal(result.ok, true)
  assert.equal(writes[0].row.status, "published")
  assert.equal(writes[0].row.slug, "campus-day")
  assert.equal(writes[0].row.photos[0].caption, "The team")
  assert.deepEqual(clone(writes[0].row.tags), ["hackathon"])
  const tags = writes.find((write) => write.table === "tags")
  assert.equal(tags.operation, "upsert")
  assert.equal(tags.row[0].slug, "hackathon")
  assert.equal(tags.row[0].label, "Hackathon")
  assert.equal(tags.options.onConflict, "slug")
})

test("listing events includes drafts and does not filter by status", async () => {
  const draft = storedEvent()
  const published = storedEvent({
    id: "33333333-3333-4333-8333-333333333333",
    slug: "published-night",
    title: "Published night",
    status: "published",
  })
  const { writes, load } = harness({
    responses: [{ data: [draft, published], error: null }],
  })
  const routes = load("src/app/api/agent/events/route.ts")
  const response = await routes.GET(request())
  assert.equal(response.status, 200)
  assert.deepEqual(clone(response.body.events.map((event) => event.status)), ["draft", "published"])
  assert.equal(writes[0].operation, "select")
  assert.deepEqual(writes[0].filters, [])
  assert.deepEqual(clone(writes[0].orders[0]), ["date", { ascending: false }])
  assert.deepEqual(clone(writes[0].orders[1]), ["created_at", { ascending: false }])
})

test("slug routes read, update, and delete drafts and refresh the public cache when renamed", async () => {
  const renamed = storedEvent({ slug: "finals-weekend", status: "published" })
  const { writes, invalidations, cache, load } = harness({
    responses: [
      { data: storedEvent(), error: null },
      { data: { id: eventId, slug: "campus-hackathon" }, error: null },
      { data: renamed, error: null },
      { data: { id: eventId, slug: "finals-weekend", title: "Campus hackathon" }, error: null },
      { data: { id: eventId }, error: null },
    ],
  })
  const routes = load("src/app/api/agent/events/[slug]/route.ts")
  const params = Promise.resolve({ slug: "campus-hackathon" })

  const read = await routes.GET(request(), { params })
  assert.equal(read.status, 200)
  assert.equal(read.body.event.status, "draft")
  assert.equal(read.body.event.slug, "campus-hackathon")

  const updated = await routes.PUT(request({ body: { status: "published", slug: "finals-weekend" } }), { params })
  assert.equal(updated.status, 200)
  assert.equal(updated.body.event.slug, "finals-weekend")
  assert.equal(writes[1].operation, "select")
  assert.deepEqual(writes[1].filters, [["slug", "campus-hackathon"]])
  assert.equal(writes[2].operation, "update")
  assert.deepEqual(writes[2].filters, [["id", eventId]])
  assert.equal(writes[2].row.status, "published")
  assert.equal(writes[2].row.slug, "finals-weekend")
  assert.equal("tags" in writes[2].row, false)

  const seen = invalidations.splice(0, invalidations.length)
  const { refreshEvents } = sourceLoader({ "next/cache": cache })("src/lib/portfolio/events-cache.ts")
  refreshEvents()
  assert.deepEqual(seen, invalidations.splice(0, invalidations.length))

  const removed = await routes.DELETE(request(), { params: Promise.resolve({ slug: "finals-weekend" }) })
  assert.equal(removed.status, 200)
  assert.deepEqual(clone(removed.body.deleted), {
    id: eventId,
    slug: "finals-weekend",
    title: "Campus hackathon",
  })
  assert.equal(writes.at(-1).operation, "delete")
  expectRefresh(cache, invalidations)
})

test("partial updates do not clear omitted tags or refresh a missing event", async () => {
  const { writes, invalidations, load } = harness({
    responses: [{ data: null, error: null }],
  })
  const { updateEventBySlug } = load("src/lib/agent/events.ts")
  const missing = await updateEventBySlug("missing-event", { highlight: "Finalist" })
  assert.equal(missing.ok, false)
  assert.equal(missing.status, 404)
  assert.equal(writes.some((write) => write.operation === "update"), false)
  assert.equal(invalidations.length, 0)
})

test("duplicate slugs, a missing events table, and a deleted row do not report success", async () => {
  const duplicate = harness({
    responses: [{ data: null, error: { code: "23505", message: "duplicate key" } }],
  })
  const { createEvent } = duplicate.load("src/lib/agent/events.ts")
  const conflict = await createEvent({
    ...minimal,
    status: "draft",
    slug: "campus-hackathon",
    location: "",
    organizer: "",
    description: "",
    highlight: "",
    url: "",
    photos: [],
    tags: [],
    og_image: "",
  })
  assert.equal(conflict.status, 409)
  assert.equal(duplicate.invalidations.length, 0)

  const missingTable = harness({
    responses: [{ data: null, error: { code: "PGRST205", message: "schema cache" } }],
  })
  const listed = await missingTable.load("src/lib/agent/events.ts").listEvents()
  assert.equal(listed.status, 503)
  assert.match(listed.error, /migration/)

  const deleted = harness({
    responses: [
      { data: { id: eventId, slug: "campus-hackathon", title: "Campus hackathon" }, error: null },
      { data: null, error: null },
    ],
  })
  const removed = await deleted.load("src/lib/agent/events.ts").deleteEventBySlug("campus-hackathon")
  assert.equal(removed.status, 404)
  assert.equal(deleted.invalidations.length, 0)
})

test("agent event routes require the blog API key and a configured database", async () => {
  const unauthenticated = harness()
  const open = unauthenticated.load("src/app/api/agent/events/route.ts")
  const denied = await open.GET(request({ auth: null }))
  assert.equal(denied.status, 401)
  assert.equal(unauthenticated.writes.length, 0)

  const wrongKey = await open.POST(request({ auth: "Bearer invalid", body: minimal }))
  assert.equal(wrongKey.status, 401)

  const noKey = harness({ env: {} })
  const unavailable = await noKey.load("src/app/api/agent/events/route.ts").GET(request())
  assert.equal(unavailable.status, 503)
  assert.match(unavailable.body.error, /not configured/i)

  const noDatabase = harness({
    env: { BLOG_API_KEY: "test-only-key" },
  })
  const blocked = await noDatabase.load("src/app/api/agent/events/route.ts").POST(request({ body: minimal }))
  assert.equal(blocked.status, 503)
  assert.match(blocked.body.error, /Supabase is not configured/)
  assert.equal(noDatabase.writes.length, 0)
})

test("invalid event JSON never writes", async () => {
  const { writes, invalidations, load } = harness()
  const routes = load("src/app/api/agent/events/route.ts")
  const item = load("src/app/api/agent/events/[slug]/route.ts")
  const broken = await routes.POST(request({ failJson: true }))
  const invalid = await routes.POST(request({ body: { ...minimal, date: "2026-02-30" } }))
  const emptyUpdate = await item.PUT(request({ body: {} }), { params: Promise.resolve({ slug: "campus-hackathon" }) })
  const badSlug = await item.GET(request(), { params: Promise.resolve({ slug: "%" }) })
  assert.equal(broken.status, 400)
  assert.equal(invalid.status, 400)
  assert.equal(emptyUpdate.status, 400)
  assert.equal(badSlug.status, 400)
  assert.equal(writes.length, 0)
  assert.equal(invalidations.length, 0)
})

test("portfolio snapshot includes draft events and survives a missing events table", async () => {
  const snapshotHarness = (eventsResult) => {
    const tables = []
    const from = (table) => {
      const builder = {
        select() { return builder },
        order() { return builder },
        limit() { return builder },
        maybeSingle() {
          tables.push(table)
          return Promise.resolve({ data: { id: "profile-1" }, error: null })
        },
        then(resolve, reject) {
          tables.push(table)
          const payload = table === "events" ? eventsResult : { data: [], error: null }
          return Promise.resolve(payload).then(resolve, reject)
        },
      }
      return builder
    }
    const { getPortfolioSnapshot } = sourceLoader({
      "@/lib/supabase/admin": { createServiceClient: () => ({ from, rpc: async () => ({ data: true, error: null }) }) },
    }, {
      process: {
        env: {
          NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
          SUPABASE_SERVICE_ROLE_KEY: "service",
        },
      },
    })("src/lib/agent/profile.ts")
    return { getPortfolioSnapshot, tables }
  }

  const present = snapshotHarness({
    data: [{ id: eventId, status: "draft", slug: "campus-hackathon" }],
    error: null,
  })
  const snapshot = await present.getPortfolioSnapshot()
  assert.equal(snapshot.ok, true)
  assert.equal(snapshot.portfolio.events[0].status, "draft")
  assert.ok(present.tables.includes("events"))

  const missing = snapshotHarness({ data: null, error: { code: "PGRST205", message: "missing" } })
  const empty = await missing.getPortfolioSnapshot()
  assert.equal(empty.ok, true)
  assert.equal(empty.portfolio.events.length, 0)
  assert.ok(Array.isArray(empty.portfolio.blogPosts))

  const broken = snapshotHarness({ data: null, error: { code: "XX000", message: "boom" } })
  const failed = await broken.getPortfolioSnapshot()
  assert.equal(failed.ok, false)
  assert.equal(failed.error, "boom")
})
