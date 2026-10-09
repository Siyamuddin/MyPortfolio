import { test } from "node:test";
import assert from "node:assert/strict";
import { sourceLoader } from "./load-source.mjs";

const eventId = "11111111-1111-4111-8111-111111111111";
const photoId = "22222222-2222-4222-8222-222222222222";
const event = {
  title: "Campus hackathon", category: "Hackathon", date: "2026-09-20",
  location: "Seoul", organizer: "University", description: "A weekend of building.",
  highlight: "Finalist", url: "https://example.com/event", status: "draft",
  photos: [{ id: photoId, url: "https://example.com/photo.jpg", caption: "The team", alt: "Our team presenting a prototype" }],
};
const form = (overrides = {}) => {
  const data = new FormData();
  for (const [key, value] of Object.entries({ ...event, ...overrides })) {
    data.set(key, key === "photos" ? JSON.stringify(value) : value);
  }
  return data;
};

function actionHarness({ authorized = true, result = { data: { id: eventId }, error: null } } = {}) {
  const writes = [];
  const invalidations = [];
  const uploads = [];
  const tagWrites = [];
  const query = {
    update(row) { writes.push({ operation: "update", row }); return this; },
    insert(row) { writes.push({ operation: "insert", row }); return this; },
    delete() { writes.push({ operation: "delete" }); return this; },
    upsert(rows) { tagWrites.push(rows); return Promise.resolve({ error: null }); },
    eq(column, value) { writes.at(-1).filter = [column, value]; return this; },
    select() { return this; },
    async maybeSingle() { return result; },
  };
  const storage = {
    async upload(path, file, options) { uploads.push({ path, file, options }); return { error: null }; },
    getPublicUrl(path) { return { data: { publicUrl: `https://example.supabase.co/storage/v1/object/public/portfolio/${path}` } }; },
  };
  const cache = {
    revalidateTag: (tag) => invalidations.push(tag),
    revalidatePath: (path) => invalidations.push(path),
    unstable_cache: (fn) => fn,
  }
  const { revalidatePortfolio } = sourceLoader({ "next/cache": cache })("src/lib/portfolio/auth.ts")
  const actions = sourceLoader({
    "@/lib/portfolio/auth": {
      requireAdmin: async () => {
        if (!authorized) throw new Error("Unauthorized");
        return { supabase: { from: () => query, storage: { from: () => storage } } };
      },
      revalidatePortfolio,
    },
    "next/cache": cache,
  }, { File, FormData, Uint8Array })("src/lib/portfolio/event-actions.ts");
  return { actions, writes, invalidations, uploads, tagWrites };
}

test("events reject impossible dates, unsafe URLs, duplicate photos and excessive albums", () => {
  const { eventSchema } = sourceLoader()("src/lib/portfolio/events.ts");
  assert.equal(eventSchema.safeParse(event).success, true);
  for (const override of [
    { date: "2026-02-30" }, { date: "2026-2-3" },
    { url: "javascript:alert(1)" }, { url: "https://user:password@example.com" },
    { photos: [{ ...event.photos[0], url: "data:image/svg+xml,<svg/>" }] },
    { photos: [{ ...event.photos[0], url: "//example.com/image.jpg" }] },
    { photos: [event.photos[0], event.photos[0]] },
    { photos: Array.from({ length: 21 }, (_, i) => ({ ...event.photos[0], id: `22222222-2222-4222-8222-${String(i).padStart(12, "0")}` })) },
  ]) assert.equal(eventSchema.safeParse({ ...event, ...override }).success, false, JSON.stringify(override));
});

test("event date labels preserve calendar dates in every visitor timezone", () => {
  const { formatEventDate, isValidEventDate } = sourceLoader()("src/lib/portfolio/events.ts");
  assert.equal(formatEventDate("2026-09-20"), "September 20, 2026");
  assert.equal(isValidEventDate("2024-02-29"), true);
  assert.equal(isValidEventDate("2025-02-29"), false);
});

test("all event mutations require portfolio owner authorization", async () => {
  const { actions, writes, uploads } = actionHarness({ authorized: false });
  assert.equal((await actions.upsertEventAction(form())).ok, false);
  assert.equal((await actions.deleteEventAction(eventId)).ok, false);
  assert.equal((await actions.uploadEventPhotoAction(new FormData())).ok, false);
  assert.equal(writes.length, 0);
  assert.equal(uploads.length, 0);
});

test("saving events preserves ordered captions and invalidates published content", async () => {
  const { actions, writes, invalidations } = actionHarness();
  assert.equal((await actions.upsertEventAction(form({ id: eventId, status: "published" }))).ok, true);
  assert.equal(writes[0].operation, "update");
  assert.deepEqual(Array.from(writes[0].filter), ["id", eventId]);
  assert.equal(writes[0].row.photos[0].caption, "The team");
  assert.equal(writes[0].row.status, "published");
  assert.ok(invalidations.includes("portfolio"));
  assert.ok(invalidations.includes("portfolio-tags"));
  assert.ok(invalidations.includes("portfolio-events"));
  assert.ok(invalidations.includes("/"));
  assert.ok(invalidations.includes("/sitemap.xml"));
});

test("invalid form input never writes or erases existing photo collections", async () => {
  const { actions, writes } = actionHarness();
  const brokenPhotos = form();
  brokenPhotos.set("photos", "broken-json");
  assert.equal((await actions.upsertEventAction(brokenPhotos)).ok, false);
  assert.equal((await actions.upsertEventAction(form({ date: "2026-02-30" }))).ok, false);
  assert.equal((await actions.deleteEventAction("not-an-id")).ok, false);
  assert.equal(writes.length, 0);
});

test("missing and concurrently deleted events do not report successful writes", async () => {
  const absent = actionHarness({ result: { data: null, error: null } });
  assert.equal((await absent.actions.upsertEventAction(form({ id: eventId }))).ok, false);
  assert.equal((await absent.actions.deleteEventAction(eventId)).ok, false);
  assert.equal(absent.invalidations.length, 0);
  const missingTable = actionHarness({ result: { data: null, error: { code: "PGRST205" } } });
  assert.match((await missingTable.actions.upsertEventAction(form())).error, /migration/);
});

test("deleting an event invalidates its public listing", async () => {
  const { actions, writes, invalidations } = actionHarness();
  assert.equal((await actions.deleteEventAction(eventId)).ok, true);
  assert.equal(writes[0].operation, "delete");
  assert.ok(invalidations.includes("portfolio-events"));
  assert.ok(invalidations.includes("/sitemap.xml"));
});

test("photo uploads reject oversized, unsupported and MIME-spoofed files", async () => {
  const { actions, uploads } = actionHarness();
  for (const file of [
    new File([new Uint8Array(4 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }),
    new File(["<svg/>"], "vector.svg", { type: "image/svg+xml" }),
    new File(["<script>alert(1)</script>"], "fake.png", { type: "image/png" }),
  ]) {
    const data = new FormData(); data.set("file", file);
    assert.equal((await actions.uploadEventPhotoAction(data)).ok, false);
  }
  assert.equal(uploads.length, 0);
});

test("photo uploads use a generated filename and preserve the validated MIME type", async () => {
  const { actions, uploads } = actionHarness();
  const data = new FormData();
  const bytes = new Uint8Array(4 * 1024 * 1024);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10]);
  data.set("file", new File([bytes], "../../unsafe.html", { type: "image/png" }));
  const result = await actions.uploadEventPhotoAction(data);
  assert.equal(result.ok, true);
  assert.match(result.url, /\/portfolio\/events\/[a-f0-9-]+\.png$/);
  assert.equal(uploads[0].options.upsert, false);
  assert.equal(uploads[0].options.contentType, "image/png");
  assert.equal(uploads[0].file.size, 4 * 1024 * 1024);
});

function repositoryHarness({ configured = true, result = { data: [], error: null }, authorized = true } = {}) {
  const queries = [];
  const query = {
    select() { return this; },
    eq(column, value) { queries.push(["eq", column, value]); return this; },
    order(column, options) { queries.push(["order", column, options.ascending]); return this; },
    then(resolve) { return Promise.resolve(result).then(resolve); },
  };
  const repository = sourceLoader({
    react: { cache: (fn) => fn }, "next/cache": { unstable_cache: (fn) => fn },
    "@supabase/supabase-js": { createClient: () => ({ from: () => query }) },
    "@/lib/supabase/env": { isSupabaseConfigured: () => configured },
    "@/lib/portfolio/auth": { requireAdmin: async () => {
      if (!authorized) throw new Error("Unauthorized");
      return { supabase: { from: () => query } };
    } },
  }, {
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test" } },
  })("src/lib/portfolio/events-repository.ts");
  return { repository, queries };
}

test("public events are empty without configuration or during schema rollout", async () => {
  for (const options of [{ configured: false }, { result: { data: null, error: { code: "PGRST205" } } }]) {
    const { repository } = repositoryHarness(options);
    assert.equal((await repository.getPublishedEvents()).length, 0);
  }
});

test("public event query only requests published events ordered newest first", async () => {
  const { repository, queries } = repositoryHarness({ result: { data: [{ ...event, id: eventId, status: "published" }], error: null } });
  assert.equal((await repository.getPublishedEvents())[0].title, event.title);
  assert.deepEqual(queries[0], ["eq", "status", "published"]);
  assert.deepEqual(queries[1], ["order", "date", false]);
});

test("admin events require authorization and surface missing schema", async () => {
  await assert.rejects(() => repositoryHarness({ authorized: false }).repository.getAdminEvents(), /Unauthorized/);
  await assert.rejects(() => repositoryHarness({ result: { data: null, error: { code: "42P01" } } }).repository.getAdminEvents(), /migration/);
});

test("event rows map to camelCase and derive a slug when the column is absent", () => {
  const { eventRowSchema, mapEventRow, resolveEventCover } = sourceLoader()("src/lib/portfolio/events.ts");
  const parsed = eventRowSchema.parse({ ...event, id: eventId, status: "published" });
  const mapped = mapEventRow(parsed);
  assert.equal(mapped.slug, "campus-hackathon");
  assert.deepEqual([...mapped.tags], []);
  assert.equal(mapped.ogImage, "");

  const withExtras = mapEventRow(eventRowSchema.parse({
    ...event, id: eventId, slug: "custom-slug", tags: ["seoul", "seoul"],
    og_image: "/images/cover.jpg", updated_at: "2026-09-21T00:00:00Z",
  }));
  assert.equal(withExtras.slug, "custom-slug");
  assert.deepEqual([...withExtras.tags], ["seoul"]);
  assert.equal(withExtras.updatedAt, "2026-09-21T00:00:00Z");
  // Explicit OG image wins; otherwise the first photo is the cover.
  assert.equal(resolveEventCover(withExtras), "/images/cover.jpg");
  assert.equal(resolveEventCover({ ...withExtras, ogImage: "" }), event.photos[0].url);
});

test("saving an event with tags stores slugs and syncs the registry labels", async () => {
  const { actions, writes, invalidations, tagWrites } = actionHarness();
  const data = form({ id: eventId, status: "published" });
  data.set("tags", JSON.stringify(["Mixroom.ai", "Seoul"]));
  data.set("og_image", "https://example.com/cover.jpg");
  assert.equal((await actions.upsertEventAction(data)).ok, true);
  assert.deepEqual([...writes[0].row.tags], ["mixroom-ai", "seoul"]);
  assert.equal(writes[0].row.og_image, "https://example.com/cover.jpg");
  assert.ok(invalidations.includes("portfolio-tags"));
  assert.equal(tagWrites.length, 1);
  assert.deepEqual([...tagWrites[0]].map((row) => row.slug), ["mixroom-ai", "seoul"]);
  assert.equal([...tagWrites[0]].find((row) => row.slug === "mixroom-ai").label, "Mixroom.ai");
});
